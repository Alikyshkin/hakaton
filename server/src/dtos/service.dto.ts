import {ServiceCapabilityStatus} from "../enums/service-capability-status.enum";
import {ApiProperty} from "@nestjs/swagger";
import {ServiceActivityStatus} from "../enums/service-activity-status.enum";

export class ServiceDto {
    @ApiProperty({ enum: ServiceCapabilityStatus })
    serviceCapability: ServiceCapabilityStatus;

    @ApiProperty({ enum: ServiceActivityStatus })
    serviceActivity: ServiceActivityStatus;
}