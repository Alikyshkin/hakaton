import { Controller, Get, Query } from '@nestjs/common';
import { NearestSalePointService } from './nearest-sale-point.service';
import { Point } from '../models/point.model';
import { SalePointDto } from '../dtos/sale-point.dto';
import {ApiOkResponse, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";

@ApiTags('nearest-sale-point')
@Controller('nearest-sale-point')
export class NearestSalePointController {
    constructor(private readonly nearestSalePointService: NearestSalePointService) {}

    @Get()
    @ApiOkResponse({ type: SalePointDto })
    @ApiOperation({ summary: 'Get optimal sale point by client coordinates' })
    @ApiQuery({ name: 'latitude', type: Number, description: 'Latitude of client coordinates' })
    @ApiQuery({ name: 'longitude', type: Number, description: 'Longitude of client coordinates' })
    @ApiQuery({
        name: 'clientType',
        type: String,
        description: 'Client type: individual, business or both',
        required: true,
        enum: ['individual', 'business', 'both']
    })
    async findOptimalBank(
        @Query('latitude') latitude: number,
        @Query('longitude') longitude: number,
        @Query('clientType') clientType?: 'individual' | 'business' | 'both'
    ): Promise<SalePointDto> {
        return await this.nearestSalePointService.findOptimalBank(new Point(latitude, longitude), clientType);
    }
}
