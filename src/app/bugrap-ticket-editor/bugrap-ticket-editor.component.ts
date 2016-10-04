import { Component, Input } from '@angular/core';
import { BugrapTicket, BugrapTicketType, BugrapTicketStatus, BugrapTicketPriority } from '../bugrap-ticket';
import * as MockData from '../bugrap-mock-data';

@Component({
  selector: 'bugrap-ticket-editor',
  templateUrl: './bugrap-ticket-editor.component.html',
  styleUrls: ['./bugrap-ticket-editor.component.css']
})
export class BugrapTicketEditorComponent {
  @Input("ticket") ticket: BugrapTicket;

  TYPE_CHOICES = BugrapTicketType.getValueLabelPairs();
  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();
  PRIORITY_CHOICES = BugrapTicketPriority.getValueLabelPairs();

  VERSION_VALUES = MockData.getProjectVersions();
  ASSIGNED_TO_VALUES = MockData.getUserNames();
}
