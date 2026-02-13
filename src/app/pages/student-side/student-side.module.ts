import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSideRoutingModule } from './student-side-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MaterialModule } from '../../material.module';
import { MyPlacementsComponent } from './my-placements/my-placements.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MyPlacementsModule } from './my-placements/my-placements.module';
import { StudentFormModule } from '../../shared/components/student/student-form/student-form.module';
import { StudentHeaderComponent } from './student-header/student-header.component';
import { StudentDefaultLayoutComponent } from '../../containers';
import { OnboardingAboutYouComponent } from './onboarding-about-you/onboarding-about-you.component';
import { PlacementTypeFormComponent } from './placement-type-form/placement-type-form.component';
import { MyProfileStudentModule } from './my-profile-student/my-profile-student.module';
import { StudentSupportComponent } from './student-support/student-support.component';
import { StudentSupportModule } from './student-support/student-support.module';
import { SharedModule } from '../../shared/shared.module';
import { ChangePasswordModule } from '../change-password/change-password.module';
// import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MyProjectModule } from './my-project/my-project.module';
import { MyProjectDetailsModule } from './my-project-details/my-project-details.module';
import { WorkflowTypeFormComponent } from './workflow-type-form/workflow-type-form.component';
import { ProjectStudentFormModule } from '../../shared/components/student/project-student-form/project-student-form.module';
import { OnboradingCompanyComponent } from './onborading-company/onborading-company.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SelectslotComponent } from './select-slot/select-slot.component';
import { PlacementGroupSearchComponent } from './placement-group-search/placement-group-search.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { ReportIncidentStudentFormRoutingModule } from 'src/app/shared/components/student/report-incident-student-form/report-incident-student-form-routing.module';
import { StudentVideoModule } from 'src/app/shared/components/student/student-video/student-video.module';


@NgModule({
  declarations: [
    DashboardComponent,
    MyPlacementsComponent,
    StudentHeaderComponent,
    StudentDefaultLayoutComponent,
    OnboardingAboutYouComponent,
    PlacementTypeFormComponent,
    WorkflowTypeFormComponent,
    StudentSupportComponent,
    OnboradingCompanyComponent,
    SelectslotComponent,
    PlacementGroupSearchComponent,
  ],
  imports: [
    CommonModule,
    MatChipsModule,
    MatIconModule,
    StudentSupportModule,
    StudentSideRoutingModule,
    MaterialModule,
    NgSelectModule,
    MyPlacementsModule,
    StudentFormModule,
    StudentVideoModule,
    ProjectStudentFormModule,
    ReportIncidentStudentFormRoutingModule,
    MyProfileStudentModule,
    SharedModule,
    ChangePasswordModule,
    // GooglePlaceModule,
    NgxMatSelectSearchModule,
    MyProjectModule,
    MyProjectDetailsModule,
    ModalModule

  ]
})
export class StudentSideModule { }
