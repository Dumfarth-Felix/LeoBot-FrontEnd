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
  private time = 0;
  public display ;
  private interval;
  private minutes: number;
  public seconds = 0;
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
      this.pauseTimer();
      this.startTimer();
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
                if (dataKey === 'text'){
                  if (value[dataKey] === 'Tschüss'){
                    this.reload();
                  }
                }
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
      this.pauseTimer();
      this.startTimer();
      this.addMessage('me', text.trim(), 'sent', 'text');
      // this.chatService.sendMessage(this.text);
      this.response = this.http.post<any>('http://vm07.htl-leonding.ac.at/core/webhooks/rest/webhook',
        {sender: this.sender, message: text.trim()}).subscribe(data => {
        data.forEach(value => {
          for (const dataKey in value) {
            if (value.hasOwnProperty(dataKey)) {
              if (dataKey !== 'recipient_id') {
                this.addMessage('bot', value[dataKey], 'received', dataKey);
                if (dataKey === 'text'){
                  if (value[dataKey] === 'Tschüss'){
                    this.reload();
                  }
                }
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

  startTimer(): void {
    console.log('=====>');
    this.interval = setInterval(() => {
      if (this.time === 0) {
        this.time++;
      } else {
        this.time++;
      }
      this.display = this.transform( this.time);
      if (this.seconds === 30){
        this.addMessage('bot', 'Hey, du hast schon seit 30 Sekunden nichts mehr geschrieben, in 30s werde ich unsre Unterhaltung löschen.', 'received', 'text');
      }
      if (this.minutes === 1){
        this.reload();
      }
    }, 1000);
  }
  transform(value: number): string {
    this.minutes = Math.floor(value / 60);
    this.seconds = value - this.minutes * 60;
    return this.minutes + ':' + (value - this.minutes * 60);
  }
  pauseTimer(): void {
    clearInterval(this.interval);
    if (this.seconds > 30) {
      this.messages = this.messages.slice(0, -1);
    }
    this.time = 0;
  }

  reload(): void {
    this.pauseTimer();
    this.messages = [];
    this.sender = 'FE-S-' + Date.now();
  }
}
