import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { SalePoint } from "./sale-point.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity()
export class OpenHour {
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ type: 'varchar', length: 100, nullable: true })
    days: string;

    @ApiProperty()
    @Column({ type: 'varchar', length: 255, nullable: true })
    hours: string;

    @ManyToOne(() => SalePoint, salePoint => salePoint.openHours)
    salePointForOpenHours: SalePoint;

    @ManyToOne(() => SalePoint, salePoint => salePoint.openHoursIndividual)
    salePointForOpenHoursIndividual: SalePoint;
}