import { Component, ViewChild } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('grid') grid: any;

  user = { name: 'Marc Manager' };
  projects = [
    'Project name that is rather long pellentesque habitant mobi',
    'Yet Another Project (CLOSED, DO NOT USE)',
    'The Phoenix Project',
    'Project Alpha',
    "Project Beta (cause it's beta than nothing)",
    'Project Gamma',
    'Project Delta',
    'Project Epsilon',
    'Project Omega'
  ];
  project = 'Project name that is rather long pellentesque habitant mobi';
  versions = ['All versions', '1.2.3-pre12', '1.3'];
  version = '1.2.3-pre12';
  tickets = [
    {
      "priority": 5,
      "type": "Bug",
      "summary": "Panel child component is invalid",
      "assigned_to": "Marc Manager",
      "last_modified": null,
      "reported": moment().subtract(15, 'minutes').toDate()
    },
    {
      "version": "1.2.3-pre12",
      "priority": 3,
      "type": "Bug",
      "status": "Works for me",
      "summary": "Menubar \"bottleneck\" usability problem",
      "assigned_to": "Marc Manager",
      "last_modified": moment().subtract(30, 'minutes').toDate(),
      "reported": moment().subtract(2, 'hours').toDate(),
      "reported_by": "Hank Backwoodling",
      "description": "At its current state, the MenBar component has a severe usability problem, called the \"bottleneck in hierarchical menus\" by Bruce Tognazzini already back in 1999. It can be demonstrated with the \"Basic MenuBar\" demo from the sampler:\n\n1. Click \"File\"\n2. Move mouse pointer over to \"New\" - a submenu with three items opens.\n3. Move mouse pointer to \"Project...\" in the submenu\n4 Unless you moves your mouse pointer very carefully through the \"bottleneck\" marked with the arrow, the submenu probably closed when \"Open file...\" item captured the focus."
    },
    {
      "priority": 2,
      "type": "Feature",
      "summary": "Improve layout support",
      "assigned_to": "Marc Manager",
      "last_modified": null,
      "reported": moment().subtract(6, 'days').toDate()
    },
    {
      "priority": 2,
      "type": "Bug",
      "summary": "Fix chrome theme identifier",
      "assigned_to": "Marc Manager",
      "last_modified": moment().subtract(2, 'weeks').toDate(),
      "reported": moment().subtract(1, 'month').toDate()
    }
  ];
  ticket = {
    "version": "1.2.3-pre12",
    "priority": 3,
    "type": "Bug",
    "status": "Works for me",
    "summary": "Menubar \"bottleneck\" usability problem",
    "assigned_to": "Marc Manager",
    "last_modified": moment().subtract(30, 'minutes').toDate(),
    "reported": moment().subtract(2, 'hours').toDate(),
    "reported_by": "Hank Backwoodling",
    "description": "At its current state, the MenBar component has a severe usability problem, called the \"bottleneck in hierarchical menus\" by Bruce Tognazzini already back in 1999. It can be demonstrated with the \"Basic MenuBar\" demo from the sampler:\n\n1. Click \"File\"\n2. Move mouse pointer over to \"New\" - a submenu with three items opens.\n3. Move mouse pointer to \"Project...\" in the submenu\n4 Unless you moves your mouse pointer very carefully through the \"bottleneck\" marked with the arrow, the submenu probably closed when \"Open file...\" item captured the focus."
  };

  PRIORITY_VALUES = [ 1, 2, 3, 4, 5 ];
  TYPE_VALUES = [ 'Bug', 'Feature' ];
  STATUS_VALUES = [ "Open", "Fixed", "Invalid", "Won't fix", "Can't fix", "Duplicate", "Works for me", "Needs more information" ];
  ASSIGNED_TO_VALUES = [ 'Marc Manager', 'Joe Employee', 'Lucie Customer' ];

  ngAfterViewInit() {
    this.grid.nativeElement.then(() => {
      this.gridReady(this.grid.nativeElement);
    });
  }

  gridReady(grid: any) {
    let dateRenderer = (cell: any) => {
      var date = moment(cell.data);
      cell.element.innerHTML = date.isValid() ? date.from(moment()) : '';
    };

    grid.columns[4].renderer = dateRenderer;
    grid.columns[5].renderer = dateRenderer;
  }

  onSelectionChange(event: any) {
  }
}
