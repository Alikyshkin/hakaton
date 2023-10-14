import {ApiProperty} from "@nestjs/swagger";
import {ServiceDto} from "./service.dto";

export class BulkCreateAtmDto {
    @ApiProperty()
    address: string;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    allDay: boolean;

    @ApiProperty({ type: ServiceDto, additionalProperties: true })
    services: Record<string, ServiceDto>;
}