import {Column, Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn} from "typeorm";
import {ServiceCapability} from "./service-capability.entity";
import {ServiceActivity} from "./service-activity.entity";

@Entity()
export class Atm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 255 })
    address: string;

    @Column({ type: 'double precision' })
    latitude: number;

    @Column({ type: 'double precision' })
    longitude: number;

    @Column({ type: 'boolean', default: false })
    allDay: boolean;

    @OneToOne(() => ServiceCapability, { cascade: true, eager: true })
    @JoinColumn()
    serviceCapability: ServiceCapability;

    @OneToOne(() => ServiceActivity, { cascade: true, eager: true })
    @JoinColumn()
    serviceActivity: ServiceActivity
}