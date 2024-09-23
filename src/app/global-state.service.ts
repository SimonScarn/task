import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ELEMENT_DATA } from '../data';
import { PeriodicElement } from '../types';

@Injectable({
  providedIn: 'root' 
})
export class GlobalStateService extends RxState<{ searchTerm: string; originalData: PeriodicElement[]; tableData: PeriodicElement[] }> {
  constructor(private route: ActivatedRoute, private router: Router) {
    super();
    this.set({ searchTerm: '', originalData: ELEMENT_DATA, tableData: ELEMENT_DATA }); 

    this.connect(
      'searchTerm',
      this.route.queryParams.pipe(
        map(params => params['search'] || ''),
        distinctUntilChanged(),
        tap(searchTerm => {
          this.set({ searchTerm });
        })
      )
    );
  }

  updateSearchTerm(term: string): void {
    this.set({ searchTerm: term });
    this.router.navigate([], {
      queryParams: { search: term || null },
      queryParamsHandling: 'merge'
    });
  }

  updateTableData(data: PeriodicElement[]) {
    this.set({ tableData: [...data] });
  }

  resetTableData(): void {
    this.set({ tableData: [...this.get().originalData] });
  }
}
