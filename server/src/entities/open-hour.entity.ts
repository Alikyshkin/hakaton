import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { DayOfWeek } from "../enums/day-of-week.enum";
import { SalePoint } from "./sale-point.entity";

@Entity()
export class OpenHour {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'enum', enum: DayOfWeek })
    day: DayOfWeek;

    @Column({ type: 'varchar', length: 255, nullable: true })
    hours: string;

    @ManyToOne(() => SalePoint, salePoint => salePoint.openHours)
    salePointForOpenHours: SalePoint;

    @ManyToOne(() => SalePoint, salePoint => salePoint.openHoursIndividual)
    salePointForOpenHoursIndividual: SalePoint;
}