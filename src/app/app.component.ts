import { Component, AfterViewInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

import { BugrapTicket, BugrapTicketStatus } from './bugrap-ticket';
import * as MockData from './bugrap-mock-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  @ViewChild('grid') grid: any;
  user = MockData.getCurrentUser();
  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();

  projects = MockData.getProjectsNames();
  project = this.projects[0];

  versions = MockData.getProjectVersions();
  version = this.versions[1];

  tickets: BugrapTicket[] = MockData.getTickets();
  ticket: BugrapTicket = this.tickets[1];

  ngAfterViewInit() {
    this.grid.nativeElement.then(() => {
      this.gridReady(this.grid.nativeElement);
    });
  }

  gridReady(grid: any) {
    let dateRenderer = (cell: any) => {
      let now = moment();
      let date = moment(cell.data);
      cell.element.innerHTML = date.isValid() ? date.from(now) : '';
    };

    grid.addEventListener('selected-items-changed', () => this.onSelectionChange(grid));

    grid.columns[4].renderer = dateRenderer;
    grid.columns[5].renderer = dateRenderer;
    grid.selection.select(1);
  }

  onSelectionChange(grid: any) {
    let selected = grid.selection.selected();
    if (!isNaN(selected[0])) {
      this.ticket = this.tickets[selected[0]];
    } else {
      this.ticket = null;
    }
  }
}
