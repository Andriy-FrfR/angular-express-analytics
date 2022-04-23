import { Subscription } from 'rxjs';
import { OrdersService } from './../shared/services/orders.service';
import { Order, OrderPosition } from './../shared/interfaces';
import { OrderService } from './order.service';
import { MaterialInstance } from './../shared/classes/material.service';
import { NavigationEnd, Router } from '@angular/router';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-order',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService],
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('modal') modalRef!: ElementRef;
  modal!: MaterialInstance;
  isRoot = true;
  pending = false;
  oSub!: Subscription;

  constructor(
    private router: Router,
    public orderService: OrderService,
    private ordersService: OrdersService
  ) {}

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order';
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order';
      }
    });
  }

  ngOnDestroy(): void {
    this.modal.destroy();

    if (this.oSub) {
      this.oSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initializeModal(this.modalRef);
  }

  onOpenModal(): void {
    this.modal.open();
  }

  onCancel(): void {
    this.modal.close();
  }

  removePosition(position: OrderPosition) {
    this.orderService.remove(position);
  }

  onSubmit(): void {
    this.pending = true;

    const list = this.orderService.list.map((orderPosition: OrderPosition) => {
      delete orderPosition._id;
      return orderPosition;
    });

    const order: Order = { list };

    this.oSub = this.ordersService.create(order).subscribe(
      (newOrder: Order) => {
        MaterialService.toast(`Заказ №${newOrder.order} был добавлен.`);
        this.orderService.clear();
      },
      (error) => {
        MaterialService.toast(error.error.message);
      },
      () => {
        this.modal.close();
        this.pending = false;
      }
    );
  }
}
