import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customizing-room',
  templateUrl: './customizing-room.component.html',
  styleUrl: './customizing-room.component.scss'
})
export class CustomizingRoomComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D | null;
  selectedFurniture!: string;
  furnitureList: any[] = [];

  ngOnInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.draw();
  }

  selectFurniture(type: string): void {
    this.selectedFurniture = type;
  }

  addFurniture(x: number, y: number): void {
    const size = this.getFurnitureSize(this.selectedFurniture);
    this.furnitureList.push({ x, y, size, angle: 0 });
    this.draw();
  }

  getFurnitureSize(type: string): number {
    switch (type) {
      case 'small': return 20;
      case 'medium': return 40;
      case 'large': return 60;
      default: return 20;
    }
  }

  draw(): void {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.furnitureList.forEach(furniture => {
      this.ctx.save();
      this.ctx.translate(furniture.x, furniture.y);
      this.ctx.rotate(furniture.angle * Math.PI / 180);
      this.ctx.fillRect(-furniture.size / 2, -furniture.size / 2, furniture.size, furniture.size);
      this.ctx.restore();
    });
  }

  onMouseDown(event: MouseEvent): void {
    const rect = this.canvas.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.addFurniture(x, y);
  }

  rotateFurniture(index: number, angle: number): void {
    this.furnitureList[index].angle += angle;
    this.draw();
  }

  moveFurniture(index: number, dx: number, dy: number): void {
    this.furnitureList[index].x += dx;
    this.furnitureList[index].y += dy;
    this.draw();
  }
}
