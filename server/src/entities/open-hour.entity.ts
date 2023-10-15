import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {SalePoint} from "./sale-point.entity";
import {ApiProperty} from "@nestjs/swagger";
import {DayOfWeek} from "../enums/day-of-week.enum";
import {OpenHourType} from "../enums/open-hour-type.enum";

@Entity()
export class OpenHour {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'varchar', length: 20, nullable: true})
    days: string;

    @Column({type: 'varchar', length: 20, nullable: true})
    hours: string;

    @ApiProperty({enum: DayOfWeek})
    @Column({type: 'enum', enum: DayOfWeek, nullable: true})
    dayFrom: DayOfWeek;

    @ApiProperty({enum: DayOfWeek})
    @Column({type: 'enum', enum: DayOfWeek, nullable: true})
    dayTo: DayOfWeek;

    @ApiProperty()
    @Column({type: 'enum', enum: OpenHourType, nullable: true})
    type: OpenHourType;

    @ApiProperty()
    @Column({type: 'varchar', length: 5, nullable: true})
    timeFrom: string;

    @ApiProperty()
    @Column({type: 'varchar', length: 5, nullable: true})
    timeTo: string;

    @ManyToOne(() => SalePoint, salePoint => salePoint.openHours)
    salePointForOpenHours: SalePoint;

    @ManyToOne(() => SalePoint, salePoint => salePoint.openHoursIndividual)
    salePointForOpenHoursIndividual: SalePoint;
}