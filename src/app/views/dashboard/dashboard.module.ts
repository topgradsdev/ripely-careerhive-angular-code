import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete'; 
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    NgChartsModule,
    BsDropdownModule,
    MatTabsModule,
    MatTableModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    ButtonsModule.forRoot(),
    CommonModule,
    //GooglePlaceModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    // PerfectScrollbarModule,
    SharedModule,
    MaterialModule
  ],
  declarations: [ DashboardComponent ]
})
export class DashboardModule { }
