import {
  MaterialInstance,
  MaterialService,
} from './../../shared/classes/material.service';
import { OrderPosition } from './../../shared/interfaces';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnDestroy,
  AfterViewInit,
} from '@angular/core';
import { Order } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html',
  styleUrls: ['./history-list.component.scss'],
})
export class HistoryListComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef;
  @Input('orders') orders: Order[] = [];
  modal!: MaterialInstance;
  activeOrder!: Order;

  constructor() {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  ngAfterViewInit(): void {
    this.modal = this.modal = MaterialService.initializeModal(this.modalRef);
  }

  computePrice(order: Order): number {
    return order.list.reduce((total, position: OrderPosition) => {
      return total + position.cost * position.quantity;
    }, 0);
  }

  openModal(order: Order) {
    this.activeOrder = order;
    this.modal.open();
  }

  closeModal() {
    this.modal.close();
  }
}
