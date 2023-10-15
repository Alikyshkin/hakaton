import {Controller, Get, Query} from '@nestjs/common';
import {ApiResponse, ApiTags, ApiOperation, ApiQuery} from '@nestjs/swagger';
import {SearchService} from './search.service';
import {AtmAndSalePointSearchDto} from "../dtos/atm-and-sale-point-search.dto";

@ApiTags('search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    @ApiOperation({summary: 'Search across SalePoints and ATMs'})
    @ApiQuery({name: 'pattern', type: String, description: 'Search pattern'})
    @ApiQuery({
        name: 'clientType',
        type: String,
        description: 'Client type: individual, business or both',
        required: true,
        enum: ['individual', 'business', 'both']
    })
    @ApiResponse({status: 200, description: 'Search results', type: AtmAndSalePointSearchDto})
    async searchSalePointsAndAtms(
        @Query('pattern') pattern: string,
        @Query('clientType') clientType?: 'individual' | 'business' | 'both'
    ): Promise<AtmAndSalePointSearchDto> {
        return await this.searchService.searchSalePointsAndAtms(pattern, clientType);
    }
}
