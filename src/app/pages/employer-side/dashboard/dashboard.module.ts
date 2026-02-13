import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    MaterialModule,
    SharedModule,
    MatTableModule,
    MatSortModule,
    MatButtonModule
  ]
})
export class  DashboardModule { }
