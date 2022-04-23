import { Position, OrderPosition } from './../shared/interfaces';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderService {
  public list: OrderPosition[] = [];
  public price = 0;

  private computePrice() {
    this.price = this.list.reduce((total, position: OrderPosition) => {
      return total + position.cost * position.quantity;
    }, 0);
  }

  add(position: Position): void {
    const orderPosition: OrderPosition = Object.assign(
      {},
      {
        name: position.name,
        cost: position.cost,
        quantity: position.quantity || 1,
        _id: position._id,
      }
    );

    const candidate = this.list.find(
      (p: OrderPosition) => orderPosition._id === p._id
    );

    if (!candidate) {
      this.list.push(orderPosition);
    } else {
      candidate.quantity += orderPosition.quantity;
    }

    this.computePrice();
  }

  remove(position: OrderPosition): void {
    const idx = this.list.findIndex(
      (p: OrderPosition) => position._id === p._id
    );

    this.list.splice(idx, 1);

    this.computePrice();
  }

  clear(): void {
    this.list = [];
    this.price = 0;
  }
}
