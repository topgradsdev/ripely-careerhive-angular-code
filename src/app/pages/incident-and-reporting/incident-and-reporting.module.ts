import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IncidentAndReportingRoutingModule } from './incident-and-reporting-routing.module';
import { IncidentAndReportingComponent } from './incident-and-reporting.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatRadioModule } from '@angular/material/radio';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SendEmailPopupComponent } from '../../shared/components/components';
import { SharedModule } from '../../shared/shared.module';
import { MaterialModule } from '../../material.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { QuillModule } from 'ngx-quill';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    IncidentAndReportingComponent,
  ],
  imports: [
    CommonModule,
    IncidentAndReportingRoutingModule,
    MatIconModule,
    MatMenuModule,
    NgChartsModule,
    MatButtonModule,
    MatCheckboxModule,
    NgSelectModule,
    EditorModule,
    MatRadioModule,
    DragDropModule,
    MaterialModule,
    SharedModule,
    ModalModule,
    QuillModule.forRoot(),
    NgxPermissionsModule.forChild()
  ]
})
export class IncidentAndReportingModule { }
