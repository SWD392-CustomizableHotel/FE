import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-progress-customizing',
  templateUrl: './progress-customizing.component.html',
  styleUrls: ['./progress-customizing.component.scss']
})
export class ProgressCustomizingComponent {
  @Input() isHideCustomizing: boolean = false;
  @Input() canAddFurniture!: (type: string) => boolean;
  @Input() getFurnitureCount!: (type: string) => number;
  @Output() furnitureSelected = new EventEmitter<string>();
  @Output() undoAction = new EventEmitter<void>();
  @Output() redoAction = new EventEmitter<void>();

  selectFurniture(type: string): void {
    this.furnitureSelected.emit(type);
  }

  undo(): void {
    this.undoAction.emit();
  }

  redo(): void {
    this.redoAction.emit();
  }
}
