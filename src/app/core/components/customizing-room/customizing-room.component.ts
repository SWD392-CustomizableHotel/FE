import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-customizing-room',
  templateUrl: './customizing-room.component.html',
  styleUrls: ['./customizing-room.component.scss'],
  providers: [MessageService],
})
export class CustomizingRoomComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  selectedFurniture?: string;
  furnitureList: any[] = [];
  images: { [key: string]: HTMLImageElement } = {};
  scale: number = 0.8;
  canvasWidth: number = 800;
  canvasHeight: number = 600;
  undoStack: any[][] = [];
  redoStack: any[][] = [];
  selectedObjectIndex: number | null = null;
  isDragging: boolean = false;
  lastX: number = 0;
  lastY: number = 0;
  blueprintImage = new Image();
  blueprintX: number = 0;
  blueprintY: number = 0;
  blueprintWidth: number = 435;
  blueprintHeight: number = 677;

  isHideCustomizing: boolean = true;
  steps: MenuItem[] | undefined;
  activeIndex: number = 0;

  limits: any;
  roomSize!: string;
  amenities = {
    basic: { chair: 2, beds: 1, closet: 1, table: 1 },
    advanced: { chair: 4, beds: 2, closet: 1, table: 2 },
    family: { chair: 6, beds: 3, closet: 2, table: 2 },
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.limits = this.amenities.basic;
    this.roomSize = 'Small';

    this.steps = [
      {
        label: 'Information',
        command: (): void => this.onActiveIndexChange(0),
      },
      {
        label: 'Customizing',
        command: (): void => this.onActiveIndexChange(1),
      },
      { label: 'Export', command: (): void => this.onActiveIndexChange(2) },
      { label: 'Payment', command: (): void => this.onActiveIndexChange(3) },
    ];
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext(
        '2d'
      ) as CanvasRenderingContext2D;
      this.loadImages()
        .then(() => {
          this.blueprintImage.src = 'assets/furniture/hotelroom-blueprint.png';
          this.blueprintImage.onload = (): void => {
            this.saveState();
            this.draw();
          };
        })
        .catch((err) => console.error('Error loading images', err));
    } else {
      console.error('Canvas element not found');
    }
  }
  setLimitsAmenities(value: string): void {
    this.furnitureList = [];
    if (value === 'basic') {
      this.limits = this.amenities.basic;
    } else if (value === 'family') {
      this.limits = this.amenities.family;
    } else if (value === 'advanced') {
      this.limits = this.amenities.advanced;
    }
  }

  setRoomSize(size: string): void {
    this.furnitureList = [];
    if (size === 'small') {
      this.roomSize = 'Small';
    } else if (size === 'medium') {
      this.roomSize = 'Medium';
    } else {
      this.roomSize = 'Large';
    }
  }

  onActiveIndexChange(index: number): void {
    console.log(index);
    this.activeIndex = index;
    this.isHideCustomizing = index !== 1 && index !== 2;
  }

  async loadImages(): Promise<void> {
    const imageNames = ['table', 'beds', 'closet', 'chair'];
    for (const name of imageNames) {
      this.images[name] = await this.loadImage(`assets/furniture/${name}.png`);
    }
    this.blueprintImage = await this.loadImage(
      'assets/furniture/hotelroom-blueprint.png'
    );
  }

  loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = (): void => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  selectFurniture(type: string): void {
    this.selectedFurniture = type;
    console.log(`Selected furniture: ${type}`);
  }

  addFurniture(x: number, y: number): void {
    if (!this.selectedFurniture) return;
    const size = this.getFurnitureSize(this.selectedFurniture);
    if (this.isInsideBlueprint(x, y, size) && !this.isOverlapping(x, y, size)) {
      this.furnitureList.push({ x, y, size, type: this.selectedFurniture });
      this.saveState();
      this.draw();
    } else {
      this.messageService.add({
        key: '1',
        severity: 'error',
        summary: 'Error',
        detail:
          'You cannot place your furniture outside the room or at the same position with other furniture',
      });
    }
  }

  canAddFurniture(type: string): boolean {
    return this.getFurnitureCount(type) < this.limits[type];
  }

  getFurnitureCount(type: string): number {
    return this.furnitureList.filter((f) => f.type === type).length;
  }

  getFurnitureSize(type: string): number {
    if (this.roomSize === 'Small') {
      switch (type) {
        case 'table':
          return 100;
        case 'beds':
          return 150;
        case 'closet':
          return 100;
        case 'chair':
          return 50;
        default:
          return 50;
      }
    } else if (this.roomSize === 'Medium') {
      switch (type) {
        case 'table':
          return 90;
        case 'beds':
          return 140;
        case 'closet':
          return 90;
        case 'chair':
          return 40;
        default:
          return 40;
      }
    } else {
      switch (type) {
        case 'table':
          return 80;
        case 'beds':
          return 130;
        case 'closet':
          return 80;
        case 'chair':
          return 30;
        default:
          return 30;
      }
    }
  }

  saveState(): void {
    this.undoStack.push(JSON.parse(JSON.stringify(this.furnitureList)));
    if (this.undoStack.length > 10) this.undoStack.shift();
    this.redoStack = [];
  }

  undo(): void {
    if (this.undoStack.length > 1) {
      this.redoStack.push(this.undoStack.pop()!);
      this.furnitureList = JSON.parse(
        JSON.stringify(this.undoStack[this.undoStack.length - 1])
      );
      this.draw();
    }
  }

  redo(): void {
    if (this.redoStack.length > 0) {
      this.undoStack.push(this.redoStack.pop()!);
      this.furnitureList = JSON.parse(
        JSON.stringify(this.undoStack[this.undoStack.length - 1])
      );
      this.draw();
    }
  }

  isOverlapping(
    newX: number,
    newY: number,
    size: number,
    ignoreIndex: number | null = null
  ): boolean {
    for (let i = 0; i < this.furnitureList.length; i++) {
      if (ignoreIndex !== null && i === ignoreIndex) continue;
      const furniture = this.furnitureList[i];
      const distance = Math.hypot(furniture.x - newX, furniture.y - newY);
      if (distance < (furniture.size + size) / 2) {
        return true;
      }
    }
    return false;
  }

  draw(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(
        0,
        0,
        this.canvas.nativeElement.width,
        this.canvas.nativeElement.height
      );
      this.ctx.save();
      this.ctx.scale(this.scale, this.scale);

      // Draw grid
      this.drawGrid();

      // Draw blueprint image
      this.drawBlueprintImage();

      // Draw furniture
      this.furnitureList.forEach((furniture, index) => {
        const img = this.images[furniture.type];
        if (img) {
          this.ctx.save();
          this.ctx.translate(furniture.x, furniture.y);
          if (this.selectedObjectIndex === index) {
            this.ctx.strokeStyle = 'lightgreen';
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(
              -furniture.size / 2,
              -furniture.size / 2,
              furniture.size,
              furniture.size
            );
          }
          this.ctx.drawImage(
            img,
            -furniture.size / 2,
            -furniture.size / 2,
            furniture.size,
            furniture.size
          );
          this.ctx.restore();
        }
      });

      this.ctx.restore();
    }
  }

  drawGrid(): void {
    if (this.ctx && this.canvas) {
      const { width, height } = this.canvas.nativeElement;
      const gridSize = 20;

      this.ctx.strokeStyle = '#ddd';
      this.ctx.lineWidth = 0.5;

      for (let x = 0; x <= width; x += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(x, 0);
        this.ctx.lineTo(x, height);
        this.ctx.stroke();
      }

      for (let y = 0; y <= height; y += gridSize) {
        this.ctx.beginPath();
        this.ctx.moveTo(0, y);
        this.ctx.lineTo(width, y);
        this.ctx.stroke();
      }
    }
  }

  drawBlueprintImage(): void {
    if (this.ctx && this.canvas) {
      const { width, height } = this.canvas.nativeElement;
      const imgWidth = this.blueprintImage.width;
      const imgHeight = this.blueprintImage.height;
      const scaledWidth = imgWidth * this.scale;
      const scaledHeight = imgHeight * this.scale;
      this.blueprintX = (width - scaledWidth) / 2 / this.scale;
      this.blueprintY = (height - scaledHeight) / 2 / this.scale;

      this.ctx.drawImage(
        this.blueprintImage,
        this.blueprintX,
        this.blueprintY,
        imgWidth,
        imgHeight
      );
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.canvas) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / this.scale;
      const y = (event.clientY - rect.top) / this.scale;

      // If furniture is selected, add it to the canvas
      if (this.selectedFurniture) {
        this.addFurniture(x, y);
        this.selectedFurniture = undefined; // Clear selection after adding
        return;
      }

      const index = this.findFurnitureIndex(x, y);
      if (index !== null) {
        this.selectedObjectIndex = index;
        this.isDragging = true;
        this.lastX = x;
        this.lastY = y;
      } else {
        this.selectedObjectIndex = null;
      }
      this.draw();
    }
  }
  findFurnitureIndex(x: number, y: number): number | null {
    for (let i = 0; i < this.furnitureList.length; i++) {
      const furniture = this.furnitureList[i];
      if (
        Math.abs(furniture.x - x) < furniture.size / 2 &&
        Math.abs(furniture.y - y) < furniture.size / 2
      ) {
        return i;
      }
    }
    return null;
  }

  moveFurniture(index: number, dx: number, dy: number): void {
    const newX = this.furnitureList[index].x + dx / this.scale;
    const newY = this.furnitureList[index].y + dy / this.scale;
    const size = this.furnitureList[index].size;

    if (
      this.isInsideBlueprint(newX, newY, this.furnitureList[index].size) &&
      !this.isOverlapping(newX, newY, size, index)
    ) {
      this.furnitureList[index].x = newX;
      this.furnitureList[index].y = newY;
      this.draw();
    } else {
      this.messageService.clear();
      this.messageService.add({
        key: '1',
        severity: 'error',
        summary: 'Invalid',
        detail:
          'You cannot move your furniture outside the room or same position with furniture',
      });
    }
  }

  onMouseMove(event: MouseEvent): void {
    if (this.isDragging && this.selectedObjectIndex !== null) {
      const rect = this.canvas!.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / this.scale;
      const y = (event.clientY - rect.top) / this.scale;
      const dx = x - this.lastX;
      const dy = y - this.lastY;
      this.moveFurniture(this.selectedObjectIndex, dx, dy);
      this.lastX = x;
      this.lastY = y;
    }
  }

  onMouseUp(): void {
    this.isDragging = false;
    this.saveState();
  }

  isInsideBlueprint(x: number, y: number, size: number): boolean {
    return (
      x - size / 2 >= this.blueprintX &&
      x + size / 2 <= this.blueprintX + this.blueprintWidth &&
      y - size / 2 >= this.blueprintY &&
      y + size / 2 <= this.blueprintY + this.blueprintHeight
    );
  }

  handleClick(event: MouseEvent): void {
    const rect = this.canvas!.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.addFurniture(x, y);
  }
}
