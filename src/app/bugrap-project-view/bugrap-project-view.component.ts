import { Component, ViewChild, OnInit, AfterViewInit, OnChanges, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import * as moment from 'moment';

import { BugrapTicket, BugrapTicketStatus, BugrapTicketType, BugrapUser } from '../bugrap-ticket';
import { BugrapBackendService } from '../bugrap-backend.service';


@Component({
  selector: 'bugrap-project-view',
  templateUrl: './bugrap-project-view.component.html',
  styleUrls: [ './bugrap-project-view.component.css' ]
})
export class BugrapProjectViewComponent implements OnInit, AfterViewInit, OnChanges {

  @Input() project: string;
  @Output('selected-tickets-changed') selectedTicketsChanged: EventEmitter<any> = new EventEmitter();
  @Output('ticket-opened') ticketOpened: EventEmitter<any> = new EventEmitter();
  @ViewChild('grid') grid: any;
  @ViewChild('statusMenuOverlay') statusMenuOverlay: any;
  @ViewChild('statusMenu') statusMenu: any;

  ALL_VERSIONS = 'All versions';

  ASSIGNED_TO_ALL = 'all';
  ASSIGNED_TO_ME = 'me';

  STATUS_ALL = 'all';
  STATUS_OPEN = 'open';
  STATUS_CUSTOM = 'custom';

  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();

  user: BugrapUser;
  lastSelectedVersions: Map<string, string> = new Map();
  versions: string[];
  version: string;
  assignedToFilter: string = this.ASSIGNED_TO_ALL;
  statusFilter: string = this.STATUS_ALL;
  searchFilter: string = '';
  customStatusFilter: BugrapTicketStatus[] = [];
  tickets: BugrapTicket[] = [];
  selectedTickets: BugrapTicket[] = [];

  ticketCounts: { closed: number, assigned: number, unassigned: number } = { closed: 0, assigned: 0, unassigned: 0 };

  constructor(private backend: BugrapBackendService) {}

  // execute some callback async when the grid control is ready
  execOnGrid(callback: (grid: any) => void) {
    this.grid.nativeElement.then(() => callback(this.grid.nativeElement));
  }

  ngOnInit() {
    this.backend.getCurrentUser().then(user => {
      this.user = user;
    });
  }

  ngAfterViewInit() {
    // initialize the grid control
    this.execOnGrid((grid) => {
      grid.columns[1].renderer = (cell: any) => {
        cell.element.innerHTML = '';

        let priorityElement = document.createElement('bugrap-priority');
        priorityElement.setAttribute('value', cell.data);
        cell.element.appendChild(priorityElement);
      };

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

      grid.addEventListener('detailed-dblclick', ($event) => {
        let data = $event.detail.data;
        let index = $event.detail.row;
        grid.selection.clear();
        grid.selection.select(index);
        this.ticketOpened.emit(data);
      });

      grid.addEventListener('selected-items-changed', () => this.onSelectionChange(grid));
      grid.items = this.getGridItems.bind(this);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project']) {
      let change = changes['project'];

      this.backend.getVersions(this.project).then(versions => {
        this.versions = versions;
        if (this.versions.length > 1) {
          this.versions.unshift(this.ALL_VERSIONS);
        }

        if (!change.isFirstChange()) {
          let lastSelectedVersion = this.lastSelectedVersions[this.project];
          this.lastSelectedVersions[change.previousValue] = this.version;
          this.version = lastSelectedVersion ? lastSelectedVersion : this.versions[0];
          this.searchFilter = '';

          this.onFiltersChanged();
        } else {
          this.version = this.versions[0];
        }
      });
    }
  }

  updateTicketCounts() {
    // NOTE: here it might make sense to offload the counting logic off to the backend for higher efficiency
    this.backend.getTickets().then(tickets => {
      let result: { closed: number, assigned: number, unassigned: number } = {
        closed: 0,
        assigned: 0,
        unassigned: 0
      };

      tickets.forEach(ticket => {
        if (ticket.project != this.project || (this.version != this.ALL_VERSIONS && ticket.version != this.version)) {
          // return counts only for the tickets in the selected version of the current project
          return;
        }

        if (ticket.status != BugrapTicketStatus.Open) {
          result.closed += 1;
        } else if (ticket.assigned_to) {
          result.assigned += 1;
        } else {
          result.unassigned += 1;
        }
      });

      this.ticketCounts = result;
    });
  }

  // Handles updates to the current search filter
  // - updates the filter value from the input control
  // - triggers the grid update
  onSearchFilterChanged(value: string) {
    this.searchFilter = value;
    this.onFiltersChanged();
  }

  // Handles updates to the current version:
  // - toggles the version column visibility
  // - handles filters change
  onVersionChanged($event: any) {
    let hidden = $event.target.value != this.ALL_VERSIONS;
    this.execOnGrid(grid => grid.columns[0].hidden = hidden);
    this.updateTicketCounts();
    this.onFiltersChanged();
  }

  // Handles updates to the current status filter
  // - if the 'custom' status filter is selected but no status values are chosen, open the status selection menu
  // - otherwise do the same as on any other filters change
  onStatusFilterChanged() {
    if (this.statusFilter == this.STATUS_CUSTOM && this.customStatusFilter.length == 0) {
      this.statusMenuOverlay.nativeElement.open();
    } else {
      this.onFiltersChanged();
    }
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
    this.execOnGrid(grid => grid.selection.clear());
  }

  // the callback for <vaadin-grid> to fetch contents dynamically
  getGridItems(params, callback) {
    // NOTE: There is a potential for optimization here if performance starts be an issue
    // 1. do the filtering on the backend to save both on client CPU utilization and on traffic
    // 2. do the slicing together with filtering to save even more on CPU and traffic

    this.backend.getTickets().then(tickets => {
      // Find all tickets that match the current filters for project, version, assigned_to and status
      this.tickets = tickets.filter(ticket => {
        let projectMatch = ticket.project == this.project;
        let versionMatch = this.version == this.ALL_VERSIONS || ticket.version == this.version;
        let assignedToMatch = this.assignedToFilter == this.ASSIGNED_TO_ALL ||
          ticket.assigned_to == this.user.name;
        let statusMatch = this.statusFilter == this.STATUS_ALL ||
          (this.statusFilter == this.STATUS_OPEN && ticket.status == BugrapTicketStatus.Open) ||
          (this.statusFilter == this.STATUS_CUSTOM && this.customStatusFilter.indexOf(ticket.status) > -1);

        let searchFilterRegExp = new RegExp(this.searchFilter, 'gi');
        let searchMatch = this.searchFilter == '' ||
          searchFilterRegExp.test(ticket.summary) ||
          searchFilterRegExp.test(ticket.description) ||
          searchFilterRegExp.test(ticket.assigned_to);
        return projectMatch && versionMatch && assignedToMatch && statusMatch && searchMatch;
      });

      // Then apply the sort order (possibly with secondary columns)
      let grid = this.grid.nativeElement;
      let sortOrder: Array<{ column: number, direction: string; }> = grid.sortOrder || [];
      if (sortOrder.length > 0) {
        this.tickets.sort((a: BugrapTicket, b: BugrapTicket) => {
          for (let i = 0; i < sortOrder.length; i += 1) {
            let sort = sortOrder[i];
            let lesser = sort.direction == 'asc' ? -1 : 1;
            let property = grid.columns[sort.column].name;

            if (a[property] < b[property]) return lesser;
            if (a[property] > b[property]) return -lesser;
          }
          return 0;
        });
      }

      // Then extract a slice of the result set and return only the requested number of items.
      let slice = this.tickets.slice(params.index, params.index + params.count);
      callback(slice, this.tickets.length);
    });
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
    this.execOnGrid(grid => grid.refreshItems());
    this.execOnGrid(grid => {
      selected.forEach(selectedItemIndex => grid.selection.select(selectedItemIndex));
    });
  }
}
