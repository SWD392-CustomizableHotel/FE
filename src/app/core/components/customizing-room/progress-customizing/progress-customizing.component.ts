import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-progress-customizing',
  templateUrl: './progress-customizing.component.html',
  styleUrls: ['./progress-customizing.component.scss'],
  providers: [ConfirmationService],
})
export class ProgressCustomizingComponent {
  @Input() isHideCustomizing: boolean = false;
  @Input() canAddFurniture!: (type: string) => boolean;
  @Input() getFurnitureCount!: (type: string) => number;
  @Output() furnitureSelected = new EventEmitter<string>();
  @Output() undoAction = new EventEmitter<void>();
  @Output() redoAction = new EventEmitter<void>();
  @Output() changeProgressIndex = new EventEmitter<number>();
  loading: boolean = false;

  constructor(private confirmationService: ConfirmationService) {}

  selectFurniture(type: string): void {
    this.furnitureSelected.emit(type);
  }

  undo(): void {
    this.undoAction.emit();
  }

  redo(): void {
    this.redoAction.emit();
  }

  next(index: number): void {
    if (
      this.canAddFurniture('chair') ||
      this.canAddFurniture('table') ||
      this.canAddFurniture('closet') ||
      this.canAddFurniture('beds')
    ) {
      this.confirmationService.confirm({
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        message:
          'You have not used all the furniture. Are you sure you want to proceed?',
        accept: () => {
          this.changeProgressIndex.emit(index);
          this.loading = true;
        },
      });
    } else {
      this.confirmationService.confirm({
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        acceptIcon: 'none',
        rejectIcon: 'none',
        rejectButtonStyleClass: 'p-button-text',
        message:
          'You will not able to edit your room again. Are you sure you want to go to payment?',
        accept: () => {
          this.changeProgressIndex.emit(index);
          this.loading = true;
        },
      });
    }
  }

  back(index: number): void {
    this.changeProgressIndex.emit(index);
    window.scrollTo({
      top: 40,
      left: 0,
      behavior: 'smooth',
    });
  }
}
