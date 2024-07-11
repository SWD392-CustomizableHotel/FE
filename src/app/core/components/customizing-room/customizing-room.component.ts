import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { ContextMenu } from 'primeng/contextmenu';
import { Room } from '../../../interfaces/models/room';
import { DatePipe } from '@angular/common';
import { CustomizeRequest } from '../../../interfaces/models/customize-request';
import { CustomizingRoomService } from '../../../services/customizing-room.service';
import { Amenity } from '../../../interfaces/models/amenity';
import { CustomizeDataService } from '../../../services/customize-data.service';

@Component({
  selector: 'app-customizing-room',
  templateUrl: './customizing-room.component.html',
  styleUrls: ['./customizing-room.component.scss'],
  providers: [MessageService, DatePipe],
})
export class CustomizingRoomComponent implements OnInit {
  @ViewChild('canvas', { static: true }) canvas?: ElementRef<HTMLCanvasElement>;
  @ViewChild('cm') cm!: ContextMenu;

  selectedRoom!: Room;
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
  night: string = '';
  day: string = '';
  roomPriceSubtotal: number = 0;
  totalPrice: number = 0;

  limits: any;
  roomSize!: string;
  amenities = {
    basic: { chair: 2, beds: 1, closet: 1, table: 1 },
    advanced: { chair: 4, beds: 2, closet: 1, table: 2 },
    family: { chair: 6, beds: 3, closet: 2, table: 2 },
  };

  contextMenuItems: MenuItem[] = [];
  warningMessage!: Message[];
  dateRange!: Date[];
  checkInDate: string | null = '';
  checkOutDate: string | null = '';
  customizeRequest!: CustomizeRequest;
  amenityType!: string;
  amenity!: Amenity;
  roomCode!: string;
  room!: Room;

  constructor(
    private messageService: MessageService,
    private datePipe: DatePipe,
    private customizeService: CustomizingRoomService,
    private customizeDataService: CustomizeDataService
  ) {
    this.contextMenuItems = [
      {
        label: 'Delete',
        icon: 'pi pi-times',
        command: (): void => this.deleteFurniture(),
      },
      {
        label: 'Change Color',
        icon: 'pi pi-palette',
        items: [
          {
            label: 'Brown',
            command: (): void => this.changeColor('brown'),
          },
          {
            label: 'Red',
            command: (): void => this.changeColor('red'),
          },
          {
            label: 'White',
            command: (): void => this.changeColor('white'),
          },
        ],
      },
      {
        label: 'Export',
        icon: 'pi pi-print',
        command: (): void => this.downloadCanvasAsImage(),
      },
    ];
  }

