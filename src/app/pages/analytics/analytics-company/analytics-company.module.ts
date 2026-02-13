import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsCompanyRoutingModule } from './analytics-company-routing.module';
import { AnalyticsCompanyComponent } from './analytics-company.component';
import { MaterialModule } from '../../../material.module';
import { SharedModule } from '../../../shared/shared.module';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { NgSelectModule } from '@ng-select/ng-select';
import { AnalyticsCompanyFilteringComponent } from './analytics-company-filtering/analytics-company-filtering.component';
import { CompanyCreateNewFilterComponent } from './company-create-new-filter/company-create-new-filter.component';
// import { ChartsModule } from 'ng2-charts';
// import { NgDragDropModule } from 'ng-drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { DndModule } from 'ngx-drag-drop';


@NgModule({
  declarations: [
    AnalyticsCompanyComponent,
    AnalyticsCompanyFilteringComponent,
    CompanyCreateNewFilterComponent
  ],
  imports: [
    CommonModule,
    AnalyticsCompanyRoutingModule,
    // PerfectScrollbarModule,
    MaterialModule,
    NgSelectModule,
    DndModule,
    // ChartsModule,
    SharedModule,
    // NgDragDropModule.forRoot(),
    DragDropModule
  ]
})
export class AnalyticsCompanyModule { }
