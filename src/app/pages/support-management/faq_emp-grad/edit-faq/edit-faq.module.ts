import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditFaqRoutingModule } from './edit-faq-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditFaqComponent } from './edit-faq.component';
import { SharedModule } from '@coreui/angular';



@NgModule({
  declarations: [EditFaqComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    EditFaqRoutingModule
  ]
})
export class EditFaqModule { }
