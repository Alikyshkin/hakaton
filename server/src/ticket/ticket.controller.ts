import {Body, Controller, Get, Param, Post, Query} from '@nestjs/common';
import {ApiBody, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags} from "@nestjs/swagger";
import {TicketDto} from "../dtos/ticket.dto";
import {TicketService} from "./ticket.service";
import {CreateTicketDto} from "../dtos/create-ticket.dto";

@ApiTags('tickets')
@Controller('ticket')
export class TicketController {
    constructor(private ticketService: TicketService) {}

    @Get()
    @ApiOkResponse({ description: 'List of tickets', type: [TicketDto] })
    @ApiOperation({ summary: 'Get all tickets' })
    async findAll(): Promise<TicketDto[]> {
        return this.ticketService.findAll();
    }

    @Get(':id')
    @ApiQuery({ name: 'id', type: Number, description: 'Ticket ID' })
    @ApiOkResponse({ description: 'Ticket', type: TicketDto })
    @ApiOperation({ summary: 'Get one ticket' })
    async findOne(@Param('id') id: number): Promise<TicketDto> {
        return this.ticketService.findOne(id);
    }

    @Post()
    @ApiBody({ description: 'Ticket create DTO', type: CreateTicketDto })
    @ApiCreatedResponse({ description: 'Ticket', type: TicketDto })
    @ApiOperation({ summary: 'Create one ticket' })
    async create(@Body() createTicketDto: CreateTicketDto): Promise<TicketDto> {
        return this.ticketService.create(createTicketDto);
    }
}
