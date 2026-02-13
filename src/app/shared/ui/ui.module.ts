import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../../material.module';
import { UiComponents } from './ui-component';



@NgModule({
  declarations: [...UiComponents,],
  imports: [
    CommonModule,
    MaterialModule,
    
  ],
  exports:[...UiComponents]
})
export class UIModule { }
