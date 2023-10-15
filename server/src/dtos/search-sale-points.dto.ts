import {ApiProperty} from "@nestjs/swagger";

export class SearchSalePointsDto {
    @ApiProperty()
    pattern: string;
}