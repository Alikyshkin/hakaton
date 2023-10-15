import { Controller, Get, Query } from '@nestjs/common';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import {AtmAndSalePointSearchDto} from "../dtos/atm-and-sale-point-search.dto";

@ApiTags('search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiOperation({ summary: 'Search across SalePoints and ATMs' })
    @ApiResponse({ status: 200, description: 'Search results', type: AtmAndSalePointSearchDto })
    async searchSalePointsAndAtms(@Query('pattern') pattern: string): Promise<AtmAndSalePointSearchDto> {
        return await this.searchService.searchSalePointsAndAtms(pattern);
    }
}
