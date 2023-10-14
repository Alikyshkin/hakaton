import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ServiceCapabilityStatus } from "../enums/service-capability-status.enum";
@Entity()
export class ServiceCapability {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    supportsEur: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    supportsRub: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    supportsUsd: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    supportsChargeRub: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    blind: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    nfcForBankCards: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    qrRead: ServiceCapabilityStatus;

    @Column({ type: 'varchar', length: 12, default: ServiceCapabilityStatus.UNKNOWN })
    wheelchair: ServiceCapabilityStatus;
}
