import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { SharedModule } from '@coreui/angular';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
