import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerOnboardingRoutingModule } from './employer-onboarding-routing.module';
import { MaterialModule } from '../../../material.module';
import { EmployerOnboardingComponent } from './employer-onboarding.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    EmployerOnboardingComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    EmployerOnboardingRoutingModule,
    MaterialModule,
    NgSelectModule,
    // GooglePlaceModule
  ]
})
export class EmployerOnboardingModule { }
