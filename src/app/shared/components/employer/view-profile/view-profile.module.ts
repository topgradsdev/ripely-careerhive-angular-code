import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewProfileRoutingModule } from './view-profile-routing.module';
import { ViewProfileComponent } from './view-profile.component';
import { MaterialModule } from '../../../../material.module';


@NgModule({
  declarations: [
    ViewProfileComponent
  ],
  imports: [
    CommonModule,
    ViewProfileRoutingModule,
    MaterialModule
  ]
})
export class ViewProfileModule { }