  ngOnInit(): void {
    window.scrollTo({
      top: 40,
      left: 0,
      behavior: 'smooth',
    });
    this.limits = this.amenities.basic;
    this.roomSize = 'Small';
    this.warningMessage = [
      {
        severity: 'warn',
        summary: 'You will not able to edit your room after submit this.',
      },
    ];
    this.steps = [
      {
        label: 'Information',
        command: (): void => this.onActiveIndexChange(0),
      },
      {
        label: 'Customizing',
        command: (): void => this.onActiveIndexChange(1),
      },
      { label: 'Payment', command: (): void => this.onActiveIndexChange(2) },
      { label: 'Export', command: (): void => this.onActiveIndexChange(3) },
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

  handleRoomSelection(room: Room): void {
    this.selectedRoom = room;
  }

  handleDateRange(value: Date[]): void {
    this.dateRange = value;
    this.customizeDataService.setDateRange(value);
    this.checkInDate = this.datePipe.transform(this.dateRange[0], 'dd/MM/yyyy');
    this.checkOutDate = this.datePipe.transform(
      this.dateRange[1],
      'dd/MM/yyyy'
    );
    if (this.dateRange[0] && this.dateRange[1]) {
      const timeDifference =
        this.dateRange[1].getTime() - this.dateRange[0].getTime();
      const daysDifference = timeDifference / (1000 * 3600 * 24);
      this.night = daysDifference.toPrecision(1);
      this.day = (daysDifference + 1).toPrecision(1);
      return;
    }
    this.night = '1';
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    if (this.canvas && this.selectedObjectIndex !== null) {
      const rect = this.canvas.nativeElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / this.scale;
      const y = (event.clientY - rect.top) / this.scale;
      const index = this.findFurnitureIndex(x, y);
      if (index !== null) {
        this.selectedObjectIndex = index;
        if (this.cm) {
          this.cm.show(event);
        }
      } else {
        this.selectedObjectIndex = null;
      }
    }
  }

  onHide(): void {
    this.selectedObjectIndex = null;
  }

  deleteFurniture(): void {
    if (this.selectedObjectIndex !== null) {
      this.furnitureList.splice(this.selectedObjectIndex, 1);
      this.selectedObjectIndex = null;
      this.saveState();
      this.draw();
    }
  }

  changeColor(color: string): void {
    if (this.selectedObjectIndex !== null) {
      if (color === 'white') {
        this.furnitureList[this.selectedObjectIndex].color = 'gray';
        this.saveState();
        this.draw();
        return;
      }
      this.furnitureList[this.selectedObjectIndex].color = color;
      this.saveState();
      this.draw();
    }
  }

  setLimitsAmenities(value: string): void {
    this.furnitureList = [];
    this.draw();
    if (value === 'basic') {
      this.limits = this.amenities.basic;
      this.amenityType = value;
    } else if (value === 'family') {
      this.limits = this.amenities.family;
      this.amenityType = value;
    } else if (value === 'advanced') {
      this.limits = this.amenities.advanced;
      this.amenityType = value;
    }
  }

  setRoomSize(size: string): void {
    this.furnitureList = [];
    this.draw();
    if (size === 'small') {
      this.roomSize = 'Small';
    } else if (size === 'medium') {
      this.roomSize = 'Medium';
    } else {
      this.roomSize = 'Large';
    }
  }

  onActiveIndexChange(index: number): void {
    if (index === 1) {
      this.customizeService.getAmenityByType(this.amenityType).subscribe({
        next: (response) => {
          if (response.isSucceed) {
            this.amenity = response.results?.at(0) as Amenity;
            // Tính theo đêm * giá tiền
            const night: number = +this.night;
            this.roomPriceSubtotal =
              (this.selectedRoom.price as number) * night;
            if (this.amenity.price) {
              this.totalPrice = this.roomPriceSubtotal + this.amenity.price;
            }
            this.customizeRequest = {
              amenityId: this.amenity.id!,
              amenityPrice: this.amenity.price!,
              roomId: this.selectedRoom.id!.toString(),
              roomPrice: this.selectedRoom.price!,
              numberOfDay: night,
              numberOfRoom: this.customizeDataService.getNumberOfRooms(),
            };
            this.customizeDataService.setCustomizeRequest(
              this.customizeRequest
            );
          } else {
            this.activeIndex = 0;
          }
        },
      });
    }
    if (index === 2) {
      // Tạo blob canvas
      const canvas: HTMLCanvasElement = document.getElementById(
        'canvas'
      ) as HTMLCanvasElement;
      this.exportCanvasToBlob(canvas).then((s) => {
        this.customizeDataService.setCanvasBlobImage(s!);
      });
    }
    this.activeIndex = index;
    this.isHideCustomizing = index !== 1;
  }

  async exportCanvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          canvas.toBlob((blob) => {
            resolve(blob);
          }, 'image/png');
        }, 3000);
      });
    });
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
  }

  addFurniture(x: number, y: number): void {
    if (!this.selectedFurniture) return;
    const size = this.getFurnitureSize(this.selectedFurniture);
    if (this.isInsideBlueprint(x, y, size) && !this.isOverlapping(x, y, size)) {
      this.furnitureList.push({
        x,
        y,
        size,
        type: this.selectedFurniture,
        color: 'gray',
      });
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
    if (this.undoStack.length > 20) this.undoStack.shift();
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
          // Create an off-screen canvas
          const offScreenCanvas = document.createElement('canvas');
          offScreenCanvas.width = img.width;
          offScreenCanvas.height = img.height;
          const offScreenCtx = offScreenCanvas.getContext('2d');

          if (offScreenCtx) {
            // Draw the furniture image onto the off-screen canvas
            offScreenCtx.drawImage(img, 0, 0, img.width, img.height);

            // Change the composite operation to source-in to keep only the image
            offScreenCtx.globalCompositeOperation = 'source-in';

            // Fill the off-screen canvas with the color
            offScreenCtx.fillStyle = furniture.color || 'gray';
            offScreenCtx.fillRect(0, 0, img.width, img.height);

            this.ctx.save();
            this.ctx.translate(furniture.x, furniture.y);
            this.ctx.drawImage(
              offScreenCanvas,
              -furniture.size / 2,
              -furniture.size / 2,
              furniture.size,
              furniture.size
            );

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
            this.ctx.restore();
          }
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
      y + size / 2 <= this.blueprintY + (this.blueprintHeight - 228)
    );
  }

  handleClick(event: MouseEvent): void {
    const rect = this.canvas!.nativeElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    this.addFurniture(x, y);
  }

  downloadCanvasAsImage(): void {
    if (this.canvas) {
      this.canvas.nativeElement.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'customized-room.png';
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');
    }
  }

  getCustomizeRequest(): CustomizeRequest {
    return this.customizeRequest;
  }
}
