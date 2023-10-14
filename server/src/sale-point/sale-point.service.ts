import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { SalePoint } from '../entities/sale-point.entity';
import { SalePointDto } from '../dtos/sale-point.dto';

import { CreateSalePointDto } from "../dtos/create-sale-point.dto";
import { BulkCreateSalePointDto } from "../dtos/bulk-create-sale-point.dto";


@Injectable()
export class SalePointService {
    constructor(
        @InjectRepository(SalePoint)
        private salePointRepository: Repository<SalePoint>
    ) {}

    async findOne(id: number): Promise<SalePointDto> {
        const salePoint = await this.salePointRepository.findOne({
            where: { id },
            relations: ["openHours", "openHoursIndividual"]
        });
        if (!salePoint) {
            throw new NotFoundException(`SalePoint with ID ${id} not found`);
        }
        return this.toDto(salePoint);
    }

    async findAll(): Promise<SalePointDto[]> {
        const salePoints = await this.salePointRepository.find({ relations: ["openHours", "openHoursIndividual"] });
        return salePoints.map(salePoint => this.toDto(salePoint));
    }

    async create(createSalePointDto: CreateSalePointDto): Promise<SalePointDto> {
        const newSalePoint = await this.salePointRepository.save(createSalePointDto);

        return this.toDto(newSalePoint);
    }

    async createBulk(salePointsDto: BulkCreateSalePointDto[]): Promise<SalePointDto[]> {
        const createdSalePoints = await this.salePointRepository.save(salePointsDto.map(dto => this.fromBulkDtoToEntity(dto)));
        return createdSalePoints.map(salePoint => this.toDto(salePoint));
    }

    private fromBulkDtoToEntity(dto: BulkCreateSalePointDto): SalePoint {
        const entity = new SalePoint();
        Object.assign(entity, dto);

        entity.suoAvailability = dto.suoAvailability === 'Y';
        entity.hasRamp = dto.hasRamp === 'Y';
        entity.rko = dto.rko === 'есть РКО' && dto.rko != null;

        return entity;
    }


    private toDto(salePoint: SalePoint): SalePointDto {
        const dto = new SalePointDto();
        Object.assign(dto, salePoint);
        return dto;
    }
}
