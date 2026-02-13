import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerOnboardingSelfRoutingModule } from './employer-onboarding-self-routing.module';
import { MaterialModule } from '../../../material.module';
import {  EmployerOnboardingSelfComponent } from './employer-onboarding-self.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    EmployerOnboardingSelfComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    EmployerOnboardingSelfRoutingModule,
    MaterialModule,
    NgSelectModule,
    // GooglePlaceModule
  ]
})
export class EmployerOnboardingSelfModule { }
