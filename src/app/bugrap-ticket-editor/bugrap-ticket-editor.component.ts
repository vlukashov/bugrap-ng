import {Component, Input, Output, DoCheck, OnInit, EventEmitter } from '@angular/core';
import { BugrapTicket, BugrapTicketType, BugrapTicketStatus, BugrapTicketPriority } from '../bugrap-ticket';
import { BugrapBackendService } from '../bugrap-backend.service';


@Component({
  selector: 'bugrap-ticket-editor',
  templateUrl: './bugrap-ticket-editor.component.html',
  styleUrls: ['./bugrap-ticket-editor.component.css']
})
export class BugrapTicketEditorComponent implements DoCheck, OnInit {
  @Input() tickets: BugrapTicket[];
  @Output('tickets-edited') ticketsEdited: EventEmitter<any> = new EventEmitter();

  EDITABLE_PROPERTIES = ['priority', 'type', 'status', 'assigned_to', 'version'];

  TYPE_CHOICES = BugrapTicketType.getValueLabelPairs();
  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();
  PRIORITY_CHOICES = BugrapTicketPriority.getValueLabelPairs();

  VERSION_VALUES: string[];
  ASSIGNED_TO_VALUES: string[];
  batchMode: boolean;
  ticketIds: string[] = [];
  ticket: BugrapTicket;

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
    this.VERSION_VALUES = this.backend.getVersions();
    this.ASSIGNED_TO_VALUES = this.backend.getUsers();
  }

  ngDoCheck() {
    if (!this.tickets) {
      return;
    }

    let newTicketIds = this.tickets.map(ticket => ticket.id).sort();
    let hasChanges = !BugrapTicketEditorComponent._arrayEquals(this.ticketIds, newTicketIds);
    if (hasChanges) {
      this.refreshTickets();
      this.ticketIds = newTicketIds;
    }
  }

  refreshTickets() {
    if (!this.tickets) {
      this.ticket = null;
      this.batchMode = false;
      return;
    }

    this.batchMode = this.tickets.length > 1;
    if (!this.batchMode) {
      this.ticket = Object.assign(new BugrapTicket(), this.tickets[0]);
    } else {
      this.ticket = new BugrapTicket();
      this.EDITABLE_PROPERTIES.forEach(property => {
        let firstValue = this.tickets[0][property];
        let differentIndex = this.tickets.slice(1).findIndex(ticket => ticket[property] != firstValue);
        if (differentIndex == -1) {
          this.ticket[property] = firstValue;
        }
      }, this);
    }
  }

  update() {
    let timestamp = new Date();
    if (!this.batchMode) {
      this.ticket.last_modified = timestamp;
      this.backend.updateTicket(this.ticket);
    } else {
      this.tickets.forEach(ticket => {
        let hasChanges = false;
        this.EDITABLE_PROPERTIES.forEach(property => {
          // do not write back the properties which values were not changed
          if (typeof this.ticket[property] !== 'undefined' && this.ticket[property] != ticket[property]) {
            ticket[property] = this.ticket[property];
            hasChanges = true;
          }
        }, this);
        if (hasChanges) {
          ticket.last_modified = timestamp;
        }
        this.backend.updateTicket(ticket);
      }, this);
    }
    this.ticketsEdited.emit(null);
  }

  revert() {
    this.refreshTickets();
  }

  private static _arrayEquals(arr1: Array<any>, arr2: Array<any>): boolean {
    // assume 2 null arrays are equal
    if (arr1 === null && arr2 === null) {
      return true;
    }

    // if any one or both of the arrays are falsy (but not both both are null), assume they are not equal
    if (!arr1 || !arr2) {
      return false;
    }

    // if array lengths are different, the arrays are not equal
    if (arr1.length != arr2.length) {
      return false;
    }

    for (var i = 0, length = arr1.length; i < length; i++) {
      // find the first non-matching element to determine that the arrays are not equal
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }

    // if all the earlier checks do not provide inequality, the arrays are equal
    return true;
  }
}
