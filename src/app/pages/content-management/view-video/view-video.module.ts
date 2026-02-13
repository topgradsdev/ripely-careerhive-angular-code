import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlyrModule } from 'ngx-plyr';
import { ViewVideoRoutingModule } from './view-video-routing.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PlyrModule,
    ViewVideoRoutingModule
  ]
})
export class ViewVideoModule { }
