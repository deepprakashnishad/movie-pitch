import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
  declarations: [
    SpinnerComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MaterialModule    
  ],
  exports: [
    CommonModule,
    FormsModule,
    MaterialModule,
    SpinnerComponent
  ],
})
export class SharedModule { }
