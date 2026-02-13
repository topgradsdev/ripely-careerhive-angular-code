import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyProfileStudentRoutingModule } from './my-profile-student-routing.module';
import { MyProfileStudentComponent } from './my-profile-student.component';
import { MaterialModule } from '../../../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { SharedModule } from '../../../shared/shared.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { NgChartsModule } from 'ng2-charts';
import { ModalModule } from 'ngx-bootstrap/modal';


@NgModule({
  declarations: [
    MyProfileStudentComponent
  ],
  imports: [
    CommonModule,
    ModalModule,
    MyProfileStudentRoutingModule,
    MaterialModule,
    NgSelectModule,
    NgChartsModule,
    // GooglePlaceModule,
    SharedModule,
    NgxMatSelectSearchModule
  ]
})
export class MyProfileStudentModule { }
