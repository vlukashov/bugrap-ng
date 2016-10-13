import {Component, ViewChild, OnInit, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import * as moment from 'moment';

import {BugrapTicketStatus, BugrapTicket, BugrapTicketType} from "../bugrap-ticket";
import {BugrapBackendService} from "../bugrap-backend.service";


@Component({
  selector: 'bugrap-project-view',
  templateUrl: './bugrap-project-view.component.html',
  styleUrls: [ './bugrap-project-view.component.css' ]
})
export class BugrapProjectViewComponent implements OnInit, AfterViewInit {

  @Input() project: string;
  @Output('selected-tickets-changed') selectedTicketsChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid: any;

  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();

  versions: string[];
  version: string;
  tickets: BugrapTicket[];
  selectedTickets: BugrapTicket[] = [];

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
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
    gridElem.columns[2].renderer = (cell: any) => {
      cell.element.innerHTML = BugrapTicketType[cell.data];
    };

    let dateRenderer = (cell: any) => {
      let now = moment();
      let date = moment(cell.data);
      cell.element.innerHTML = date.isValid() ? date.from(now) : '';
    };

    gridElem.columns[5].renderer = dateRenderer;
    gridElem.columns[6].renderer = dateRenderer;

    gridElem.addEventListener('selected-items-changed', () => this.onSelectionChange(gridElem));
  }

  onVersionChanged($event: any) {
    this.grid.nativeElement.columns[0].hidden = ($event.target.value != 'All versions');
  }

  onSelectionChange(grid: any) {
    let selected = grid.selection.selected();
    let selectedTickets = this.tickets.filter((_, index) => {
      return selected.indexOf(index) > -1;
    });
    this.selectedTicketsChanged.emit({ selectedTickets: selectedTickets });
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
