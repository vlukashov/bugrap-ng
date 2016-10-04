import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { PolymerElement } from '@vaadin/angular2-polymer';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { BugrapTicketEditorComponent } from './bugrap-ticket-editor/bugrap-ticket-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    BugrapTicketEditorComponent,
    PolymerElement('paper-input'),
    PolymerElement('paper-button'),
    PolymerElement('paper-menu'),
    PolymerElement('paper-menu-button'),
    PolymerElement('paper-checkbox'),
    PolymerElement('iron-icon'),
    PolymerElement('vaadin-combo-box'),
    PolymerElement('vaadin-grid'),
    PolymerElement('vaadin-split-layout')
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MomentModule
  ],
  providers: [],
  bootstrap: [ AppComponent ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
