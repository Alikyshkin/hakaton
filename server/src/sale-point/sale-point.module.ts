import {Module} from '@nestjs/common';
import {SalePointService} from "./sale-point.service";
import {SalePointController} from "./sale-point.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {SalePoint} from "../entities/sale-point.entity";
import {OpenHour} from "../entities/open-hour.entity";

@Module({
    imports: [TypeOrmModule.forFeature([SalePoint, OpenHour])],
    controllers: [SalePointController],
    providers: [SalePointService]
})
export class SalePointModule {
}
