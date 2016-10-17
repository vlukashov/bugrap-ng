import { Injectable } from '@angular/core';
import { BugrapTicket } from "./bugrap-ticket";
import * as MockData from './bugrap-mock-data';

@Injectable()
export class BugrapBackendService {
  private tickets: BugrapTicket[] = MockData.getTickets();

  getTickets(): BugrapTicket[] {
    return this.tickets;
  }

  getTicket(id: string): BugrapTicket {
    let index = this.tickets.findIndex(ticket => ticket.id === id);
    if (index > -1) return this.tickets[index];
    return null;
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

  getVersions(project): string[] {
    return MockData.getProjectVersions(project);
  }

  getUsers(): string[] {
    return MockData.getUserNames();
  }

  getCurrentUser() {
    return { name: MockData.getUserNames()[0] };
  }
}
