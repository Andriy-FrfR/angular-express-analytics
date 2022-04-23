import { MaterialService } from './../shared/classes/material.service';
import { Observable } from 'rxjs';
import { AnalyticsService } from './../shared/services/analytics.service';
import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import { OverviewPage } from '../shared/interfaces';
import { MaterialInstance } from '../shared/classes/material.service';

@Component({
  selector: 'app-overview-page',
  templateUrl: './overview-page.component.html',
  styleUrls: ['./overview-page.component.scss'],
})
export class OverviewPageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('tapTarget') tapTargetRef!: ElementRef;
  overview$!: Observable<OverviewPage>;
  tapTarget!: MaterialInstance;

  yesterday = new Date();

  constructor(private analyticsService: AnalyticsService) {}

  ngOnInit(): void {
    this.overview$ = this.analyticsService.getOverview();

    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  ngOnDestroy(): void {
    this.tapTarget.close();
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initializeTapTarget(this.tapTargetRef);
  }

  openInfo(): void {
    this.tapTarget.open();
  }
}
