import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operator/map';

import {Injectable, Inject} from '@angular/core';
import * as firebase from 'firebase';
import {AngularFire, FirebaseApp} from 'angularfire2';

import {
  BugrapTicket, BugrapVersion, BugrapProject, BugrapTicketPriority, BugrapTicketType,
  BugrapTicketStatus, BugrapUser, BugrapTicketAttachment, BugrapTicketComment
} from './bugrap-ticket';

@Injectable()
export class BugrapBackendService {
  private usersSubscription: Subscription;
  private users: Promise<BugrapUser[]>;

  private projectsSubscription: Subscription;
  private projects: Promise<string[]>;

  private versionsSubscription: Subscription;
  private versions: Promise<BugrapVersion[]>;

  private ticketsSubscription: Subscription;
  private tickets: Promise<BugrapTicket[]>;

  /*  */
  constructor(@Inject(FirebaseApp) private fbApp: firebase.app.App,
              private af: AngularFire)
  {
    this.users = new Promise((resolve, reject) => {
      this.usersSubscription = this.getUsersObservable().subscribe(users => resolve(users));
    });

    this.projects = new Promise((resolve, reject) => {
      this.projectsSubscription = this.getProjectsObservable().subscribe((projects: BugrapProject[]) => {
        resolve(projects.map(project => project.name));
      });
    });

    this.versions = new Promise((resolve, reject) => {
      this.versionsSubscription = this.getVersionsObservable().subscribe(versions => resolve(versions));
    });

    this.tickets = new Promise((resolve, reject) => {
      this.ticketsSubscription = this.getTicketsObservable().subscribe(tickets => resolve(tickets));
    });
  }

  getUsersObservable(): Observable<BugrapUser[]> {
    let fbUsersStream = this.af.database.list('/users');
    return map.call(fbUsersStream, (fbUsers: any[]) => {
      return fbUsers.map((fbUser: any) => {
        return new BugrapUser(fbUser.$key, fbUser.$value);
      });
    });
  }

  getProjectsObservable(): Observable<BugrapProject[]> {
    let fbProjectsStream = this.af.database.list('/projects');
    return map.call(fbProjectsStream, (fbProjects: any[]) => {
      return fbProjects.map((fbProject: any) => {
        return new BugrapProject(fbProject.$key, fbProject.$value);
      });
    });
  }

  getVersionsObservable(): Observable<BugrapVersion[]> {
    let fbVersionsStream = this.af.database.list('/versions');
    return map.call(fbVersionsStream, (fbVersions: any[]) => {
      return fbVersions.map((fbVersion: any) => {
        return new BugrapVersion(fbVersion.$key, fbVersion.name, fbVersion.project_label);
      });
    });
  }

  getTicketsObservable(): Observable<BugrapTicket[]> {
    let fbTicketsStream = this.af.database.list('/tickets');
    return map.call(fbTicketsStream, (fbTickets: any[]) => {
      return fbTickets.map((fbTicket: any) => {
        let ticket = new BugrapTicket();
        ticket.id = fbTicket.$key;
        ticket.assigned_to = fbTicket.assigned_to ? new BugrapUser(fbTicket.assigned_to, fbTicket.assigned_to_label) : null;
        ticket.description = fbTicket.description;
        ticket.last_modified = fbTicket.last_modified ? new Date(fbTicket.last_modified) : null;
        ticket.priority = <BugrapTicketPriority>fbTicket.priority;
        ticket.project = new BugrapProject(fbTicket.project, fbTicket.project_label);
        ticket.reported = new Date(fbTicket.reported);
        ticket.reported_by = new BugrapUser(fbTicket.reported_by, fbTicket.reported_by_label);
        ticket.status = BugrapTicketStatus[<string>fbTicket.status];
        ticket.summary = fbTicket.summary;
        ticket.type = BugrapTicketType[<string>fbTicket.type];
        ticket.version = new BugrapVersion(fbTicket.version, fbTicket.version_label, fbTicket.project_label);
        return ticket;
      });
    });
  }

  getTickets(): Promise<BugrapTicket[]> {
    return this.tickets;
  }

