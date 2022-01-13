import {Component, OnInit} from '@angular/core';
import {StarRatingColor} from './star-rating/star-rating.component';

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

  constructor() {
  }

  ngOnInit(): void {
  }

  onRatingChanged(rating): void {
    this.rating = rating;
  }

  sendFeedback(): void {

  }
}
