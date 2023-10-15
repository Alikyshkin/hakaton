import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Atm} from "../entities/atm.entity";
import {SalePoint} from "../entities/sale-point.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Atm, SalePoint])],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
