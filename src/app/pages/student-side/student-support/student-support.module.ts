import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentSupportRoutingModule } from './student-support-routing.module';
// import { StudentSupportComponent } from './student-support.component';
import { MaterialModule } from '../../../material.module';


@NgModule({
  declarations: [
    // StudentSupportComponent
  ],
  imports: [
    CommonModule,
    StudentSupportRoutingModule,
    MaterialModule
  ]
})
export class StudentSupportModule { }
