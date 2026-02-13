import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentTermsAndConditionsRoutingModule } from './student-terms-and-conditions-routing.module';
import { StudentTermsAndConditionsComponent } from './student-terms-and-conditions.component';
import { HeaderModule } from '../../common/header/header.module';


@NgModule({
  declarations: [
    StudentTermsAndConditionsComponent
  ],
  imports: [
    CommonModule,
    HeaderModule,
    StudentTermsAndConditionsRoutingModule
  ],

})
export class StudentTermsAndConditionsModule { }
