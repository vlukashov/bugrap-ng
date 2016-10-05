import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';

import { BugrapTicket, BugrapTicketStatus, BugrapTicketType } from './bugrap-ticket';
import { BugrapBackendService } from './bugrap-backend.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild('grid') grid: any;

  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();

  user: any;
  projects: string[];
  project: string;
  versions: string[];
  version: string;
  tickets: BugrapTicket[];
  selectedTickets: BugrapTicket[] = [];

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
    this.user = this.backend.getCurrentUser();
    this.projects = this.backend.getProjects();
    this.project = this.projects[0];
    this.versions = this.backend.getVersions();
    this.versions.unshift('All versions');
    this.version = this.versions[0];
    this.tickets = this.backend.getTickets();
  }

  ngAfterViewInit() {
    this.grid.nativeElement.then(() => {
      this.gridReady(this.grid.nativeElement);
    });
  }

  gridReady(gridElem: any) {
    gridElem.columns[1].renderer = (cell: any) => {
      cell.element.innerHTML = BugrapTicketType[cell.data];
    };

    let dateRenderer = (cell: any) => {
      let now = moment();
      let date = moment(cell.data);
      cell.element.innerHTML = date.isValid() ? date.from(now) : '';
    };

    gridElem.columns[4].renderer = dateRenderer;
    gridElem.columns[5].renderer = dateRenderer;

    gridElem.addEventListener('selected-items-changed', () => this.onSelectionChange(gridElem));
    gridElem.selection.select(1);
  }

  onSelectionChange(grid: any) {
    let selected = grid.selection.selected();
    this.selectedTickets = this.tickets.filter((_, index) => {
      return selected.indexOf(index) > -1;
    });
  }

  refreshTickets() {
    let gridElem = this.grid.nativeElement;
    let selected = gridElem.selection.selected().slice(0);
    this.tickets = this.backend.getTickets();
    gridElem.then(() => {
      selected.forEach(selectedItemIndex => gridElem.selection.select(selectedItemIndex));
    });
  }
}
