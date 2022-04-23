import { MaterialService } from './../../classes/material.service';
import { AuthService } from './../../services/auth.service';
import { Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss'],
})
export class SiteLayoutComponent implements AfterViewInit {
  @ViewChild('floating') floatingRef!: ElementRef;

  links = [
    { url: '/overview', name: 'Обзор' },
    { url: '/analytics', name: 'Аналитика' },
    { url: '/history', name: 'История' },
    { url: '/order', name: 'Добавление заказа' },
    { url: '/categories', name: 'Ассортимент' },
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef);
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
