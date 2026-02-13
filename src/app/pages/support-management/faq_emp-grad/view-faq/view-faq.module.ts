import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewFaqRoutingModule } from './view-faq-routing.module';
import { ViewFaqComponent } from './view-faq.component';
import { SharedModule } from '@coreui/angular';


@NgModule({
  declarations: [ViewFaqComponent],
  imports: [
    CommonModule,
    SharedModule,
    ViewFaqRoutingModule,
  ]
})
export class ViewFaqModule { }
