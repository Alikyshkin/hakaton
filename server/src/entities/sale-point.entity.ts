import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import {OpenHour} from "./open-hour.entity";

@Entity()
export class SalePoint {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    salePointName: string;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'varchar', length: 32 })
    status: string;

    @OneToMany(() => OpenHour, openHour => openHour.salePointForOpenHours, { cascade: true, eager: true })
    openHours: OpenHour[];

    @Column({ type: 'boolean', default: false })
    rko: boolean;

    @OneToMany(() => OpenHour, openHour => openHour.salePointForOpenHoursIndividual, { cascade: true, eager: true })
    openHoursIndividual: OpenHour[];

    @Column({ type: 'varchar', length: 128 })
    officeType: string;

    @Column({ type: 'varchar', length: 128 })
    salePointFormat: string;

    @Column({ type: 'boolean', default: false })
    suoAvailability: boolean;

    @Column({ type: 'boolean', default: false })
    hasRamp: boolean;

    @Column({ type: 'double precision' })
    latitude: number;

    @Column({ type: 'double precision' })
    longitude: number;

    @Column({ type: 'varchar', length: 128, nullable: true })
    metroStation: string;

    @Column({ type: 'boolean', default: false, nullable: true })
    kep: boolean;
}
