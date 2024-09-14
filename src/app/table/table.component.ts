import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { PeriodicElement } from '../../types';
import { CellComponent } from '../cell/cell.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, NgFor, NgIf } from '@angular/common'; 
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { ELEMENT_DATA } from '../../data';
import { ButtonComponent } from '../button/button.component'; 
import { DialogOverviewExampleDialog } from './../modal/modal.component'; 
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, CellComponent, MatTableModule, NgFor, NgIf, ButtonComponent], 
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource: ExampleDataSource;
  loading = true; // Initial loading state

  readonly dialog = inject(MatDialog);

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { name: 'John', animal: 'Dog' },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog closed with result:', result);
      // You can handle the result here, e.g., assign it to a property or perform other logic
    });
    console.log('oppppp')
  }

  constructor(private cdr: ChangeDetectorRef) { // Inject ChangeDetectorRef
    this.dataSource = new ExampleDataSource(this); // Pass the component context
  }

  ngOnInit(): void {
    // Simulate a data fetch with a timeout
    setTimeout(() => {
      this.dataSource.setData(ELEMENT_DATA);
    }, 2000); // 2-second delay to simulate fetching
  }

  // Method to update loading state
  updateLoadingState() {
    this.loading = false; // Data fetch completed
    this.cdr.detectChanges(); // Trigger change detection
  }

  onButtonClick() {
    console.log('Button clicked!');
  }
}

export class ExampleDataSource extends DataSource<PeriodicElement> {
  private dataSubject = new BehaviorSubject<PeriodicElement[]>([]);
  private tableComponent: TableComponent;

  constructor(tableComponent: TableComponent) {
    super();
    this.tableComponent = tableComponent;
  }

  // Set data method to update the BehaviorSubject
  setData(data: PeriodicElement[]) {
    if (data) {
      this.dataSubject.next(data);
      console.log('Data updated:', this.dataSubject.value);
      this.tableComponent.updateLoadingState(); // Update the loading state
    } else {
      console.error('No data provided');
    }
  }

  connect(): Observable<PeriodicElement[]> {
    return this.dataSubject.asObservable();
  }

  disconnect() {}

  get data(): PeriodicElement[] {
    return this.dataSubject.value;
  }
}
