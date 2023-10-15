import {Controller, Get, Param, Post} from '@nestjs/common';
import {ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags} from "@nestjs/swagger";
import {TicketDto} from "../dtos/ticket.dto";
import {TicketService} from "./ticket.service";
import {CreateTicketDto} from "../dtos/create-ticket.dto";

@ApiTags('tickets')
@Controller('ticket')
export class TicketController {
    constructor(private ticketService: TicketService) {}

    @Get()
    @ApiOkResponse({ type: [TicketDto] })
    @ApiOperation({ summary: 'Get all tickets' })
    async findAll(): Promise<TicketDto[]> {
        return this.ticketService.findAll();
    }

    @Get(':id')
    @ApiOkResponse({ type: TicketDto })
    @ApiOperation({ summary: 'Get one ticket' })
    async findOne(@Param('id') id: number): Promise<TicketDto> {
        return this.ticketService.findOne(id);
    }

    @Post()
    @ApiCreatedResponse({ type: TicketDto })
    @ApiOperation({ summary: 'Create one ticket' })
    async create(@Param('ticket') createTicketDto: CreateTicketDto): Promise<TicketDto> {
        return this.ticketService.create(createTicketDto);
    }
}
