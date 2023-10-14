import {ApiProperty} from "@nestjs/swagger";

export class AtmDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    allDay: boolean;
}