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
  public sender = 'FE-S-' + Date.now();

  private chatService: ChatService;

  constructor(private http: HttpClient, chatService: ChatService) {
    // this.chatService = chatService;
    // this.chatService.connect(this.url);
  }

  ngOnInit(): void {
  }

  public addMessage(from, text, type: 'received' | 'sent', messageType): void {
    this.messages.push({from, text, messageType});
  }

  sendMessage(): void {
    if (this.text.replace(/\s/g, '').length) {
      this.addMessage('me', this.text.trim(), 'sent', 'text');
      // this.chatService.sendMessage(this.text);
      this.response = this.http.post<[{
        text: string
      }, { image: string }]>('http://vm07.htl-leonding.ac.at/core/webhooks/rest/webhook',
        {sender: this.sender, message: this.text.trim()}).subscribe(data => {
        // this.addMessage('bot', data[0].text, 'received');
        console.log(data);
        data.forEach(value => {
          for (const dataKey in value) {
            if (value.hasOwnProperty(dataKey)) {
              console.log(dataKey);
              if (dataKey !== 'recipient_id') {
                this.addMessage('bot', value[dataKey], 'received', dataKey);
              }
            }
          }
        });
      });
      this.text = '';
    }
  }
  sendMessageButton(text): void {
    if (text.replace(/\s/g, '').length) {
      this.addMessage('me', text.trim(), 'sent', 'text');
      // this.chatService.sendMessage(this.text);
      this.response = this.http.post<any>('http://vm07.htl-leonding.ac.at/core/webhooks/rest/webhook',
        {sender: this.sender, message: text.trim()}).subscribe(data => {
        data.forEach(value => {
          for (const dataKey in value) {
            if (value.hasOwnProperty(dataKey)) {
              if (dataKey !== 'recipient_id') {
                this.addMessage('bot', value[dataKey], 'received', dataKey);
              }
            }
          }
        });
      });
      this.text = '';
    }
  }

  enter($event: any): void {
    $event.preventDefault();
    this.sendMessage();
  }
}
