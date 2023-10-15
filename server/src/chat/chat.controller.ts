import {Controller, Get, Query} from '@nestjs/common';
import {ApiOkResponse, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {ChatService} from "./chat.service";

@ApiTags('chat')
@Controller('chat')
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get()
    @ApiQuery({ name: 'prompt', type: String, description: 'Prompt string for the chat' })
    @ApiOkResponse({ type: String, description: 'Chat response' })
    @ApiOperation({ summary: 'Get response from the chat by prompt' })
    async getChatResponse(@Query() prompt: string): Promise<String> {
        return this.chatService.getChatResponse(prompt);
    }
}
