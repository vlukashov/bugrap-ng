import {
  Component, Input, Output, ViewChild, DoCheck, EventEmitter, ElementRef, AfterViewInit,
  OnInit
} from '@angular/core';
import { NgForm } from "@angular/forms";
import {
  BugrapTicket, BugrapTicketType, BugrapTicketStatus, BugrapTicketPriority,
  BugrapTicketAttachment, BugrapTicketComment, BugrapUser, BugrapVersion
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
  VERSION_VALUES: BugrapVersion[];
  ASSIGNED_TO_VALUES: BugrapUser[];
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
      this.backend.getVersions(this.tickets[0].project.name).then(versions => {
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
    if (!this.editorForm || !this.ticket) {
      return;
    }

    let formdata = {
      version: this.ticket.version ? this.ticket.version.id : undefined,
      priority: this.ticket.priority,
      type: this.ticket.type,
      status: this.ticket.status,
      assigned_to: this.ticket.assigned_to ? this.ticket.assigned_to.id : undefined
    };
    this.comment = '';
    this.editorForm.reset(formdata);
    if (this.editorForm.dirty) {
      // call it the second time due to this bug in angular2-polymer library https://github.com/vaadin/angular2-polymer/issues/95
      this.editorForm.reset(formdata);
    }
  }

  onAssignedToChanged($event) {
    if (!this.ASSIGNED_TO_VALUES) {
      return;
    }

    let index = this.ASSIGNED_TO_VALUES.findIndex((user: BugrapUser) => user.id == $event);
    if (index > -1) {
      this.ticket.assigned_to = this.ASSIGNED_TO_VALUES[index];
    }
  }

  onVersionChanged($event) {
    if (!this.VERSION_VALUES) {
      return;
    }

    let index = this.VERSION_VALUES.findIndex((version: BugrapVersion) => version.id == $event);
    if (index > -1) {
      this.ticket.version = this.VERSION_VALUES[index];
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
        this._resetForm();
      });
    } else {
      this.ticket = new BugrapTicket();
      ['priority', 'type', 'status'].forEach((property: string) => {
        let firstValue = this.tickets[0][property];
        let differentIndex = this.tickets.slice(1).findIndex(ticket => ticket[property] != firstValue);
        this.ticket[property] = differentIndex == -1 ? firstValue : null;
      }, this);

      let firstVersion = this.tickets[0].version;
      let differentIndex = this.tickets.slice(1).findIndex(ticket => ticket.version.id != firstVersion.id);
      this.ticket.version = differentIndex == -1 ? new BugrapVersion(firstVersion.id, firstVersion.name, firstVersion.project) : null;

      let firstAssignee = this.tickets[0].assigned_to;
      differentIndex = this.tickets.slice(1).findIndex(ticket => ticket.assigned_to.id != firstAssignee.id);
      this.ticket.assigned_to = differentIndex == -1 ? new BugrapUser(firstAssignee.id, firstAssignee.name) : null;

      this._resetForm();
    }
  }

  update() {
    let timestamp = new Date();
    if (!this.batchMode) {
      this.ticket.last_modified = timestamp;
      if (this.comment) {
        let newComment = new BugrapTicketComment();
        newComment.description = this.comment;
        newComment.created = timestamp;
        newComment.created_by = this.user;
        newComment.ticket = this.ticket.id;
        this.backend.addComment(newComment);
        this.ticket.comments.push(newComment);
      }
      this.backend.updateTicket(this.ticket);
    } else {
      this.tickets.forEach(ticket => {
        let hasChanges = false;
        ['priority', 'type', 'status'].forEach(property => {
          // do not write back the properties which values were not changed
          if (this.ticket[property] != null && this.ticket[property] != ticket[property]) {
            ticket[property] = this.ticket[property];
            hasChanges = true;
          }
        }, this);
        if (this.ticket.version != null && this.ticket.version.id != ticket.version.id) {
          ticket.version.id = this.ticket.version.id;
          ticket.version.name = this.ticket.version.name;
          ticket.version.project = this.ticket.version.project;
          hasChanges = true;
        }
        if (this.ticket.assigned_to != null && this.ticket.assigned_to.id != ticket.assigned_to.id) {
          ticket.assigned_to.id = this.ticket.assigned_to.id;
          ticket.assigned_to.name = this.ticket.assigned_to.name;
          hasChanges = true;
        }
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

  onUploadStarting($event) {
    // add the uploaded file as a new attachment to the ticket being open in the modal editor
    let file = $event.detail.file;
    let uploadTask = this.backend.uploadFile($event.detail.file);
    let that = this;

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot) {
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
      }
    }, function(error) {
      console.log(`error while uploading: ${error}`);
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      var downloadURL = uploadTask.snapshot.downloadURL;
      console.log(`uploaded successfully, URL: ${downloadURL}`);
      that.modalEditor.addAttachment(file, uploadTask.snapshot.downloadURL);
    });
  }

  onUploadCompleted($event) {
    // remove the uploaded file from the vaadin-upload control
    let file = $event.detail.file;
    let upload = $event.target;
    upload.files = upload.files.filter(f => f !== file);
  }

  addAttachment(file: File, url: string) {
    let attachment = new BugrapTicketAttachment();
    attachment.ticket = this.ticket.id;
    attachment.created = new Date();
    attachment.name = file.name;
    attachment.url = url;
    this.backend.addAttachment(attachment).then((id: string) => {
      attachment.id = id;
      this.ticket.attachments.push(attachment);
      this.tickets[0].attachments = this.ticket.attachments;
    });
  }

  removeAttachment(attachment: BugrapTicketAttachment) {
    this.ticket.attachments = this.ticket.attachments.filter(att => att !== attachment);
    this.tickets[0].attachments = this.ticket.attachments;
    this.backend.removeAttachment(attachment);
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
