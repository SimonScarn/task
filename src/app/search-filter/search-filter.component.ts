import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GlobalStateService } from './../global-state.service';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RxState } from '@rx-angular/state';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-search-filter',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss'],
})
export class SearchFilterComponent implements OnInit {
  @Output() searchTermChange = new EventEmitter<string>();
  searchTerm: string = '';
  private searchSubject = new BehaviorSubject<string>('');

  private globalState = inject(GlobalStateService);
  private state = new RxState<{ searchTerm: string }>();

  ngOnInit() {
    this.searchTerm = this.globalState.get().searchTerm || '';

    this.state.hold(
      this.searchSubject.pipe(
        debounceTime(2000),
        distinctUntilChanged()
      ),
      term => {
        this.globalState.updateSearchTerm(term);
        this.searchTermChange.emit(term);
      }
    );
  }

  onSearchChange(term: string): void {
    this.searchSubject.next(term); 
  }
}
