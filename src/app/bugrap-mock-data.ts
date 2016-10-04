import * as moment from 'moment';
import { BugrapTicketPriority, BugrapTicketType, BugrapTicketStatus, BugrapTicket } from './bugrap-ticket';

export function getUserNames() {
  return [ 'Marc Manager', 'Hank Backwoodling', 'Joe Employee', 'Lucie Customer' ];
}

export function getCurrentUser() {
  return { name: getUserNames()[0] };
}

export function getProjectsNames() {
  return [
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
}

export function getProjectVersions() {
  return ['All versions', '1.2.3-pre12', '1.3'];
}

export function getTickets() {
  return <BugrapTicket[]> [
    {
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority5,
      summary: "Panel child component is invalid",
      description: "",
      reported: moment().subtract(15, 'minutes').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager"
    },
    {
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.WorksForMe,
      priority: BugrapTicketPriority.Priority3,
      summary: "Menubar \"bottleneck\" usability problem",
      description: "At its current state, the MenBar component has a severe usability problem, called the \"bottleneck in hierarchical menus\" by Bruce Tognazzini already back in 1999. It can be demonstrated with the \"Basic MenuBar\" demo from the sampler:\n\n1. Click \"File\"\n2. Move mouse pointer over to \"New\" - a submenu with three items opens.\n3. Move mouse pointer to \"Project...\" in the submenu\n4 Unless you moves your mouse pointer very carefully through the \"bottleneck\" marked with the arrow, the submenu probably closed when \"Open file...\" item captured the focus.",
      reported: moment().subtract(2, 'hours').toDate(),
      last_modified: moment().subtract(30, 'minutes').toDate(),
      reported_by: "Hank Backwoodling",
      assigned_to: "Marc Manager"
    },
    {
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Feature,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority2,
      summary: "Improve layout support",
      description: "Not much to say here",
      reported: moment().subtract(6, 'days').toDate(),
      last_modified: null,
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager"
    },
    {
      project: "Project name that is rather long pellentesque habitant mobi",
      version: "1.2.3-pre12",
      type: BugrapTicketType.Bug,
      status: BugrapTicketStatus.Open,
      priority: BugrapTicketPriority.Priority2,
      summary: "Fix chrome theme identifier",
      description: "Some random glitch?",
      reported: moment().subtract(1, 'month').toDate(),
      last_modified: moment().subtract(2, 'weeks').toDate(),
      reported_by: "Marc Manager",
      assigned_to: "Marc Manager"
    }
  ];
}