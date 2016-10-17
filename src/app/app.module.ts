import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PolymerElement } from '@vaadin/angular2-polymer';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { BugrapTrigressBarComponent } from './bugrap-trigress-bar/bugrap-trigress-bar.component';
import { BugrapProjectViewComponent } from './bugrap-project-view/bugrap-project-view.component';
import { BugrapTicketEditorComponent } from './bugrap-ticket-editor/bugrap-ticket-editor.component';
import { BugrapBackendService } from './bugrap-backend.service';


@NgModule({
  declarations: [
    AppComponent,
    BugrapTrigressBarComponent,
    BugrapProjectViewComponent,
    BugrapTicketEditorComponent,

    PolymerElement('iron-icon'),
    PolymerElement('iron-dropdown'),

    PolymerElement('paper-material'),
    PolymerElement('paper-card'),
    PolymerElement('paper-input'),
    PolymerElement('paper-textarea'),
    PolymerElement('paper-button'),
    PolymerElement('paper-icon-button'),
    PolymerElement('paper-menu'),
    PolymerElement('paper-checkbox'),
    PolymerElement('paper-toolbar'),
    PolymerElement('paper-dialog'),
    PolymerElement('paper-dialog-scrollable'),
    PolymerElement('paper-tabs'),
    PolymerElement('paper-tab'),

    PolymerElement('vaadin-combo-box'),
    PolymerElement('vaadin-grid'),
    PolymerElement('vaadin-split-layout'),
    PolymerElement('vaadin-upload')
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule
  ],
  providers: [ BugrapBackendService ],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
