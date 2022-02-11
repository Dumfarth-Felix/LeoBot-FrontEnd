import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {ChatComponent} from './chat/chat.component';
import {FormsModule} from '@angular/forms';
import {ContentEditableFormDirective} from './content-editable-form.directive';
import {HttpClientModule} from '@angular/common/http';
import { RatingComponent } from './rating/rating.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StarRatingComponent } from './rating/star-rating/star-rating.component';
import {MatButtonModule} from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatInputModule} from '@angular/material/input';
import { Injector} from '@angular/core';
import { createCustomElement } from '@angular/elements';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ContentEditableFormDirective,
    RatingComponent,
    StarRatingComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatIconModule,
        MatSnackBarModule,
        MatInputModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private injector: Injector){
    const ele1 = createCustomElement(ChatComponent, { injector: this.injector });
    customElements.define('app-chat', ele1);

    const ele2 = createCustomElement(RatingComponent, { injector: this.injector });
    customElements.define('app-rating', ele2);

    const ele3 = createCustomElement(StarRatingComponent, { injector: this.injector });
    customElements.define('app-star-rating', ele3);
  }
}
