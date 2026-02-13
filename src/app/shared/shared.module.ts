import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UIModule } from "./ui/ui.module";
import { SendEmailCompanyPopupComponent, SendEmailPopupComponent, SharedComponents } from './components/components';
import { MaterialModule } from '../material.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { DisplayColumnsPopupComponent } from './components/display-columns-popup/display-columns-popup.component';
import { StudentImportViaExcelComponent } from '../pages/wil/student-import-via-excel/student-import-via-excel.component';
import { IndustryPartnerImportViaExcelComponent } from '../pages/wil/industry-partner-import-via-excel/industry-partner-import-via-excel.component';
import { StudentFormModule } from './components/student/student-form/student-form.module';
import { EmployerStudentFormModule } from './components/employer/student-form/employer-student-form.module';
import { ViewProfileModule } from './components/employer/view-profile/view-profile.module';
import { StudentProfileComponent } from './components/student-profile/student-profile.component';
import { ModalModule } from 'ngx-bootstrap/modal';
// import { NgxDnDModule } from '@swimlane/ngx-dnd';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { QuillModule } from 'ngx-quill';
import { PreviewFormsComponent } from './components/preview-forms/preview-forms.component';
import { ViewEmailPopupComponent } from './components/view-email-popup/view-email-popup.component';
// import { LoaderComponent } from './components/loader/loader.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AutoResizeDirective } from '../auto-resize-height.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { StudentFilterPipe } from '../../pipes/student-search-pipe';
import { ProjectStudentFormModule } from './components/student/project-student-form/project-student-form.module';
import { StudentProjectFilterPipe } from '../../pipes/student-search-project-pipe';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { GooglePlaceDirective } from '../google-place.directive';
import { LoaderComponent } from './components/loader/loader.component';
import { LightboxModule } from 'ngx-lightbox';
import { NgChartsModule } from 'ng2-charts';
import { ReportIncidentStudentFormModule } from './components/student/report-incident-student-form/report-incident-student-form.module';
import { ReportIncidentEmployerFormModule } from './components/employer/report-incident-employer-form/report-incident-employer-form.module';
import { NgxPermissionsModule } from 'ngx-permissions';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BlacklistCompanyImportViaExcelComponent } from '../pages/wil/blacklist-company-import-via-excel/blacklist-company-import-via-excel.component';
import { LoaderCustomComponent } from './components/loader-custom/loader-custom.component';
import { StudentVideoModule } from './components/student/student-video/student-video.module';

@NgModule({
  declarations: [
    ...SharedComponents,
    DisplayColumnsPopupComponent,
    SendEmailPopupComponent,
    SendEmailCompanyPopupComponent,
    ViewEmailPopupComponent,
    StudentImportViaExcelComponent,
    IndustryPartnerImportViaExcelComponent,
    BlacklistCompanyImportViaExcelComponent,
    StudentProfileComponent,
    PreviewFormsComponent,
    // LoaderComponent,
    AutoResizeDirective,
    StudentFilterPipe,
    StudentProjectFilterPipe,
    GooglePlaceDirective,
    LoaderComponent,
    LoaderCustomComponent
  ],
  imports: [
    InfiniteScrollModule,
    FormsModule,
    LightboxModule,
    CommonModule,
    MaterialModule,
    NgSelectModule,
    EditorModule,
    NgChartsModule,
    StudentFormModule,
    StudentVideoModule,
    NgxPermissionsModule,
    ProjectStudentFormModule,
    ReportIncidentStudentFormModule,
     ReportIncidentEmployerFormModule,
    EmployerStudentFormModule,
    ViewProfileModule,
    ModalModule,
    DragDropModule,
    // NgxDnDModule,
    // //GooglePlaceModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    QuillModule.forRoot()
  ],
  exports: [
    UIModule,
    StudentFilterPipe,
    StudentProjectFilterPipe,
    StudentImportViaExcelComponent,
    IndustryPartnerImportViaExcelComponent,
    BlacklistCompanyImportViaExcelComponent,
    StudentFormModule,
    ProjectStudentFormModule,
    ReportIncidentStudentFormModule,
    ReportIncidentEmployerFormModule,
    EmployerStudentFormModule,
    ViewProfileModule,
    DragDropModule,
    // NgxDnDModule,
    // //GooglePlaceModule,
    // QuillModule,
    AutoResizeDirective,
    GooglePlaceDirective,
    LoaderComponent,
    LoaderCustomComponent,
    ...SharedComponents,
  ],
  providers: [],
})
export class SharedModule { 
 
}
