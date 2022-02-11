import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {StarRatingColor} from './star-rating/star-rating.component';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit {

  rating = 4;
  starCount = 5;
  starColor: StarRatingColor = StarRatingColor.warn;
  text = '';
  name = '';
  feedback: Feedback;
  @Output() sendedFeedback = new EventEmitter();

  constructor(private readonly httpClient: HttpClient) {
  }

  ngOnInit(): void {
  }

  onRatingChanged(rating): void {
    this.rating = rating;
  }

  sendFeedback(): void {
    this.feedback = {
      name: this.name,
      rating: this.rating,
      text: this.text
    };
    this.httpClient.post('http://leobot.htl-leonding.ac.at:8080/api/feedback', this.feedback).subscribe();
    this.sendedFeedback.emit(true);
  }
}
export interface Feedback{
  name: string;
  rating: number;
  text: string;
}
