import {ApiProperty} from "@nestjs/swagger";
import {SalePoint} from "../entities/sale-point.entity";

export class CreateTicketDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    ticketNumber: number;

    @ApiProperty()
    ticketOwnerName: string;

    @ApiProperty()
    ticketOwnerEmail: string;

    @ApiProperty()
    salePointId: number;
}