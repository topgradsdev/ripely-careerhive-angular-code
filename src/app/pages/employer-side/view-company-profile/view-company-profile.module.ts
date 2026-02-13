import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewCompanyProfileRoutingModule } from './view-company-profile-routing.module';
import { MaterialModule } from '../../../material.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
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
    ViewCompanyProfileRoutingModule,
    MaterialModule,
    SharedModule,
    CarouselModule
    // GooglePlaceModule
  ]
})
export class ViewCompanyProfileModule { }
