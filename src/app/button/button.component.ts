import { Component, Input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-button',
  template: `<button mat-button color="primary" (click)="onClick()">{{ text }}</button>`,
  styleUrls: ['./button.component.scss'],
  imports: [
    MatButtonModule
  ],
  standalone: true,
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() onClick: () => void = () => {};
}
