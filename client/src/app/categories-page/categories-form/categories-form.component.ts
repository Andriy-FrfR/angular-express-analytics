import { MaterialService } from './../../shared/classes/material.service';
import { Category } from './../../shared/interfaces';
import { CategoriesService } from './../../shared/services/categories.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss'],
})
export class CategoriesFormComponent implements OnInit {
  @ViewChild('input') inputRef!: ElementRef;
  isNew = true;
  image!: File;
  imagePreview: any;
  form!: FormGroup;
  category!: Category;

  constructor(
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
    });

    this.form.disable();

    this.route.params
      .pipe(
        switchMap((params: Params) => {
          if (params['id']) {
            this.isNew = false;

            return this.categoriesService.getById(params['id']);
          }

          return of(null);
        })
      )
      .subscribe(
        (category: Category | null) => {
          if (category) {
            this.category = category;
            this.form.patchValue({ name: category.name });
            this.imagePreview = category.imageSrc;
            MaterialService.updateTextInputs();
          }

          this.form.enable();
        },
        (error) => {
          MaterialService.toast(error.error.message);
        }
      );
  }

  triggerClick(): void {
    this.inputRef.nativeElement.click();
  }

  onFileUpload(event: any): void {
    const file = event.target.files[0];
    this.image = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result;
    };

    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.form.disable();

    let obs$;

    if (this.isNew) {
      obs$ = this.categoriesService.create(this.form.value.name, this.image);
    } else {
      obs$ = this.categoriesService.update(
        this.category._id || '',
        this.form.value.name,
        this.image
      );
    }

    obs$.subscribe(
      (category: Category) => {
        this.category = category;
        MaterialService.toast('?????????????????? ??????????????????');
        this.form.enable();
      },
      (error) => {
        MaterialService.toast(error.error.message);
        this.form.enable();
      }
    );
  }

  onDelete(): void {
    const decision = confirm(
      `???? ??????????????, ?????? ???????????? ?????????????? ?????????????????? ${this.category.name}`
    );

    if (!decision) {
      return;
    }

    this.categoriesService.delete(this.category._id).subscribe(
      (message: { message: string }) => MaterialService.toast(message.message),
      (error) => MaterialService.toast(error.error.message),
      () => this.router.navigate(['/categories'])
    );
  }
}
