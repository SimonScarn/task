import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

export interface DialogData {
  name: string;
  weight: number;
  position: number;
  symbol: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule 
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  headerTitle: string;
  name: string;
  weight: number;
  position: number;
  symbol: string;

  constructor() {
    this.headerTitle = this.data.name;
    this.name = this.data.name;
    this.weight = this.data.weight;
    this.position = this.data.position;
    this.symbol = this.data.symbol;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    this.dialogRef.close({ 
      name: this.name, 
      weight: this.weight,
      position: this.position,
      symbol: this.symbol 
    });
  }
}