  getTicket(id: string): Promise<BugrapTicket> {
    let ticket = this.tickets.then((tickets) => {
      let index = tickets.findIndex(ticket => ticket.id === id);
      return (index > -1) ? tickets[index] : null;
    });

    let comments = new Promise((resolve, reject) => {
      let sub = this.af.database.list('/comments', { query: {
        orderByChild: 'ticket',
        equalTo: id
      }}).subscribe(fbComments => {
        sub.unsubscribe();
        resolve(fbComments.map(fbComment => {
          let comment = new BugrapTicketComment();
          comment.id = fbComment.$key;
          comment.description = fbComment.message;
          comment.created = fbComment.created;
          comment.created_by = new BugrapUser(fbComment.created, fbComment.created_by_label);
          return comment;
        }).sort((a: BugrapTicketComment, b: BugrapTicketComment) => {
          if (a.created < b.created) return -1;
          if (a.created > b.created) return 1;
          return 0;
        }));
      });
    });

    let attachments = new Promise((resolve, reject) => {
      let sub = this.af.database.list('/attachments', { query: {
        orderByChild: 'ticket',
        equalTo: id
      }}).subscribe(fbAttachments => {
        sub.unsubscribe();
        resolve(fbAttachments.map(fbAttachment => {
          let attachment = new BugrapTicketAttachment();
          attachment.id = fbAttachment.$key;
          attachment.name = fbAttachment.name;
          attachment.url = fbAttachment.url;
          attachment.created = fbAttachment.created ? new Date(fbAttachment.created) : null;
          attachment.ticket = fbAttachment.ticket;
          return attachment;
        }).sort((a: BugrapTicketAttachment, b: BugrapTicketAttachment) => {
          if (a.created < b.created) return -1;
          if (a.created > b.created) return 1;
          return 0;
        }));
      });
    });

    return Promise.all([ticket, comments, attachments]).then(results => {
      let ticket = results[0];
      if (ticket) {
        ticket.comments = <BugrapTicketComment[]>results[1];
        ticket.attachments = <BugrapTicketAttachment[]>results[2];
      }
      return ticket;
    });
  }

  updateTicket(updatedTicket: BugrapTicket) {
    this.tickets.then(tickets => {
      // Update the local cache first (this is quick)
      let index = tickets.findIndex(ticket => ticket.id == updatedTicket.id);
      if (index > -1) {
        tickets[index] = <BugrapTicket>Object.assign(new BugrapTicket(), updatedTicket);
      }
    }).then(() => {
      // After that send the update to the server.
      // (once the tickets list is update on the server, it sends an update back and the local cache is refreshed)
      this.af.database.list('/tickets').update(updatedTicket.id, {
        assigned_to: updatedTicket.assigned_to ? updatedTicket.assigned_to.id : null,
        assigned_to_label: updatedTicket.assigned_to ? updatedTicket.assigned_to.name : null,
        description: updatedTicket.description,
        last_modified: updatedTicket.last_modified ? updatedTicket.last_modified.toJSON() : null,
        priority: updatedTicket.priority,
        project: updatedTicket.project ? updatedTicket.project.id : null,
        project_label: updatedTicket.project ? updatedTicket.project.name : null,
        reported: updatedTicket.reported ? updatedTicket.reported.toJSON() : null,
        reported_by: updatedTicket.reported_by ? updatedTicket.reported_by.id : null,
        reported_by_label: updatedTicket.reported_by ? updatedTicket.reported_by.name : null,
        status: BugrapTicketStatus[updatedTicket.status],
        summary: updatedTicket.summary,
        type: BugrapTicketType[updatedTicket.type],
        version: updatedTicket.version ? updatedTicket.version.id : null,
        version_label: updatedTicket.version ? updatedTicket.version.name : null
      });
    });
  }

  addComment(comment: BugrapTicketComment) {
    this.af.database.list('/comments').push({
      created: comment.created.toJSON(),
      created_by: comment.created_by.id,
      created_by_label: comment.created_by.name,
      message: comment.description,
      ticket: comment.ticket
    });
  }

  uploadFile(file: File) {
    let root = this.fbApp.storage().ref();
    return root.child(`attachments/${new Date().getTime()}-${file.name}`).put(file);
  }

  addAttachment(attachment: BugrapTicketAttachment): Promise<string> {
    return new Promise((resolve, reject) => {
      this.af.database.list('/attachments').push({
        created: attachment.created.toJSON(),
        name: attachment.name,
        url: attachment.url,
        ticket: attachment.ticket
      }).then(result => {
        resolve(result.key);
      });
    });
  }

  removeAttachment(attachment: BugrapTicketAttachment) {
    let url = attachment.url;
    this.af.database.list('/attachments').remove(attachment.id).then(() => {
      this.fbApp.storage().refFromURL(url).delete();
    });
  }

  getProjects(): Promise<string[]> {
    return this.projects;
  }

  getVersionNames(project: string): Promise<string[]> {
    return this.versions.then((versions: BugrapVersion[]) => {
      return versions.filter((version: BugrapVersion) => version.project == project).map(version => version.name);
    });
  }

  getVersions(project: string): Promise<BugrapVersion[]> {
    return this.versions.then((versions: BugrapVersion[]) => {
      return versions.filter((version: BugrapVersion) => version.project == project);
    });
  }

  getUsers(): Promise<BugrapUser[]> {
    return this.users;
  }

  getCurrentUser(): Promise<BugrapUser> {
    return Promise.resolve(new BugrapUser('marc', 'Marc Manager'));
  }
}
