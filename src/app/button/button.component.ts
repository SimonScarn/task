import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  template: `<button (click)="onClick()">{{ text }}</button>`,
  styleUrls: ['./button.component.scss'],
  standalone: true,
})
export class ButtonComponent {
  @Input() text: string = 'Button';
  @Input() onClick: () => void = () => {};
}
