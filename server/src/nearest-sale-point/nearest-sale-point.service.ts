import {Injectable} from '@nestjs/common';
import {Point} from "../models/point.model";
import {SalePointDto} from "../dtos/sale-point.dto";
import {SalePointService} from "../sale-point/sale-point.service";
import {TicketService} from "../ticket/ticket.service";
import {SalePoint} from "../entities/sale-point.entity";

/*
   Since mapping services present an exclusively paid API, let's imagine that our client
   is traveling to a point on foot at a speed of 5 kilometers per hour.
   Let's also imagine that the average time of customer service is 2 minutes.
*/

@Injectable()
export class NearestSalePointService {
    constructor(private salePointService: SalePointService, private ticketService: TicketService) {}
    private readonly walkingSpeed = 5;
    private readonly serviceTimePerPerson = 2;

    private calculateDistance(point1: Point, point2: Point) {
        return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
    }

    private calculateTravelTime(distance: number) {
        return (distance / this.walkingSpeed) * 60;
    }

    private calculateWaitingTime(peopleCount: number) {
        return peopleCount * this.serviceTimePerPerson;
    }

    async findOptimalBank(currentLocation: Point, clientType?: 'individual' | 'business' | 'both') {
        const salePoints: SalePoint[] = await this.salePointService.findByClientType(clientType);

        let optimalSalePoint;
        let minimalTotalTime = Infinity;

        for (const salePoint of salePoints) {
            const tickets = await this.ticketService.findBySalePoint(salePoint);

            const bankLocation = new Point(salePoint.latitude, salePoint.longitude);

            const distance: number = this.calculateDistance(currentLocation, bankLocation);
            const travelTime: number = this.calculateTravelTime(distance);
            const waitingTime: number = this.calculateWaitingTime(tickets.length);

            const totalTime = travelTime + waitingTime;

            if (totalTime < minimalTotalTime) {
                minimalTotalTime = totalTime;
                optimalSalePoint = salePoint;
            }
        }

        return new SalePointDto(optimalSalePoint);
    }
}