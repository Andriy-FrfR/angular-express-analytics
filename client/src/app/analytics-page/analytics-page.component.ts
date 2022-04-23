import { Chart } from 'chart.js';
import { Subscription } from 'rxjs';
import { AnalyticsPage } from './../shared/interfaces';
import { AnalyticsService } from './../shared/services/analytics.service';
import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss'],
})
export class AnalyticsPageComponent implements OnDestroy, AfterViewInit {
  @ViewChild('gain') gainRef!: ElementRef;
  @ViewChild('order') orderRef!: ElementRef;

  average!: number;
  pending = true;

  aSub!: Subscription;

  constructor(private analyticsService: AnalyticsService) {}

  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe();
    }
  }

  ngAfterViewInit(): void {
    const gainConfig: any = { label: 'Выручка', color: 'rgb(255, 99, 132)' };
    const orderConfig: any = { label: 'Заказы', color: 'rgb(54, 162, 235)' };

    this.aSub = this.analyticsService
      .getAnalytics()
      .subscribe((analytics: AnalyticsPage) => {
        this.average = analytics.average;

        gainConfig.labels = analytics.chart.map((item) => item.label);
        gainConfig.data = analytics.chart.map((item) => item.gain);

        const gainCtx = this.gainRef.nativeElement.getContext('2d');
        gainCtx.canvas.height = '300px';
        new Chart(gainCtx, createChartConfig(gainConfig));

        orderConfig.labels = analytics.chart.map((item) => item.label);
        orderConfig.data = analytics.chart.map((item) => item.order);

        const orderCtx = this.orderRef.nativeElement.getContext('2d');
        orderCtx.canvas.height = '300px';
        new Chart(orderCtx, createChartConfig(orderConfig));

        this.pending = false;
      });
  }
}

function createChartConfig({ labels, data, label, color }: any): any {
  return {
    type: 'line',
    options: {
      responsive: true,
    },
    data: {
      labels,
      datasets: [
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false,
        },
      ],
    },
  };
}
