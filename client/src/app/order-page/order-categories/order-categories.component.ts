import { CategoriesService } from './../../shared/services/categories.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-order-categories',
  templateUrl: './order-categories.component.html',
  styleUrls: ['./order-categories.component.scss'],
})
export class OrderCategoriesComponent implements OnInit {
  constructor(private categoriesService: CategoriesService) {}

  categories$!: Observable<Category[]>;

  ngOnInit(): void {
    this.categories$ = this.categoriesService.fetch();
  }
}
