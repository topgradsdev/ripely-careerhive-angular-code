import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentsRoutingModule } from './students-routing.module';
import { StudentsListComponent } from './students-list/students-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ResumeReviewComponent } from './resume-review/resume-review.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { MatSortModule } from '@angular/material/sort';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTreeModule } from '@angular/material/tree';
import { A11yModule } from '@angular/cdk/a11y';
import { SharedModule } from '../../shared/shared.module';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MaterialModule } from '../../material.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { QuillModule } from 'ngx-quill';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CompanyStudentsListComponent } from './company-students-list/company-students-list.component';
import { CompanyIncidentReportingListComponent } from './company-incident-reporting-list/company-incident-reporting-list.component';
@NgModule({
  declarations: [
    StudentsListComponent,
    ResumeReviewComponent,
    CompanyStudentsListComponent,
    CompanyIncidentReportingListComponent
  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    StudentsRoutingModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatCheckboxModule,
    NgSelectModule,
    EditorModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule,
    MatSortModule,
    MatToolbarModule,
    MatTreeModule,
    A11yModule,
    SharedModule,
    MaterialModule,
    ModalModule,
    // PerfectScrollbarModule,
    QuillModule.forRoot(),
    NgxPermissionsModule.forChild()
  ]
})
export class StudentsModule { }
