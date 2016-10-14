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
  @ViewChild('statusMenu') statusMenu: any;

  ALL_VERSIONS = 'All versions';

  ASSIGNED_TO_ALL = 'all';
  ASSIGNED_TO_ME = 'me';

  STATUS_ALL = 'all';
  STATUS_OPEN = 'open';
  STATUS_CUSTOM = 'custom';

  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();

  lastSelectedVersions: Map<string, string> = new Map();
  versions: string[];
  version: string;
  assignedToFilter: string = this.ASSIGNED_TO_ALL;
  statusFilter: string = this.STATUS_ALL;
  customStatusFilter: BugrapTicketStatus[] = [];
  tickets: BugrapTicket[];
  selectedTickets: BugrapTicket[] = [];

  constructor(private backend: BugrapBackendService) {}

  // execute some callback async when the grid control is ready
  execOnGrid(callback: (grid: any) => void) {
    this.grid.nativeElement.then(() => callback(this.grid.nativeElement));
  }

  ngOnInit() {
    this.tickets = this.backend.getTickets();
  }

  ngAfterViewInit() {
    // initialize the grid control
    this.execOnGrid((grid) => {
      grid.columns[2].renderer = (cell: any) => {
        cell.element.innerHTML = BugrapTicketType[cell.data];
      };

      let dateRenderer = (cell: any) => {
        let now = moment();
        let date = moment(cell.data);
        cell.element.innerHTML = date.isValid() ? date.from(now) : '';
      };

      grid.columns[5].renderer = dateRenderer;
      grid.columns[6].renderer = dateRenderer;

      grid.addEventListener('selected-items-changed', () => this.onSelectionChange(grid));
      grid.items = this.getGridItems.bind(this);
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

        this.onFiltersChanged();
      } else {
        this.version = this.versions[0];
      }
    }
  }

  // Handles updates to the current version:
  // - toggles the version column visibility
  // - handles filters change
  onVersionChanged($event: any) {
    let hidden = $event.target.value != this.ALL_VERSIONS;
    this.execOnGrid(grid => grid.columns[0].hidden = hidden);
    this.onFiltersChanged();
  }

  // Handles updates to the custom status filter multi-select
  // - iterates over the list of checkboxes and updates the customStatusFilter array property accordingly
  // - handles filters change
  onCustomStatusFilterChanged() {
    let selected = this.statusMenu.nativeElement.selectedItems;
    this.customStatusFilter = selected.map(checkbox => checkbox.value);

    this.onFiltersChanged();
  }

  // Handles updates to any of the filter properties
  onFiltersChanged() {
    // A call to .refreshItem() triggers a call to the .getGridItems() callback.
    // The .getGridItem() applies the current filters and returns filtered data.
    this.execOnGrid(grid => grid.refreshItems());
  }

  // the callback for <vaadin-grid> to fetch contents dynamically
  getGridItems(params, callback) {
    // NOTE: There is a potential for optimization here if performance starts be an issue
    // 1. do the filtering on the backend to save both on client CPU utilization and on traffic
    // 2. do the slicing together with filtering to save even more on CPU and traffic

    // Find all tickets that match the current filters for project, version, assigned_to and status
    let filtered = this.tickets.filter(ticket => {
      let projectMatch = ticket.project == this.project;
      let versionMatch = this.version == this.ALL_VERSIONS || ticket.version == this.version;
      let assignedToMatch = this.assignedToFilter == this.ASSIGNED_TO_ALL ||
        ticket.assigned_to == this.backend.getCurrentUser().name;
      let statusMatch = this.statusFilter == this.STATUS_ALL ||
        (this.statusFilter == this.STATUS_OPEN && ticket.status == BugrapTicketStatus.Open) ||
        (this.statusFilter == this.STATUS_CUSTOM && this.customStatusFilter.indexOf(ticket.status) > -1);
      return projectMatch && versionMatch && assignedToMatch && statusMatch;
    });

    // Then extract a slice of the result set and return only the requested number of items.
    let slice = filtered.slice(params.index, params.index + params.count);
    callback(slice, filtered.length);
  }

  // Handles changes in the grid tickets selection
  // - gathers the IDs of the selected tickets and fires the 'selected-tickets-changed' event
  onSelectionChange(grid: any) {
    let selected = grid.selection.selected();
    let selectedTickets = this.tickets.filter((_, index) => {
      return selected.indexOf(index) > -1;
    });
    this.selectedTicketsChanged.emit({ selectedTickets: selectedTickets });
  }

  refreshTickets() {
    let selected = this.grid.nativeElement.selection.selected().slice(0);
    this.tickets = this.backend.getTickets();

    this.execOnGrid(grid => grid.refreshItems());
    this.execOnGrid(grid => {
      selected.forEach(selectedItemIndex => grid.selection.select(selectedItemIndex));
    });
  }
}
