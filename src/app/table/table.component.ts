import { Component, OnInit } from '@angular/core';
import { PeriodicElement } from '../../types';
import { CellComponent } from '../cell/cell.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, NgFor, NgIf } from '@angular/common'; // Import CommonModule
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { ELEMENT_DATA } from '../../data';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, CellComponent, MatTableModule, NgFor, NgIf], // Include CommonModule
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource: ExampleDataSource = new ExampleDataSource();

  ngOnInit(): void {
    // Simulate a data fetch with a timeout
    setTimeout(() => {
      this.dataSource.setData(ELEMENT_DATA);
    }, 2000); // 2-second delay to simulate fetching
  }
}

export class ExampleDataSource extends DataSource<PeriodicElement> {
  dataSubject = new BehaviorSubject<PeriodicElement[]>([]);

  // Set data method to update the BehaviorSubject
  setData(data: PeriodicElement[]) {
    if (data) {
      this.dataSubject.next(data);
      console.log('Data updated:', this.dataSubject.value);
    } else {
      console.error('No data provided');
    }
  }

  connect(): Observable<PeriodicElement[]> {
    return this.dataSubject.asObservable();
  }

  disconnect() {}
}
