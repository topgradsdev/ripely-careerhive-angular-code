import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyticsRoutingModule } from './analytics-routing.module';
import { MaterialModule } from '../../material.module';
import { SharedModule } from '../../shared/shared.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ngx-drag-drop';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    MaterialModule,
    SharedModule,
    DndModule,
    // NgDragDropModule.forRoot(),
    DragDropModule
  ]
})
export class AnalyticsModule { }
