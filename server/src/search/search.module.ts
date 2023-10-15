import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Atm} from "../entities/atm.entity";
import {SalePoint} from "../entities/sale-point.entity";
import {AtmModule} from "../atm/atm.module";
import {SalePointModule} from "../sale-point/sale-point.module";

@Module({
  imports: [AtmModule, SalePointModule],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
