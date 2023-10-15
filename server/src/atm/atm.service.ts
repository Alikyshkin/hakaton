import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Atm } from '../entities/atm.entity';
import { ServiceCapability } from '../entities/service-capability.entity';
import { ServiceActivity } from '../entities/service-activity.entity';
import { BulkCreateAtmDto } from '../dtos/bulk-create-atm.dto';
import { AtmDto } from "../dtos/atm.dto";

@Injectable()
export class AtmService {
    constructor(
        @InjectRepository(Atm) private atmRepository: Repository<Atm>
    ) {}

    async findAll(): Promise<AtmDto[]> {
        const atms = await this.atmRepository.find({ relations: ['serviceCapability', 'serviceActivity'] });
        return atms.map(atm => this.toDto(atm));
    }

    async findOne(id: number): Promise<AtmDto> {
        const atm = await this.atmRepository.findOne({
            where: { id },
            relations: ['serviceCapability', 'serviceActivity']
        });

        if (!atm) {
            throw new NotFoundException(`ATM with id ${id} not found`);
        }

        return this.toDto(atm);
    }

    async findByPattern(pattern: string): Promise<AtmDto[]> {
        if (!pattern || pattern.trim() === '') {
            throw new BadRequestException('Search pattern should not be empty');
        }

        return (await this.atmRepository.createQueryBuilder('atm')
            .where('atm.address ILIKE :pattern', { pattern: `%${pattern}%` })
            .getMany()).map(atm => this.toDto(atm));
    }

    async createBulk(atmsData: BulkCreateAtmDto[]): Promise<AtmDto[]> {
        const atms = await this.atmRepository.save(atmsData.map(atmData => this.fromBulkDtoToEntity(atmData)));

        return atms.map(atm => this.toDto(atm));
    }

    private fromBulkDtoToEntity(atmDto: BulkCreateAtmDto): Atm {
        const atm = new Atm();
        atm.address = atmDto.address;
        atm.latitude = atmDto.latitude;
        atm.longitude = atmDto.longitude;
        atm.allDay = atmDto.allDay;

        const capability = new ServiceCapability();
        const activity = new ServiceActivity();

        for (const [key, service] of Object.entries(atmDto.services)) {
            capability[key] = service.serviceCapability;
            activity[key] = service.serviceActivity;
        }

        atm.serviceCapability = capability;
        atm.serviceActivity = activity;

        return atm;
    }

    private toDto(atm: Atm): AtmDto {
        const dto = new AtmDto();
        Object.assign(dto, atm);

        return dto;
    }
}
