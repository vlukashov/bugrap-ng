export enum BugrapTicketType {
  Bug = 1,
  Feature
}

export namespace BugrapTicketType {
  export function getValueLabelPairs() {
    return [
      { value: BugrapTicketType.Bug, label: 'Bug' },
      { value: BugrapTicketType.Feature, label: 'Feature' }
    ];
  }
}

export enum BugrapTicketStatus {
  Open = 1,
  Fixed,
  Invalid,
  WontFix,
  CantFix,
  Duplicate,
  WorksForMe,
  NeedsMoreInformation
}

export namespace BugrapTicketStatus {
  export function getValueLabelPairs() {
    return [
      { value: BugrapTicketStatus.Open, label: 'Open' },
      { value: BugrapTicketStatus.Fixed, label: 'Fixed' },
      { value: BugrapTicketStatus.Invalid, label: 'Invalid' },
      { value: BugrapTicketStatus.WontFix, label: 'Won\'t fix' },
      { value: BugrapTicketStatus.CantFix, label: 'Can\'t fix' },
      { value: BugrapTicketStatus.Duplicate, label: 'Duplicate' },
      { value: BugrapTicketStatus.WorksForMe, label: 'Works for me' },
      { value: BugrapTicketStatus.NeedsMoreInformation, label: 'Needs more information' },
    ];
  }
}

export enum BugrapTicketPriority {
  Priority1 = 1,
  Priority2,
  Priority3,
  Priority4,
  Priority5
}

export namespace BugrapTicketPriority {
  export function getValueLabelPairs() {
    return [
      { value: BugrapTicketPriority.Priority1, label: '1' },
      { value: BugrapTicketPriority.Priority2, label: '2' },
      { value: BugrapTicketPriority.Priority3, label: '3' },
      { value: BugrapTicketPriority.Priority4, label: '4' },
      { value: BugrapTicketPriority.Priority5, label: '5' }
    ];
  }
}

export class BugrapTicketComment {
  created: Date;
  created_by: string;
  description: string;
}

export class BugrapTicketAttachment {
  name: string;
  url: string;
}

export class BugrapTicket {
  id: string;
  project: string;
  version: string;
  type: BugrapTicketType;
  status: BugrapTicketStatus;
  priority: BugrapTicketPriority;
  summary: string;
  description: string;
  reported: Date;
  last_modified: Date;
  reported_by: string;
  assigned_to: string;
  comments: BugrapTicketComment[];
  attachments: BugrapTicketAttachment[];
}
