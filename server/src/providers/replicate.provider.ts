import Replicate from 'replicate';
import { ConfigService } from '@nestjs/config';

export const ReplicateProvider = {
    provide: 'replicate',
    useFactory: (configService: ConfigService) => {
        const apiToken = configService.get<string>('REPLICATE_API_TOKEN');
        return new Replicate({
            auth: apiToken
        });
    },
    inject: [ConfigService]
};
