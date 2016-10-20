import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operator/map';

import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';

import {
  BugrapTicket, BugrapVersion, BugrapProject, BugrapTicketPriority, BugrapTicketType,
  BugrapTicketStatus, BugrapUser, BugrapTicketAttachment, BugrapTicketComment
} from './bugrap-ticket';

@Injectable()
export class BugrapBackendService {
  private usersSubscription: Subscription;
  private users: Promise<string[]>;

  private projectsSubscription: Subscription;
  private projects: Promise<string[]>;

  private versionsSubscription: Subscription;
  private versions: Promise<BugrapVersion[]>;

  private ticketsSubscription: Subscription;
  private tickets: Promise<BugrapTicket[]>;

  /* @Inject(FirebaseApp) private fbApp: firebase.app.App */
  constructor(private af: AngularFire) {
    this.users = new Promise((resolve, reject) => {
      this.usersSubscription = this.getUsersObservable().subscribe((users: BugrapUser[]) => {
        resolve(users.map(user => user.name));
      });
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
        ticket.assigned_to = fbTicket.assigned_to_label;
        ticket.description = fbTicket.description;
        ticket.last_modified = fbTicket.last_modified;
        ticket.priority = <BugrapTicketPriority>fbTicket.priority;
        ticket.project = fbTicket.project_label;
        ticket.reported = fbTicket.reported;
        ticket.reported_by = fbTicket.reported_by_label;
        ticket.status = BugrapTicketStatus[<string>fbTicket.status];
        ticket.summary = fbTicket.summary;
        ticket.type = BugrapTicketType[<string>fbTicket.type];
        ticket.version = fbTicket.version_label;
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
          comment.created_by = fbComment.created_by_label;
          return comment;
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
          return attachment;
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

  updateTicket(updatedTicket: BugrapTicket): Promise<BugrapTicket[]> {
    this.tickets = this.tickets.then((tickets: BugrapTicket[]) => {
      return tickets.map((ticket: BugrapTicket) => {
        if (ticket.id == updatedTicket.id) {
          return <BugrapTicket> Object.assign(new BugrapTicket(), updatedTicket);
        } else {
          return ticket;
        }
      });
    });
    return this.tickets;
  }

  getProjects(): Promise<string[]> {
    return this.projects;
  }

  getVersions(project): Promise<string[]> {
    return this.versions.then(versions => {
      return versions.filter(version => version.project == project).map(version => version.name);
    });
  }

  getUsers(): Promise<string[]> {
    return this.users;
  }

  getCurrentUser(): Promise<BugrapUser> {
    return Promise.resolve(new BugrapUser('marc', 'Marc Manager'));
  }
}
