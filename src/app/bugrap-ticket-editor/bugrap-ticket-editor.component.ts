import {
  Component, Input, Output, ViewChild, DoCheck, EventEmitter, ElementRef, AfterViewInit,
  OnInit
} from '@angular/core';
import { NgForm } from "@angular/forms";
import {
  BugrapTicket, BugrapTicketType, BugrapTicketStatus, BugrapTicketPriority,
  BugrapTicketAttachment, BugrapTicketComment, BugrapUser
} from '../bugrap-ticket';
import { BugrapBackendService } from '../bugrap-backend.service';


@Component({
  selector: 'bugrap-ticket-editor',
  templateUrl: './bugrap-ticket-editor.component.html',
  styleUrls: ['./bugrap-ticket-editor.component.scss']
})
export class BugrapTicketEditorComponent implements DoCheck, AfterViewInit, OnInit {
  @Input() modal: boolean = false;
  @Input() tickets: BugrapTicket[] = [];
  @Output('tickets-edited') ticketsEdited: EventEmitter<any> = new EventEmitter();

  @ViewChild('dialog') dialog: ElementRef;
  @ViewChild('modalEditor') modalEditor: any;
  @ViewChild('editorForm') editorForm: NgForm;

  EDITABLE_PROPERTIES = ['priority', 'type', 'status', 'assigned_to', 'version'];

  TYPE_CHOICES = BugrapTicketType.getValueLabelPairs();
  STATUS_CHOICES = BugrapTicketStatus.getValueLabelPairs();
  PRIORITY_CHOICES = BugrapTicketPriority.getValueLabelPairs();

  user: BugrapUser;
  VERSION_VALUES: string[];
  ASSIGNED_TO_VALUES: string[];
  batchMode: boolean = false;
  ticketIds: string[] = [];
  ticket: BugrapTicket = new BugrapTicket();
  comment: string = '';

  constructor(private backend: BugrapBackendService) {}

  ngOnInit() {
    this.backend.getUsers().then(users => this.ASSIGNED_TO_VALUES = users);
    this.backend.getCurrentUser().then(user => this.user = user);
  }

  ngDoCheck() {
    if (this.tickets.length == 0) {
      return;
    }

    let newTicketIds = this.tickets.map(ticket => ticket.id).sort();
    let hasChanges = !BugrapTicketEditorComponent._arrayEquals(this.ticketIds, newTicketIds);
    if (hasChanges) {
      this.backend.getVersions(this.tickets[0].project).then(versions => {
        this.VERSION_VALUES = versions;
      });
      this.refreshTickets();
      this.ticketIds = newTicketIds;
    }
  }

  ngAfterViewInit() {
    this._resetForm();
  }

  _resetForm() {
    if (!this.editorForm) {
      return;
    }

    this.comment = '';
    this.editorForm.reset(this.ticket);
    if (this.editorForm.dirty) {
      // call it the second time due to this bug in angular2-polymer library https://github.com/vaadin/angular2-polymer/issues/95
      this.editorForm.reset(this.ticket);
    }
  }

  openModal() {
    this.dialog.nativeElement.open();
  }

  onModalTicketsEdited($event) {
    this.backend.getTicket(this.ticket.id).then(ticket => {
      this.tickets[0] = ticket;
      this.refreshTickets();
    });
    this.ticketsEdited.emit($event);
  }

  onModalClosed($event) {
    if ($event.detail.confirmed) {
      this.modalEditor.update();
    } else {
      this.modalEditor.revert();
    }
  }

  refreshTickets() {
    if (!this.tickets) {
      this.ticket = new BugrapTicket();
      this.batchMode = false;
      return;
    }

    this.batchMode = this.tickets.length > 1;
    if (!this.batchMode) {
      this.backend.getTicket(this.tickets[0].id).then(ticket => {
        this.ticket = Object.assign(new BugrapTicket(), ticket);
      });
    } else {
      this.ticket = new BugrapTicket();
      this.EDITABLE_PROPERTIES.forEach(property => {
        let firstValue = this.tickets[0][property];
        let differentIndex = this.tickets.slice(1).findIndex(ticket => ticket[property] != firstValue);
        if (differentIndex == -1) {
          this.ticket[property] = firstValue;
        }
      }, this);
    }

    this._resetForm();
  }

  update() {
    let timestamp = new Date();
    if (!this.batchMode) {
      this.ticket.last_modified = timestamp;
      if (this.comment) {
        let newComment = new BugrapTicketComment();
        newComment.description = this.comment;
        newComment.created = timestamp;
        newComment.created_by = this.user.name;
        this.ticket.comments.push(newComment);
      }
      this.backend.updateTicket(this.ticket);
    } else {
      this.tickets.forEach(ticket => {
        let hasChanges = false;
        this.EDITABLE_PROPERTIES.forEach(property => {
          // do not write back the properties which values were not changed
          if (typeof this.ticket[property] !== 'undefined' && this.ticket[property] != ticket[property]) {
            ticket[property] = this.ticket[property];
            hasChanges = true;
          }
        }, this);
        if (hasChanges) {
          ticket.last_modified = timestamp;
        }
        this.backend.updateTicket(ticket);
      }, this);
    }
    this._resetForm();
    this.ticketsEdited.emit(null);
  }

  revert() {
    this.refreshTickets();
  }

  onUploadCompleted($event) {
    // add the uploaded file as a new attachment to the ticket being open in the modal editor
    let file = $event.detail.file;
    this.modalEditor.addAttachment(file);

    // remove the uploaded file from the vaadin-upload control
    let upload = $event.target;
    upload.files = upload.files.filter(f => f !== file);
  }

  addAttachment(file) {
    let attachment = new BugrapTicketAttachment();
    attachment.name = file.name;
    attachment.url = '/';
    this.ticket.attachments.push(attachment);
    this.tickets[0].attachments = this.ticket.attachments;
    this.backend.updateTicket(this.ticket);
  }

  removeAttachment(attachment: BugrapTicketAttachment) {
    this.ticket.attachments = this.ticket.attachments.filter(att => att !== attachment);
    this.tickets[0].attachments = this.ticket.attachments;
    this.backend.updateTicket(this.ticket);
  }

  private static _arrayEquals(arr1: Array<any>, arr2: Array<any>): boolean {
    // assume 2 null arrays are equal
    if (arr1 === null && arr2 === null) {
      return true;
    }

    // if any one or both of the arrays are falsy (but not both both are null), assume they are not equal
    if (!arr1 || !arr2) {
      return false;
    }

    // if array lengths are different, the arrays are not equal
    if (arr1.length != arr2.length) {
      return false;
    }

    for (var i = 0, length = arr1.length; i < length; i++) {
      // find the first non-matching element to determine that the arrays are not equal
      if (arr1[i] != arr2[i]) {
        return false;
      }
    }

    // if all the earlier checks do not provide inequality, the arrays are equal
    return true;
  }
}
