import { FormGroup, FormControl, Validators } from '@angular/forms';
import {
  MaterialInstance,
  MaterialService,
} from './../../../shared/classes/material.service';
import { Message, Position } from './../../../shared/interfaces';
import { PositionsService } from './../../../shared/services/positions.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';

@Component({
  selector: 'app-positions-form',
  templateUrl: './positions-form.component.html',
  styleUrls: ['./positions-form.component.scss'],
})
export class PositionsFormComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @ViewChild('modal') modalRef!: ElementRef;
  @Input('categoryId') categoryId!: string;
  positions: Position[] = [];
  positionId: string | null = null;
  loading = false;
  modal!: MaterialInstance;
  form!: FormGroup;

  constructor(private positionsService: PositionsService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required, Validators.min(1)]),
    });

    this.loading = true;
    this.positionsService
      .fetch(this.categoryId)
      .subscribe((positions: Position[]) => {
        this.positions = positions;
        this.loading = false;
      });
  }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initializeModal(this.modalRef);
  }

  ngOnDestroy(): void {
    this.modal.destroy();
  }

  onSelectPosition(position: Position): void {
    this.positionId = position._id || '';
    this.form.patchValue({
      name: position.name,
      cost: position.cost,
    });
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onAddPosition(): void {
    this.positionId = null;
    this.form.reset();
    this.modal.open();
    MaterialService.updateTextInputs();
  }

  onDeletePosition(event: Event, position: Position): void {
    event.stopPropagation();

    const decision = confirm(`Удалить позицию ${position.name} ?`);

    if (!decision) return;

    this.positionsService.delete(position._id || '').subscribe(
      (message: Message) => {
        const positionIdx = this.positions.findIndex(
          (pos: Position) => pos._id === position._id
        );

        this.positions.splice(positionIdx, 1);

        MaterialService.toast(message.message);
      },
      (error) => MaterialService.toast(error.error.message)
    );
  }

  onCancel(): void {
    this.modal.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      return;
    }

    this.form.disable();

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId,
    };

    const completed = () => {
      this.modal.close();
      this.form.enable();
    };

    if (this.positionId) {
      newPosition._id = this.positionId;
      this.positionsService.update(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast('Позиция изменена');

          const positionIdx = this.positions.findIndex(
            (pos: Position) => pos._id === position._id
          );

          this.positions[positionIdx] = position;
        },
        (error) => MaterialService.toast(error.error.message),
        completed
      );
    } else {
      this.positionsService.create(newPosition).subscribe(
        (position: Position) => {
          MaterialService.toast('Позиция создана');
          this.positions.push(position);
        },
        (error) => MaterialService.toast(error.error.message),
        completed
      );
    }
  }
}
