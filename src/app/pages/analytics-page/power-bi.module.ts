import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PowerBIRoutingModule } from './power-bi-routing.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MaterialModule } from 'src/app/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { SharedModule } from '@coreui/angular';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { DndModule } from 'ngx-drag-drop';
import { MatTabsModule } from '@angular/material/tabs';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QuillModule } from 'ngx-quill';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { PowerBIPageComponent } from './power-bi/power-bi-page.component';
import { HighchartsChartModule } from "highcharts-angular";



@NgModule({
  declarations: [
    PowerBIPageComponent
  ],
  imports: [
    CommonModule,
    // ChartsModule,
    PowerBIRoutingModule,
    CommonModule,
    NgSelectModule,
    EditorModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    NgSelectModule,
    DragDropModule,
    // PerfectScrollbarModule,
    CarouselModule,
    DndModule,
    // NgDragDropModule.forRoot(),
    // GooglePlaceModule,
    MatTabsModule,
    ModalModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot(),
    MatSelectModule,
    MatOptionModule,
    NgxPermissionsModule.forChild(),
    HighchartsChartModule
],
  providers: [
    BsModalService,
  ],
})
export class PowerBIModule { }
