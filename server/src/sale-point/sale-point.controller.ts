import { Controller, Get, Param } from '@nestjs/common';
import { SalePointService } from './sale-point.service';
import { SalePointDTO } from './sale-point.dto';

@Controller('sale-point')
export class SalePointController {
    constructor(private salePointService: SalePointService) {}

    @Get()
    async getAllSalePoints(): Promise<SalePointDTO[]> {
        return this.salePointService.findAll();
    }

    @Get(':id')
    async getSalePoint(@Param('id') id: number): Promise<SalePointDTO> {
        return this.salePointService.findOne(id);
    }
}