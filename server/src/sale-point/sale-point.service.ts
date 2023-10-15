import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import {SalePoint} from '../entities/sale-point.entity';
import {SalePointDto} from '../dtos/sale-point.dto';

import {CreateSalePointDto} from "../dtos/create-sale-point.dto";
import {BulkCreateSalePointDto} from "../dtos/bulk-create-sale-point.dto";
import {OpenHour} from "../entities/open-hour.entity";
import {DayOfWeek} from "../enums/day-of-week.enum";
import {OpenHourType} from "../enums/open-hour-type.enum";
import {SearchSalePointsDto} from "../dtos/search-sale-points.dto";


@Injectable()
export class SalePointService {
    constructor(
        @InjectRepository(SalePoint) private salePointRepository: Repository<SalePoint>,
        @InjectRepository(OpenHour) private openHourRepository: Repository<OpenHour>
    ) {
    }

    async findOne(id: number): Promise<SalePointDto> {
        const salePoint = await this.salePointRepository.findOne({
            where: {id},
            relations: ["openHours", "openHoursIndividual"]
        });
        if (!salePoint) {
            throw new NotFoundException(`SalePoint with ID ${id} not found`);
        }
        return this.toDto(salePoint);
    }

    async findAll(): Promise<SalePointDto[]> {
        const salePoints = await this.salePointRepository.find({relations: ["openHours", "openHoursIndividual"]});
        return salePoints.map(salePoint => this.toDto(salePoint));
    }

    // async findByPattern(pattern: string): Promise<SalePointDto[]> {
    //     if (!pattern || pattern.trim() == '') {
    //         throw new BadRequestException('Pattern is empty');
    //     }
    //
    //     pattern = pattern.trim();
    //
    //     const salePoints = await this.salePointRepository.createQueryBuilder('salePoint')
    //         .where('salePoint.salePointName ILIKE :pattern', { pattern: `%${pattern}%` })
    //         .orWhere('salePoint.address ILIKE :pattern', { pattern: `%${pattern}%` })
    //         .getMany();
    //
    //     return salePoints.map(salePoint => this.toDto(salePoint));
    // }

    async create(createSalePointDto: CreateSalePointDto): Promise<SalePointDto> {
        const newSalePoint = await this.salePointRepository.save(createSalePointDto);

        return this.toDto(newSalePoint);
    }

    async createBulk(salePointsDto: BulkCreateSalePointDto[]): Promise<SalePointDto[]> {
        const createdSalePoints = await this.salePointRepository.save(salePointsDto.map(dto => this.fromBulkDtoToEntity(dto)));
        await this.transformBulkDaysAndHours();

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

    private async transformBulkDaysAndHours() {
        const daysMapping = {
            'пн': DayOfWeek.MONDAY,
            'вт': DayOfWeek.TUESDAY,
            'ср': DayOfWeek.WEDNESDAY,
            'чт': DayOfWeek.THURSDAY,
            'пт': DayOfWeek.FRIDAY,
            'сб': DayOfWeek.SATURDAY,
            'вс': DayOfWeek.SUNDAY,
            'в': DayOfWeek.SUNDAY
        };

        const openHours = await this.openHourRepository.find();

        for (let openHour of openHours) {
            if (openHour.days.includes("Не обслуживает")) {
                await this.openHourRepository.remove(openHour);
                continue;
            }

            if (openHour.hours === "выходной") {
                openHour.type = OpenHourType.DAY_OFF;
                openHour.timeFrom = "00:00";
                openHour.timeTo = "23:59";

                if (openHour.days.includes(',')) {
                    const days = openHour.days.split(',').map(day => daysMapping[day.trim()]);
                    openHour.dayFrom = days[0];
                    openHour.dayTo = days[1];
                } else {
                    openHour.dayFrom = daysMapping[openHour.days];
                    openHour.dayTo = daysMapping[openHour.days];
                }
            } else if (openHour.days === "перерыв") {
                openHour.type = OpenHourType.INTERRUPTION;
                openHour.dayFrom = DayOfWeek.MONDAY;
                openHour.dayTo = DayOfWeek.SUNDAY;

                const times = openHour.hours.split('-');
                openHour.timeFrom = times[0];
                openHour.timeTo = times[1];
            } else {
                openHour.type = OpenHourType.WORKING;

                if (openHour.days.includes('-')) {
                    const days = openHour.days.split('-').map(day => daysMapping[day.trim()]);
                    openHour.dayFrom = days[0];
                    openHour.dayTo = days[1];
                } else if (openHour.days.includes(',')) {
                    const days = openHour.days.split(',').map(day => daysMapping[day.trim()]);
                    openHour.dayFrom = days[0];
                    openHour.dayTo = days[1];
                } else {
                    openHour.dayFrom = daysMapping[openHour.days];
                    openHour.dayTo = daysMapping[openHour.days];
                }

                const times = openHour.hours.split('-');
                openHour.timeFrom = times[0];
                openHour.timeTo = times[1];
            }
        }

        await this.openHourRepository.save(openHours);
    }


    private toDto(salePoint: SalePoint): SalePointDto {
        const dto = new SalePointDto();
        Object.assign(dto, salePoint);
        return dto;
    }
}
