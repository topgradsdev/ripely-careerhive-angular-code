import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MyCompanyProfileRoutingModule } from './my-company-profile-routing.module';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { CarouselModule } from 'ngx-owl-carousel-o';


@NgModule({
  declarations: [

  ],
  imports: [
    CommonModule,
    ModalModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    MyCompanyProfileRoutingModule,
    MaterialModule,
    SharedModule,
    CarouselModule
    // GooglePlaceModule
  ]
})
export class MyCompanyProfileModule { }
