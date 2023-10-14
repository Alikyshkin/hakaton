import {
    BadRequestException,
    Controller,
    Get,
    Param,
    Post,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { SalePointService } from './sale-point.service';
import { SalePointDto } from '../dtos/sale-point.dto';
import { BulkCreateSalePointDto } from "../dtos/bulk-create-sale-point.dto";
import {ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiOperation} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import * as fs from "fs";
import {FileUploadDto} from "../dtos/file-upload.dto";

@Controller('sale-point')
export class SalePointController {
    constructor(private salePointService: SalePointService) {}

    @Get()
    @ApiOkResponse({ type: [SalePointDto] })
    @ApiOperation({ summary: 'Gets all sale points' })
    async getAllSalePoints(): Promise<SalePointDto[]> {
        return this.salePointService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: SalePointDto })
    @ApiOperation({ summary: 'Gets concrete sale point' })
    async getSalePoint(@Param('id') id: number): Promise<SalePointDto> {
        return this.salePointService.findOne(id);
    }

    @Post('/bulk-create')
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: FileUploadDto })
    @ApiCreatedResponse({ type: [SalePointDto] })
    @ApiOperation({ summary: 'Creates multiple sale points from a JSON file' })
    @UseInterceptors(FileInterceptor('file'))
    async createBulk(@UploadedFile() file): Promise<SalePointDto[]> {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const salePointsDtos: BulkCreateSalePointDto[] = JSON.parse(file.buffer.toString());
        return this.salePointService.createBulk(salePointsDtos);
    }
}