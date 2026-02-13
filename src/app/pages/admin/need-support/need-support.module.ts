import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedSupportRoutingModule } from './need-support-routing.module';
import { NeedSupportComponent } from './need-support.component';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    NeedSupportComponent
  ],
  imports: [
    CommonModule,
    NeedSupportRoutingModule,
    MaterialModule,
    NgSelectModule
  ]
})
export class NeedSupportModule { }
