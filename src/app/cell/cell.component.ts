import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-cell',
  templateUrl: './cell.component.html',
  styleUrls: ['./cell.component.scss'],
  standalone: true,
})

export class CellComponent {
  @Input() data: any;
}
