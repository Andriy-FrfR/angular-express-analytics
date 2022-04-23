import { Filter } from './../shared/interfaces';
import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import {
  MaterialService,
  MaterialInstance,
} from './../shared/classes/material.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { Order } from '../shared/interfaces';

const STEP = 2;

@Component({
  selector: 'app-history',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss'],
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tooltip') tooltipRef!: ElementRef;
  tooltip!: MaterialInstance;
  isFilterVisible = false;
  oSub!: Subscription;
  orders: Order[] = [];
  filter!: Filter;

  offset = 0;
  limit = STEP;

  loading = false;
  reloading = false;

  noMoreOrders = false;

  constructor(private ordersService: OrdersService) {}

  ngOnInit(): void {
    this.reloading = true;
    this.fetch();
  }

  private fetch(): void {
    const params = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit,
    });

    this.oSub = this.ordersService
      .fetch(params)
      .subscribe((orders: Order[]) => {
        if (orders.length < STEP) {
          this.noMoreOrders = true;
        }

        this.orders = this.orders.concat(orders);
        this.loading = false;
        this.reloading = false;
      });
  }

  ngOnDestroy(): void {
    this.tooltip.destroy();
    this.oSub.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initializeTooltip(this.tooltipRef);
  }

  loadMore(): void {
    this.loading = true;

    this.offset += STEP;
    this.fetch();
  }

  applyFilter(filter: Filter) {
    this.filter = filter;
    this.offset = 0;
    this.orders = [];
    this.reloading = true;

    this.fetch();
  }

  isFiltered(): boolean {
    if (!this.filter) return false;

    return Object.keys(this.filter).length !== 0;
  }
}
