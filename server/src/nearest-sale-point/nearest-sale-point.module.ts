import { Module } from '@nestjs/common';
import { NearestSalePointService } from './nearest-sale-point.service';
import { NearestSalePointController } from './nearest-sale-point.controller';
import {SalePointService} from "../sale-point/sale-point.service";
import {TicketService} from "../ticket/ticket.service";
import {SalePointModule} from "../sale-point/sale-point.module";
import {TicketModule} from "../ticket/ticket.module";

@Module({
  imports: [SalePointModule, TicketModule],
  providers: [NearestSalePointService],
  controllers: [NearestSalePointController]
})
export class NearestSalePointModule {}
