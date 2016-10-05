import { Injectable } from '@angular/core';
import { BugrapTicket } from "./bugrap-ticket";
import * as MockData from './bugrap-mock-data';

@Injectable()
export class BugrapBackendService {
  private tickets: BugrapTicket[] = MockData.getTickets();

  getTickets(): BugrapTicket[] {
    return this.tickets;
  }

  updateTicket(updatedTicket: BugrapTicket): void {
    this.tickets = this.tickets.map(ticket => {
      if (ticket.id == updatedTicket.id) {
        return Object.assign(new BugrapTicket(), updatedTicket);
      } else {
        return ticket;
      }
    });
  }

  getProjects(): string[] {
    return MockData.getProjectsNames();
  }

  getVersions(): string[] {
    return MockData.getProjectVersions();
  }

  getUsers(): string[] {
    return MockData.getUserNames();
  }

  getCurrentUser() {
    return { name: MockData.getUserNames()[0] };
  }
}
