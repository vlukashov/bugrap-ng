import {Component, OnInit, ViewChild} from '@angular/core';

import { BugrapTicket, BugrapUser } from "./bugrap-ticket";
import { BugrapBackendService } from './bugrap-backend.service';
import { BugrapTicketEditorComponent } from "./bugrap-ticket-editor/bugrap-ticket-editor.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  @ViewChild(BugrapTicketEditorComponent) ticketEditor: BugrapTicketEditorComponent;
  user: BugrapUser;
  projects: string[];
  project: string;
  selectedTickets: BugrapTicket[] = [];

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
    this.backend.getCurrentUser().then(user => this.user = user);
    this.backend.getProjects().then(projects => {
      this.projects = projects;
      this.project = projects[0];
    });
  }

  onSelectedTicketsChanged($event) {
    this.selectedTickets = $event.selectedTickets;
  }
}
