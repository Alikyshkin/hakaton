import { Module } from '@nestjs/common';
import { TicketController } from './ticket.controller';
import { TicketService } from './ticket.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Ticket} from "../entities/ticket.entity";
import {SalePoint} from "../entities/sale-point.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Ticket, SalePoint])],
  controllers: [TicketController],
  providers: [TicketService],
  exports: [TicketService]
})
export class TicketModule {}
