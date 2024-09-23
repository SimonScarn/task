import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { PeriodicElement } from '../../types';
import { CellComponent } from '../cell/cell.component';
import { MatTableModule } from '@angular/material/table';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { DialogOverviewExampleDialog } from './../modal/modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { SearchFilterComponent } from '../search-filter/search-filter.component';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { GlobalStateService } from './../global-state.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  standalone: true,
  imports: [CommonModule, CellComponent, MatTableModule, NgFor, NgIf, ButtonComponent, SearchFilterComponent, MatProgressSpinnerModule],
  providers: [RxState],
})
export class TableComponent implements OnInit {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
  dataSource: ExampleDataSource;
  loading = true;
  readonly dialog = inject(MatDialog);
  private state = inject<RxState<{ searchTerm: string; tableData: PeriodicElement[] }>>(RxState);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private globalState = inject(GlobalStateService);

  constructor() {
    this.dataSource = new ExampleDataSource(this);
    this.state.set({ searchTerm: '' });
  }

  ngOnInit(): void {
    this.loading = true;

    setTimeout(() => {
      this.state.connect('searchTerm', this.route.queryParams.pipe(
        map(params => params['search'] || ''),
        distinctUntilChanged(),
        debounceTime(300)
      ));

      this.state.hold(
        this.state.select('searchTerm'),
        (searchTerm: string) => {
          this.onSearchTermChange(searchTerm);
        }
      );

      this.updateDataSource();

      this.loading = false;
    }, 2000);
  }

  updateDataSource() {
    const tableData = this.globalState.get().tableData;
    this.dataSource.setData(tableData);
  }

  onSearchTermChange(searchTerm: string) {
    this.filterData(searchTerm);
    this.router.navigate([], {
      queryParams: { search: searchTerm || null },
      queryParamsHandling: 'merge'
    });
  }

  filterData(searchTerm: string) {
    const currentData = this.globalState.get().tableData;
    const filteredData = currentData.filter((item: PeriodicElement) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    this.dataSource.setData(filteredData);
  }

  onButtonClick(rowData: PeriodicElement) {
    this.openDialog(rowData);
  }

  openDialog(rowData: PeriodicElement): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: { ...rowData },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateRecord(result);
      }
    });
  }

  updateRecord(updatedData: PeriodicElement) {
    const currentData = [...this.globalState.get().tableData];
    const index = currentData.findIndex(item => item.position === updatedData.position);

    if (index !== -1) {
      currentData[index] = updatedData;

      this.globalState.updateTableData(currentData);

      const currentSearchTerm = this.state.get().searchTerm;
      this.filterData(currentSearchTerm); 
    } else {
      console.warn('Record not found for update:', updatedData);
    }
  }

  updateLoadingState() {
    this.loading = false;
    this.cdr.detectChanges();
  }
}

export class ExampleDataSource extends DataSource<PeriodicElement> {
  private dataSubject = new BehaviorSubject<PeriodicElement[]>([]);
  private tableComponent: TableComponent;

  constructor(tableComponent: TableComponent) {
    super();
    this.tableComponent = tableComponent;
  }

  setData(data: PeriodicElement[]) {
    if (data) {
      this.dataSubject.next([...data]);
      this.tableComponent.updateLoadingState();
    }
  }

  connect(): Observable<PeriodicElement[]> {
    return this.dataSubject.asObservable();
  }

  disconnect() { }

  get data(): PeriodicElement[] {
    return this.dataSubject.value;
  }
}
