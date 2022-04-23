import { MaterialService } from './../../shared/classes/material.service';
import { OrderService } from './../order.service';
import { map, Observable, switchMap } from 'rxjs';
import { Position } from './../../shared/interfaces';
import { PositionsService } from './../../shared/services/positions.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss'],
})
export class OrderPositionsComponent implements OnInit {
  positions$!: Observable<Position[]>;

  constructor(
    private route: ActivatedRoute,
    private positionsService: PositionsService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.positions$ = this.positionsService.fetch(params['id']).pipe(
        map((positions: Position[]) => {
          return positions.map((position: Position) => {
            position.quantity = 1;
            return position;
          });
        })
      );
    });
  }

  addToOrder(position: Position): void {
    this.orderService.add(position);
    MaterialService.toast(`Добавлено ${position.quantity}`);
  }
}
