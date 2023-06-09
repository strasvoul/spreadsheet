import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MoveFocusDirective } from './directives/move-focus.directive';
import { InputArrowControlDirective } from './directives/input-arrow-control.directive';

@NgModule({
  declarations: [AppComponent, MoveFocusDirective, InputArrowControlDirective],
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
