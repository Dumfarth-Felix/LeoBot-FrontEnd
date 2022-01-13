import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-star-rating',
  templateUrl: './star-rating.component.html',
  styleUrls: ['./star-rating.component.scss']
})
export class StarRatingComponent implements OnInit {

  @Input() rating;
  @Input()  starCount;
  @Input()  color;
  @Output()  ratingUpdated = new EventEmitter();

   snackBarDuration = 2000;
   ratingArr = [];

  constructor(private snackBar: MatSnackBar) {
  }


  ngOnInit(): void {
    console.log('a ' + this.starCount);
    for (let index = 0; index < this.starCount; index++) {
      this.ratingArr.push(index);
    }
  }
  onClick(rating: number): boolean {
    console.log(rating);
    this.snackBar.open('Du hast Leon mit ' + rating + ' / ' + this.starCount + ' Sternen bewertet', '', {
      duration: this.snackBarDuration
    });
    this.ratingUpdated.emit(rating);
    return false;
  }

  showIcon(index: number): string {
    if (this.rating >= index + 1) {
      return 'star';
    } else {
      return 'star_border';
    }
  }

}
export enum StarRatingColor {
  primary = 'primary',
  accent = 'accent',
  warn = 'warn'
}
