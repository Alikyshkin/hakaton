import { OpenHour } from "../entities/open-hour.entity";
import {ApiProperty} from "@nestjs/swagger";
import {SalePoint} from "../entities/sale-point.entity";

export class SalePointDto {
    constructor(salePoint: SalePoint) {
        Object.assign(this, salePoint);
    }

    @ApiProperty()
    id: number;

    @ApiProperty()
    salePointName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    openHours: OpenHour[];

    @ApiProperty()
    rko: boolean;

    @ApiProperty()
    openHoursIndividual: OpenHour[];

    @ApiProperty()
    officeType: string;

    @ApiProperty()
    salePointFormat: string;

    @ApiProperty()
    suoAvailability: boolean;

    @ApiProperty()
    hasRamp: boolean;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    metroStation: string;

    @ApiProperty()
    kep: boolean;
}
