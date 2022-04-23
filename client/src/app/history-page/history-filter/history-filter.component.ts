import {
  MaterialService,
  MaterialDatepicker,
} from './../../shared/classes/material.service';
import { Filter } from './../../shared/interfaces';
import {
  Component,
  ElementRef,
  OnDestroy,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss'],
})
export class HistoryFilterComponent implements OnDestroy, AfterViewInit {
  @Output() onFilter = new EventEmitter<Filter>();
  @ViewChild('start') startRef!: ElementRef;
  @ViewChild('end') endRef!: ElementRef;

  start!: MaterialDatepicker;
  end!: MaterialDatepicker;
  order!: number;

  isValid = true;

  constructor() {}

  ngOnDestroy(): void {
    this.start.destroy();
    this.end.destroy();
  }

  ngAfterViewInit(): void {
    this.start = MaterialService.initializeDatepicker(
      this.startRef,
      this.validate.bind(this)
    );

    this.end = MaterialService.initializeDatepicker(
      this.endRef,
      this.validate.bind(this)
    );
  }

  private validate(): void {
    if (!this.start.date || !this.end.date) {
      this.isValid = true;
      return;
    }

    this.isValid = this.start.date < this.end.date;
  }

  submitFilter(): void {
    const filter: Filter = {};

    if (this.order) {
      filter.order = this.order;
    }

    if (this.start.date) {
      filter.start = this.start.date;
    }

    if (this.end.date) {
      filter.end = this.end.date;
    }

    this.onFilter.emit(filter);
  }
}
