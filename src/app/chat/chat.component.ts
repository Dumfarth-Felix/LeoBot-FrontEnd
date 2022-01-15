import {Component, LOCALE_ID, Inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {formatNumber, registerLocaleData} from '@angular/common';

enum Branch {
  Informatik = 'Informatik',
  Medientechnik = 'Medientechnik',
  Elektronik = 'Elektronik',
  Medizintechnik = 'Medizintechnik'
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})


export class ChatComponent implements OnInit {
  text: any;
  public url = 'http://localhost:5005';
  public operator;
  public messages = [];
  public response: any;
  public secondsPassed = 0;
  public sender = 'FE-S-' + Date.now();
  private time = 0;
  public resetMinutes = 1;
  public display;
  private interval;
  private minutes: number;
  public seconds = 0;
  public branch: Branch;
  public showBot = false;
  public rate = false;
  private ipAddress;

  constructor(private http: HttpClient, @Inject(LOCALE_ID) public locale: string) {
    // this.chatService = chatService;
    // this.chatService.connect(this.url);
  }

  ngOnInit(): void {
    this.getIPAddress();
  }

  public addMessage(from, text, type: 'received' | 'sent', messageType): void {
    this.messages.push({from, text, messageType});
  }

  sendMessage(): void {
    if (this.text.replace(/\s/g, '').length) {
      this.pauseTimer();
      this.startTimer();
      this.addMessage('me', this.text.trim(), 'sent', 'text');
      if (this.text.startsWith('/')) {
        if (this.text.toLowerCase().startsWith('/resettime')) {
          if (Number(this.text.split(' ')[1]) > 0) {
            this.resetMinutes = Number(formatNumber(this.text.split(' ')[1], this.locale, '1.0-0'));
            this.addMessage('bot', 'Ich werde mich nun nach genau ' + this.resetMinutes + ' min immer resetten', 'received', 'text');
            this.text = '';
          } else {
            this.addMessage('bot',
              'Entschulding, kontrolliere bitte ob der Befehl richtig geschrieben ist, es muss /resetTime <Minutes> sein',
              'received',
              'text');
          }
        }
      } else {
        // this.chatService.sendMessage(this.text);
        this.response = this.http.post<[{
          text: string
        }, { image: string }]>('http://vm07.htl-leonding.ac.at/core/webhooks/rest/webhook',
          {sender: this.sender, message: this.text.trim()}).subscribe(data => {
          data.forEach(value => {
            for (const dataKey in value) {
              if (value.hasOwnProperty(dataKey)) {
                console.log(dataKey);
                if (dataKey !== 'recipient_id') {
                  this.addMessage('bot', value[dataKey], 'received', dataKey);
                  this.branch = this.analyseBranch(value[dataKey]);
                  if (dataKey === 'text') {
                    if (value[dataKey] === 'Tschüss') {
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
  }
  getIPAddress(): void {
    this.http.get('http://api.ipify.org/?format=json').subscribe((res: any) => {
      this.ipAddress = res.ip;
      this.sender = this.ipAddress + '+' + this.sender;
    });
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
                this.branch = this.analyseBranch(value[dataKey]);
                if (dataKey === 'text') {
                  if (value[dataKey] === 'Tschüss') {
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
      this.display = this.transform(this.time);
      if (this.secondsPassed === ((this.resetMinutes * 60) / 2)) {
        this.addMessage('bot', 'Hey, du hast schon seit ' + (this.resetMinutes * 60) / 2 + ' Sekunden nichts mehr geschrieben, in 30s werde ich unsre Unterhaltung löschen.', 'received', 'text');
      }
      if (this.minutes === this.resetMinutes) {
        this.reload();
      }
    }, 1000);
  }

  transform(value: number): string {
    this.secondsPassed = value;
    this.minutes = Math.floor(value / 60);
    this.seconds = value - this.minutes * 60;
    return this.minutes + ':' + (value - this.minutes * 60);
  }

  pauseTimer(): void {
    clearInterval(this.interval);
    if (this.seconds > 30) {
      this.messages = this.messages.slice(0, -1);
    }
    this.secondsPassed = 0;
    this.seconds = 0;
    this.minutes = 0;
    this.time = 0;
  }

  reload(): void {
    this.pauseTimer();
    this.branch = null;
    this.messages = [];
    this.sender = 'FE-S-' + Date.now();
  }

  analyseBranch(text: string): Branch {
    text = text.toLowerCase();
    const medt = text.split('medientechnik').length - 1;
    console.log('Hey' + (text.split('medientechnik').length - 1));
    const inf = text.split('informatik').length - 1;
    const ele = text.split('elektronik').length - 1;
    const medi = text.split('medizintechnik').length - 1;
    if (medt > inf && medt > ele && medt > medi) {
      return Branch.Medientechnik;
    } else if (inf > medt && inf > ele && inf > medi) {
      return Branch.Informatik;
    } else if (ele > medt && ele > inf && ele > medi) {
      return Branch.Elektronik;
    } else if (medi > medt && medi > inf && medi > ele) {
      return Branch.Medizintechnik;
    } else if (medt === 1 && inf === 1 && ele === 1 && medi === 1) {
      return null;
    }
    return this.branch;
  }

  changeBotVisability(): void {
    this.showBot = !this.showBot;
  }

  switchRate(): void {
    this.rate = !this.rate;
  }

  feedbackSended(rate): void {
    this.switchRate();
  }
}
