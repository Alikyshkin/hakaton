import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {SalePoint} from "./entities/sale-point.entity";
import {Atm} from "./entities/atm.entity";
import {ServiceActivity} from "./entities/service-activity.entity";
import {ServiceCapability} from "./entities/service-capability.entity";
import {OpenHour} from "./entities/open-hour.entity";
import {SalePointModule} from './sale-point/sale-point.module';
import {AtmModule} from './atm/atm.module';
import {Ticket} from "./entities/ticket.entity";
import {TicketModule} from './ticket/ticket.module';
import {SearchModule} from './search/search.module';
import {ReplicateProvider} from "./providers/replicate.provider";
import {ChatModule} from './chat/chat.module';
import {NearestSalePointModule} from './nearest-sale-point/nearest-sale-point.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: +configService.get<number>('DB_PORT'),
                username: configService.get<string>('DB_USERNAME'),
                password: configService.get<string>('DB_PASSWORD'),
                database: configService.get<string>('DB_DATABASE'),
                entities: [SalePoint, Atm, ServiceActivity, ServiceCapability, OpenHour, Ticket],
                synchronize: true,
            }),
            inject: [ConfigService],
        }),
        SalePointModule,
        AtmModule,
        TypeOrmModule.forFeature([OpenHour]),
        TicketModule,
        SearchModule,
        ChatModule,
        NearestSalePointModule
    ],
    controllers: [AppController],
    providers: [AppService, ReplicateProvider],
    exports: [ReplicateProvider]
})
export class AppModule {
}
