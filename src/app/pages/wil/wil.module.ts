import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WilRoutingModule } from './wil-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { PlacementGroupsListComponent } from './placement-groups-list/placement-groups-list.component';
import { WilCompaniesListComponent } from './wil-companies-list/wil-companies-list.component';
import { WilVacanciesListComponent } from './wil-vacancies-list/wil-vacancies-list.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PlacementGroupsComponent } from './placement-groups/placement-groups.component';
import { PlacementOverviewComponent } from './placement-overview/placement-overview.component';
import { MaterialModule } from '../../material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { PlacementWorkflowComponent } from './placement-workflow/placement-workflow.component';
import { PlacementEligibleStudentsComponent } from './placement-eligible-students/placement-eligible-students.component';
import { StudentAddManuallyComponent } from './student-add-manually/student-add-manually.component';
import { StudentSearchDatabaseComponent } from './student-search-database/student-search-database.component';
import { PlacementIndustryPartnersComponent } from './placement-industry-partners/placement-industry-partners.component';
import { SharedModule } from '../../shared/shared.module';
import { PlacementOverviewCreateTaskComponent } from './placement-overview-create-task/placement-overview-create-task.component';
import { PlacementWorkflowCreateTaskComponent } from './placement-workflow-create-task/placement-workflow-create-task.component';
import { ViewStudentProfileComponent } from './view-student-profile/view-student-profile.component';
import { ViewStudentDetailsComponent } from './view-student-details/view-student-details.component';
import { ViewStudentPendingTasksComponent } from './view-student-pending-tasks/view-student-pending-tasks.component';
import { ViewStudentApprovalsComponent } from './view-student-approvals/view-student-approvals.component';
import { ViewStudentOngoingPlacementComponent } from './view-student-ongoing-placement/view-student-ongoing-placement.component';
import { ViewStudentCompletedPlacementComponent } from './view-student-completed-placement/view-student-completed-placement.component';
import { PlacementsTabComponent } from './placements-tab/placements-tab.component';
import { ViewCompanyDetailsComponent } from './view-company-details/view-company-details.component';
import { WorkflowTrackProgressComponent } from './workflow-track-progress/workflow-track-progress.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SiteVisitsDetailsComponent } from './site-visits-details/site-visits-details.component';
// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { CarouselModule } from 'ngx-owl-carousel-o';
// import { NgDragDropModule } from 'ng-drag-drop';
import { DndModule } from 'ngx-drag-drop';

import { CreateVacancyAdminComponent } from './create-vacancy-admin/create-vacancy-admin.component';
import { VacancyViewComponent } from './vacancy-view/vacancy-view.component';
import { AddCompanyMenuallyComponent } from './add-company-menually/add-company-menually.component';
import { PendingCompanyApprovavalsComponent } from './pending-company-approvavals/pending-company-approvavals.component';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
// import { EmailPreviewHtmlComponent } from '../email-templates/email-preview-html/email-preview-html.component';
import { MatTabsModule } from '@angular/material/tabs';
import { IndustryPartnerAddBySearchingComponent } from './industry-partner-add-by-searching/industry-partner-add-by-searching.component';
import { QuillModule } from 'ngx-quill';
import { CreateCompanyAdminComponent } from './create-company-admin/create-company-admin.component';
import { ModalModule, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { ChartsModule } from 'ng2-charts';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { CreateProjectAdminComponent } from './create-project-admin/create-project-admin.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { PlacementGroupsProjectComponent } from './placement-groups-project/placement-groups-project.component';
import { PlacementOverviewProjectComponent } from './placement-overview-project/placement-overview-project.component';
import { PlacementProjectEligibleStudentsComponent } from './placement-project-eligible-students/placement-project-eligible-students.component';
import { PlacementWorkflowProjectComponent } from './placement-workflow-project/placement-workflow-project.component';
import { CompanyDetailComponent } from './view-company-details/company-detail/company-detail.component';
import { CompanyDepartmentsComponent } from './view-company-details/company-departments/company-departments.component';
import { CompanyVacanciesViewComponent } from './view-company-details/company-vacancies-view/company-vacancies-view.component';
import { SubsidiariesListComponent } from './view-company-details/subsidiaries-list/subsidiaries-list.component';
import { ViewCompanySiteVisitsComponent } from './view-company-details/view-company-site-visits/view-company-site-visits.component';
import { ViewCompanySubmissionsComponent } from './view-company-details/view-company-submissions/view-company-submissions.component';
import { WilCompaniesRequestListComponent } from './wil-companies-request-list/wil-companies-request-list.component';
import { YoutubeVimeoUrlValidatorDirective } from 'src/app/youtube-vimeo-url.directive';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { PlacementSubmissionsComponent } from './placement-submissions/placement-submissions.component';
import { NgChartsModule } from 'ng2-charts';

const modalDefaults: ModalOptions = {
  backdrop: 'static',
  ignoreBackdropClick: true,
};



@NgModule({
  declarations: [
    PlacementGroupsListComponent,
    WilCompaniesListComponent,
    WilCompaniesRequestListComponent,
    WilVacanciesListComponent,
    PlacementGroupsComponent,
    PlacementOverviewComponent,
    PlacementOverviewProjectComponent,
    PlacementWorkflowComponent,
    PlacementWorkflowProjectComponent,
    PlacementEligibleStudentsComponent,
    PlacementSubmissionsComponent,
    PlacementProjectEligibleStudentsComponent,
    StudentAddManuallyComponent,
    StudentSearchDatabaseComponent,
    PlacementIndustryPartnersComponent,
    PlacementOverviewCreateTaskComponent,
    PlacementWorkflowCreateTaskComponent,
    ViewStudentProfileComponent,
    ViewStudentDetailsComponent,
    ViewStudentPendingTasksComponent,
    ViewStudentApprovalsComponent,
    ViewStudentOngoingPlacementComponent,
    ViewStudentCompletedPlacementComponent,
    PlacementsTabComponent,
    ViewCompanyDetailsComponent,
    CompanyDepartmentsComponent,
    CompanyDetailComponent,
    CompanyVacanciesViewComponent,
    SubsidiariesListComponent,
    ViewCompanySiteVisitsComponent,
    ViewCompanySubmissionsComponent,
    WorkflowTrackProgressComponent,
    SiteVisitsDetailsComponent,
    CreateVacancyAdminComponent,
    CreateProjectAdminComponent,
    CreateCompanyAdminComponent,
    VacancyViewComponent,
    ProjectViewComponent,
    PlacementGroupsProjectComponent,
    AddCompanyMenuallyComponent,
    PendingCompanyApprovavalsComponent,
    // EmailPreviewHtmlComponent,
    IndustryPartnerAddBySearchingComponent,
    // YoutubeVimeoUrlValidatorDirective
  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    // ChartsModule,
    WilRoutingModule,
    CommonModule,
    NgSelectModule,
    EditorModule,
    MaterialModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    DragDropModule,
    NgChartsModule,
    // PerfectScrollbarModule,
    CarouselModule,
    DndModule,
    // NgDragDropModule.forRoot(),
    // GooglePlaceModule,
    MatTabsModule,
    ModalModule,
    AgGridModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot(),
    MatSelectModule,
    MatOptionModule,
    NgxPermissionsModule.forChild()
  ],
  providers: [
    BsModalService,
   
    { provide: ModalOptions, useValue: modalDefaults }
  ],
})
export class WilModule { }
