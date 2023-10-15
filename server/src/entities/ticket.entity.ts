import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {SalePoint} from "./sale-point.entity";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'integer' })
    ticketNumber: number;

    @Column({ type: 'varchar', length: 100 })
    ticketOwnerName: string;

    @Column({ type: 'varchar', length: 100 })
    ticketOwnerEmail: string;

    @ManyToOne(() => SalePoint, salePoint => salePoint.ticket)
    salePoint: SalePoint;
}