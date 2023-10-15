import {Injectable} from '@nestjs/common';
import {AtmAndSalePointSearchDto} from "../dtos/atm-and-sale-point-search.dto";
import {SalePointService} from "../sale-point/sale-point.service";
import {SalePointDto} from "../dtos/sale-point.dto";
import {AtmDto} from "../dtos/atm.dto";
import {AtmService} from "../atm/atm.service";

@Injectable()
export class SearchService {
    constructor(
        private salePointService: SalePointService,
        private atmService: AtmService
    ) {}

    async searchSalePointsAndAtms(pattern: string, clientType?: 'individual' | 'business' | 'both'): Promise<AtmAndSalePointSearchDto> {
        const salePoints: SalePointDto[] = await this.salePointService.findByPatternAndClientType(pattern, clientType);

        let atms: AtmDto[] = [];

        if (clientType !== 'business') {
            atms = await this.atmService.findByPattern(pattern);
        }

        return this.toDto(salePoints, atms);
    }


    private toDto(salePoints: SalePointDto[], atms: AtmDto[]): AtmAndSalePointSearchDto {
        const dto = new AtmAndSalePointSearchDto();

        dto.salePoints = salePoints;
        dto.atms = atms;

        return dto;
    }
}
