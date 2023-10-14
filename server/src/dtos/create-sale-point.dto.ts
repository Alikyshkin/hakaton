import {OpenHour} from "../entities/open-hour.entity";
import {ApiProperty} from "@nestjs/swagger";

export class CreateSalePointDto {
    @ApiProperty()
    salePointName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    status: string;

    @ApiProperty({ type: [OpenHour] })
    openHours: OpenHour[];

    @ApiProperty()
    rko: boolean;

    @ApiProperty({ type: [OpenHour] })
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