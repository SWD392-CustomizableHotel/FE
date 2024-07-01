import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-customizing-room',
  templateUrl: './customizing-room.component.html',
  styleUrls: ['./customizing-room.component.scss']
})
export class CustomizingRoomComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;
  ctx!: CanvasRenderingContext2D;
  selectedFurniture!: string;
  furnitureList: any[] = [];
  images: { [key: string]: HTMLImageElement } = {};

  ngOnInit(): void {
    if (this.canvas) {
      this.ctx = this.canvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
      this.loadImages().then(() => {
        this.draw();
        console.log('Canvas and images initialized');
      }).catch(err => console.error('Error loading images', err));
    } else {
      console.error('Canvas element not found');
    }
  }

  async loadImages(): Promise<void> {
    const imageNames = ['table', 'beds', 'closet', 'chair'];
    for (const name of imageNames) {
      this.images[name] = await this.loadImage(`assets/furniture/${name}.png`);
    }
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
    const size = this.getFurnitureSize(this.selectedFurniture);
    this.furnitureList.push({ x, y, size, type: this.selectedFurniture, angle: 0 });
    this.draw();
    console.log(`Added furniture at (${x}, ${y}) with size ${size}`);
  }

  getFurnitureSize(type: string): number {
    switch (type) {
      case 'small': return 50;
      case 'medium': return 100;
      case 'large': return 150;
      default: return 50;
    }
  }

  draw(): void {
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.furnitureList.forEach(furniture => {
        const img = this.images[furniture.type];
        if (img) {
          this.ctx.save();
          this.ctx.translate(furniture.x, furniture.y);
          this.ctx.rotate(furniture.angle * Math.PI / 180);
          this.ctx.drawImage(img, -furniture.size / 2, -furniture.size / 2, furniture.size, furniture.size);
          this.ctx.restore();
        }
      });
      console.log('Canvas drawn');
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (this.canvas) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      this.addFurniture(x, y);
    }
  }

  rotateFurniture(index: number, angle: number): void {
    this.furnitureList[index].angle += angle;
    this.draw();
    console.log(`Rotated furniture at index ${index} by ${angle} degrees`);
  }

  moveFurniture(index: number, dx: number, dy: number): void {
    this.furnitureList[index].x += dx;
    this.furnitureList[index].y += dy;
    this.draw();
  }

  findFurnitureIndex(x: number, y: number): number | null {
    for (let i = 0; i < this.furnitureList.length; i++) {
      const furniture = this.furnitureList[i];
      if (Math.abs(furniture.x - x) < furniture.size / 2 && Math.abs(furniture.y - y) < furniture.size / 2) {
        return i;
      }
    }
    return null;
  }

  onRotateButtonClick(event: MouseEvent, angle: number): void {
    if (this.canvas) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const index = this.findFurnitureIndex(x, y);
      if (index !== null) {
        this.rotateFurniture(index, angle);
      }
    }
  }
}
