import {Component, OnInit} from '@angular/core';
import {ChatService} from '../chatbot-rasa.service';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  text: any;
  public url = 'http://localhost:5005';
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
        setTimeout(() => {
          this.addMessage('bot', message.text, 'received');
        }, 1000);
      });
  }

  public addMessage(from, text, type: 'received' | 'sent'): void {
    this.messages.push({from, text});
  }

  sendMessage(): void {
    if (this.text.replace(/\s/g, '').length) {
      this.addMessage('me', this.text.trim(), 'sent');
      // this.chatService.sendMessage(this.text);
      this.response = this.http.post<[{
        text: string
      }, { image: string }]>('http://localhost:5005/webhooks/rest/webhook',
        {sender: 'me', message: this.text.trim()}).subscribe(data => {
        this.addMessage('bot', data[0].text, 'received');
        if (data[1].image) {
          this.addMessage('bot', '<img src="' + data[1].image + '">', 'received');
        }
      });
      this.text = '';
    }
  }

  enter($event: any): void {
    $event.preventDefault();
    this.sendMessage();
  }
}
