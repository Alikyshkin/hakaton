import {
    Controller,
    Post,
    Get,
    Param,
    UseInterceptors,
    BadRequestException,
    UploadedFile
} from '@nestjs/common';
import {
    ApiBody,
    ApiConsumes,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger';
import { AtmService } from './atm.service';
import { BulkCreateAtmDto } from '../dtos/bulk-create-atm.dto';
import { AtmDto } from "../dtos/atm.dto";
import { FileUploadDto } from "../dtos/file-upload.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('atms')
@Controller('atms')
export class AtmController {
    constructor(private readonly atmService: AtmService) {}

    @Get()
    @ApiOkResponse({ type: [AtmDto], description: 'List of ATMs' })
    @ApiOperation({ summary: 'Get multiple ATMs' })
    async getAllAtms(): Promise<AtmDto[]> {
        return this.atmService.findAll();
    }

    @Get(':id')
    @ApiQuery({ name: 'id', type: Number, description: 'ATM ID' })
    @ApiOkResponse({ type: AtmDto, description: 'ATM' })
    @ApiOperation({ summary: 'Get concrete ATM' })
    async getAtm(@Param('id') id: number): Promise<AtmDto> {
        return this.atmService.findOne(id);
    }

    // @Post('/bulk-create')
    // @ApiConsumes('multipart/form-data')
    // @ApiBody({ type: FileUploadDto, description: 'File to upload' })
    // @ApiCreatedResponse({ type: [AtmDto], description: 'List of ATMs' })
    // @ApiOperation({ summary: 'Create multiple ATMs from a JSON file' })
    // @UseInterceptors(FileInterceptor('file'))
    // async createBulk(@UploadedFile() file): Promise<AtmDto[]> {
    //     if (!file) {
    //         throw new BadRequestException('No file uploaded');
    //     }
    //
    //     const createAtmDtos: BulkCreateAtmDto[] = JSON.parse(file.buffer.toString());
    //     return this.atmService.createBulk(createAtmDtos);
    // }
}
