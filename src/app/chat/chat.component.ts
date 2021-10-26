import { Component, OnInit } from '@angular/core';
import {ChatService} from '../chatbot-rasa.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  text: any;
  public url = 'http://localhost:5002';
  public operator;
  public messages = [];
  public response: any;

  private chatService: ChatService;

  constructor(private http: HttpClient, chatService: ChatService) {
    // this.chatService = chatService;
   // this.chatService.connect(this.url);
  }

  ngOnInit(): void {
    this.chatService
      .getMessages()
      .subscribe((message) => {
        setTimeout(() => {this.addMessage('bot', message.text, 'received'); }, 1000);
      });
  }

  public addMessage(from, text, type: 'received' | 'sent'): void {
    this.messages.push({from, text});
  }
  sendMessage(): void {
    this.addMessage('me', this.text, 'sent');
    // this.chatService.sendMessage(this.text);
    this.response = this.http.post<[{text: string}]>('http://localhost:5002/webhooks/rest/webhook',
      {sender: 'me', message: this.text}).subscribe(data => {
      this.addMessage('bot', data[0].text, 'received');
    });
  }
}
