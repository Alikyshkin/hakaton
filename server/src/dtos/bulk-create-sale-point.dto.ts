import {ApiProperty} from "@nestjs/swagger";
import {OpenHour} from "../entities/open-hour.entity";

export class BulkCreateSalePointDto {
    @ApiProperty()
    salePointName: string;

    @ApiProperty()
    address: string;

    @ApiProperty()
    status: string;

    @ApiProperty({ type: [OpenHour] })
    openHours: OpenHour[];

    @ApiProperty()
    rko: string;

    @ApiProperty({ type: [OpenHour] })
    openHoursIndividual: OpenHour[];

    @ApiProperty()
    officeType: string;

    @ApiProperty()
    salePointFormat: string;

    @ApiProperty()
    suoAvailability: string;

    @ApiProperty()
    hasRamp: string;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    metroStation: string;

    @ApiProperty()
    kep: boolean;
}
