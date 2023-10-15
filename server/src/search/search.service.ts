import {BadRequestException, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SalePoint } from '../entities/sale-point.entity';
import { Atm } from '../entities/atm.entity';
import {AtmAndSalePointSearchDto} from "../dtos/atm-and-sale-point-search.dto";

@Injectable()
export class SearchService {
    constructor(
        @InjectRepository(SalePoint) private salePointRepository: Repository<SalePoint>,
        @InjectRepository(Atm) private atmRepository: Repository<Atm>
    ) {}

    async searchSalePointsAndAtms(pattern: string): Promise<AtmAndSalePointSearchDto> {
        if (!pattern || pattern.trim() === '') {
            throw new BadRequestException('Search pattern should not be empty');
        }

        const salePoints = await this.salePointRepository.createQueryBuilder('salePoint')
            .where('salePoint.salePointName ILIKE :pattern', { pattern: `%${pattern}%` })
            .orWhere('salePoint.address ILIKE :pattern', { pattern: `%${pattern}%` })
            .getMany();

        const atms = await this.atmRepository.createQueryBuilder('atm')
            .where('atm.address ILIKE :pattern', { pattern: `%${pattern}%` })
            .getMany();

        return this.toDto(salePoints, atms);
    }

    private toDto(salePoints: SalePoint[], atms: Atm[]): AtmAndSalePointSearchDto {
        const dto = new AtmAndSalePointSearchDto();

        dto.salePoints = salePoints;
        dto.atms = atms;

        return dto;
    }
}
