import { Component, ViewChild, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import {BugrapTicketStatus, BugrapTicket, BugrapTicketType} from "../bugrap-ticket";
import {BugrapBackendService} from "../bugrap-backend.service";


@Component({
  selector: 'bugrap-project-view',
  templateUrl: './bugrap-project-view.component.html',
  styleUrls: [ './bugrap-project-view.component.css' ]
})
export class BugrapProjectViewComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() project: string;
  @Output('selected-tickets-changed') selectedTicketsChanged: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid: any;

  ALL_VERSIONS = 'All versions';

  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();

  lastSelectedVersions: Map<string, string> = new Map();
  versions: string[];
  version: string;
  tickets: BugrapTicket[];
  selectedTickets: BugrapTicket[] = [];

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
    this.tickets = this.backend.getTickets();
  }

  ngAfterViewInit() {
    this.grid.nativeElement.then(() => {
      this.gridReady(this.grid.nativeElement);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      let change = changes['project'];

      this.versions = this.backend.getVersions(this.project);
      this.versions.unshift(this.ALL_VERSIONS);

      if (!changes['project'].isFirstChange()) {
        let lastSelectedVersion = this.lastSelectedVersions[this.project];
        this.lastSelectedVersions[change.previousValue] = this.version;
        this.version = lastSelectedVersion ? lastSelectedVersion : this.versions[0];

        this.grid.nativeElement.then(() => this.grid.nativeElement.refreshItems());
      } else {
        this.version = this.versions[0];
      }
    }
  }

  gridReady(gridElem: any) {
    gridElem.items = this.getGridItems.bind(this);

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

  getGridItems(params, callback) {
    let filtered = this.tickets.filter(ticket => {
      let projectMatch = ticket.project == this.project;
      let versionMatch = this.version == this.ALL_VERSIONS || ticket.version == this.version;
      return projectMatch && versionMatch;
    });
    callback(filtered, filtered.length);
  }

  onVersionChanged($event: any) {
    let hidden = $event.target.value != this.ALL_VERSIONS;
    let gridElem = this.grid.nativeElement;
    gridElem.then(() => {
      gridElem.columns[0].hidden = hidden;
      gridElem.refreshItems();
    });
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
