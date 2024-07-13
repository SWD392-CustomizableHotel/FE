import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: Socket;

  constructor() {
    this.socket = io(`${environment.SOCKET_WS}`, {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: Infinity,
        transports: ['websocket'] }
    );
  }

  public sendMessage(message: string): void {
    this.socket.emit('message', message);
  }

  public receiveMessage(): void {
    this.socket.on('message', (message) => {
      console.log('Received message from server:', message);
    });
  }
  public on(event: string, callback: (data: any) => void): void {
    this.socket.on(event, callback);
  }

  public emit(event: string, data: any): void {
    this.socket.emit(event, data);
  }
}