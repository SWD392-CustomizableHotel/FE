import { Injectable } from '@angular/core';
import { environment } from '../../assets/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  // private socket: Socket;
  private wsImpl : any;
  public ws: any;
  public data?: string;

  constructor() {
    this.wsImpl = window.WebSocket;
    this.ws = new this.wsImpl(`${environment.SOCKET_WS}`);
    console.log(this.ws);

    // Connect successfully (Moco-chan is happy
    this.ws.onopen = () : void => {
      console.log('Connection establish !!!');
    };
  }

  public sendMessage(message: string): void {
    this.ws.send(message);
  }

  public receiveMessage(): void {
    this.ws.onmessage = (event: any): void => {
      console.log(event);
      this.data = event.data.split(' ')[2];
    };
  }
}