import {ApiProperty} from "@nestjs/swagger";
import {AtmDto} from "./atm.dto";
import {SalePointDto} from "./sale-point.dto";

export class AtmAndSalePointSearchDto {
    @ApiProperty()
    salePoints: SalePointDto[];

    @ApiProperty()
    atms: AtmDto[];
}