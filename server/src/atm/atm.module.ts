import { Module } from '@nestjs/common';
import { AtmService } from './atm.service';
import { AtmController } from './atm.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Atm} from "../entities/atm.entity";
import {ServiceCapability} from "../entities/service-capability.entity";
import {ServiceActivity} from "../entities/service-activity.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Atm, ServiceCapability, ServiceActivity])],
  providers: [AtmService],
  controllers: [AtmController]
})
export class AtmModule {}
