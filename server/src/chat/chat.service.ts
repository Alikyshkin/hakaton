import { Injectable } from '@nestjs/common';
import axios from "axios";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class ChatService {
    constructor(private configService: ConfigService) {}
    async getChatResponse(prompt: string): Promise<String> {
        return await axios.get(this.configService.get<string>('CHAT_URL') + '/generate/',
            {params: { prompt }}).then((response) => response.data.response);
    }
}
