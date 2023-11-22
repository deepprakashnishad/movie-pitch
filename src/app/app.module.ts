import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { SharedModule } from './shared/shared.module';

import { httpInterceptorProviders } from './shared/http-interceptors/index';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    SharedModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
