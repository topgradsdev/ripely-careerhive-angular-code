import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CareerArticlesRoutingModule } from './career-articles-routing.module';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CareerArticlesRoutingModule,
    MatButtonModule,
    MatIconModule,
  ]
})
export class CareerArticlesModule { }
