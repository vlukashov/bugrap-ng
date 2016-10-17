import { Component, Input } from '@angular/core';

@Component({
  selector: 'bugrap-trigress-bar',
  templateUrl: './bugrap-trigress-bar.component.html',
  styleUrls: [ './bugrap-trigress-bar.component.scss' ]
})
export class BugrapTrigressBarComponent {
  @Input() first: Number;
  @Input() second: Number;
  @Input() third: Number;
}
