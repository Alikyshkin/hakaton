import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

import { ServiceActivityStatus } from "../enums/service-activity-status.enum";

@Entity()
export class ServiceActivity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    supportsEur: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    supportsRub: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    supportsUsd: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    supportsChargeRub: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    blind: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    nfcForBankCards: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    qrRead: ServiceActivityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceActivityStatus.UNKNOWN })
    wheelchair: ServiceActivityStatus;
}
