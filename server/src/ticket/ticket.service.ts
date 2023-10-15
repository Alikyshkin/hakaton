import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {Ticket} from "../entities/ticket.entity";
import {TicketDto} from "../dtos/ticket.dto";
import {CreateTicketDto} from "../dtos/create-ticket.dto";
import {SalePoint} from "../entities/sale-point.entity";

@Injectable()
export class TicketService {
    constructor(
        @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
        @InjectRepository(SalePoint) private salePointRepository: Repository<SalePoint>
    ) {}

    async findAll(): Promise<TicketDto[]> {
        const tickets = await this.ticketRepository.createQueryBuilder('ticket')
            .leftJoinAndSelect('ticket.salePoint', 'salePoint')
            .select([
                'ticket.id',
                'ticket.ticketNumber',
                'ticket.ticketOwnerEmail',
                'ticket.ticketOwnerName',
                'salePoint.id'
            ])
            .getMany();

        return tickets.map(ticket => this.toDto(ticket));
    }

    async findOne(id: number): Promise<TicketDto> {
        const ticket = await this.ticketRepository.findOne({ where: { id }, relations: ['salePoint'] });
        return this.toDto(ticket);
    }

    async create(createTicketDto: CreateTicketDto): Promise<TicketDto> {
        const salePoint = await this.salePointRepository.findOne({ where: { id: createTicketDto.salePointId } });

        if (salePoint == null) {
            throw new NotFoundException('Sale point not found');
        }

        const ticket = new Ticket();

        ticket.ticketNumber = createTicketDto.ticketNumber;
        ticket.ticketOwnerEmail = createTicketDto.ticketOwnerEmail;
        ticket.ticketOwnerName = createTicketDto.ticketOwnerName;
        ticket.salePoint = salePoint;

        return this.toDto(await this.ticketRepository.save(ticket));
    }

    private toDto(ticket: Ticket): TicketDto {
        const dto = new TicketDto();

        dto.id = ticket.id;
        dto.ticketNumber = ticket.ticketNumber;
        dto.ticketOwnerEmail = ticket.ticketOwnerEmail;
        dto.ticketOwnerName = ticket.ticketOwnerName;
        dto.salePointId = ticket.salePoint.id;

        return dto;
    }
}
