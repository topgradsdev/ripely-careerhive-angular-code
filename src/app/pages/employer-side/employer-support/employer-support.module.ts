import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerSupportRoutingModule } from './employer-support-routing.module';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    EmployerSupportRoutingModule,
    MaterialModule
  ]
})
export class EmployerSupportModule { }
