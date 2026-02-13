import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GraduateAddFaqRoutingModule } from './graduate-add-faq-routing.module';
import { SharedModule } from '@coreui/angular';
// import { GraduateAddFaqComponent } from './graduate-add-faq.component';


@NgModule({
  declarations: [
    // GraduateAddFaqComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    GraduateAddFaqRoutingModule
  ]
})
export class GraduateAddFaqModule { }
