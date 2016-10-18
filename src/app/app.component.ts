import {Component, OnInit, ViewChild} from '@angular/core';

import { BugrapTicket } from "./bugrap-ticket";
import { BugrapBackendService } from './bugrap-backend.service';
import { BugrapTicketEditorComponent } from "./bugrap-ticket-editor/bugrap-ticket-editor.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  @ViewChild(BugrapTicketEditorComponent) ticketEditor: BugrapTicketEditorComponent;
  user: any;
  projects: string[];
  project: string;
  selectedTickets: BugrapTicket[] = [];

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
    this.user = this.backend.getCurrentUser();
    this.projects = this.backend.getProjects();
    this.project = this.projects[0];
    // this.selectedTickets = [ this.backend.getTickets()[1] ];
  }

  onSelectedTicketsChanged($event) {
    this.selectedTickets = $event.selectedTickets;
  }
}
