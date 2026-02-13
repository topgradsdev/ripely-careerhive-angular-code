import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployerSiteVisitsDetailsRoutingModule } from './employer-site-visits-details-routing.module';
import { MaterialModule } from '../../../material.module';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EmployerSiteVisitsDetailsComponent } from './employer-site-visits-details.component';


@NgModule({
  declarations: [
    EmployerSiteVisitsDetailsComponent
  ],
  imports: [
    CommonModule,
    EmployerSiteVisitsDetailsRoutingModule,
    MaterialModule,
    CarouselModule
  ]
})
export class EmployerSiteVisitsDetailsModule { }
