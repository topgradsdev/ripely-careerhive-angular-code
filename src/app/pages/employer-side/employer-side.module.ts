import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmployerSideRoutingModule } from './employer-side-routing.module';
import { MaterialModule } from '../../material.module';
import { VacanciesModule } from './vacancies/vacancies.module';
import { VacanciesDetailsModule } from './vacancies-details/vacancies-details.module';
import { EmployeeDefaultLayoutComponent } from '../../containers/employee-default-layout';
import { EmployerHeaderComponent } from './employer-header/employer-header.component';
import { EmployerVacancyModule } from './employer-vacancy/employer-vacancy.module';
import { VacanciesComponent } from './vacancies/vacancies.component';
import { EmployerVacancyComponent } from './employer-vacancy/employer-vacancy.component';
import { EmployerSupportModule } from './employer-support/employer-support.module';
import { EmployerSupportComponent } from './employer-support/employer-support.component';
import { EmployerCompletedPlacementModule } from './employer-completed-placement/employer-completed-placement.module';
import { EmployerOngoingPlacementModule } from './employer-ongoing-placement/employer-ongoing-placement.module';
import { EmployerOngoingPlacementDetailsModule } from './employer-ongoing-placement-details/employer-ongoing-placement-details.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { EditorModule } from '@tinymce/tinymce-angular';
import { ViewProfileModule } from '../view-profile/view-profile.module';
import { MyCompanyProfileModule } from './my-company-profile/my-company-profile.module';
import { MyCompanyProfileComponent } from './my-company-profile/my-company-profile.component';
import { EmployerSiteVisitsDetailsModule } from './employer-site-visits-details/employer-site-visits-details.module';
import { EmployerOnboardingModule } from './employer-onboarding/employer-onboarding.module';
import { SharedModule } from '../../shared/shared.module';
import { VacancyFilterPipe } from '../../../pipes/vacancy-search-pipe';
import { ChangePasswordModule } from '../change-password/change-password.module';
import { QuillModule } from 'ngx-quill';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { StudentFilterPipe } from '../../../pipes/student-search-pipe';
import { EmployerPlacementModule } from './employer-placement/employer-placement.module';
import { EmployerPlacementDetailsModule } from './employer-placement-details/employer-placement-details.module';
import { EmployerProjectModule } from './employer-project/employer-project.module';
import { EmployerProjectDetailsModule } from './employer-project-details/employer-project-details.module';
import { EmployerProjectCreateModule } from './employer-create-project/employer-create-project.module';
import { GooglePlaceDirective } from 'src/app/google-place.directive';
import { MyCompanyDepartmentsComponent } from './my-company-profile/my-company-departments/my-company-departments.component';
import { MyCompanyDetailComponent } from './my-company-profile/my-company-detail/my-company-detail.component';
import { MySubsidiariesListComponent } from './my-company-profile/my-subsidiaries-list/my-subsidiaries-list.component';
import { MyCompanySiteVisitsComponent } from './my-company-profile/my-company-site-visits/my-company-site-visits.component';
import { MyCompanySubmissionsComponent } from './my-company-profile/my-company-submissions/my-company-submissions.component';
import { MyCompanyVacanciesViewComponent } from './my-company-profile/my-company-vacancies-view/my-company-vacancies-view.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { ViewCompanyProfileModule } from './view-company-profile/view-company-profile.module';
import { ViewCompanyProfileComponent } from './view-company-profile/view-company-profile.component';
import { ViewCompanyDepartmentsComponent } from './view-company-profile/view-company-departments/view-company-departments.component';
import { ViewCompanyDetailComponent } from './view-company-profile/view-company-detail/view-company-detail.component';
import { ViewMyCompanySiteVisitsComponent } from './view-company-profile/view-company-site-visits/view-my-company-site-visits.component';
import {  ViewMyCompanySubmissionsComponent } from './view-company-profile/view-company-submissions/view-my-company-submissions.component';
import { ViewCompanyVacanciesViewComponent } from './view-company-profile/view-company-vacancies-view/view-company-vacancies-view.component';
import { ViewSubsidiariesListComponent } from './view-company-profile/view-subsidiaries-list/view-subsidiaries-list.component';
import { MySiteVisitsDetailsComponent } from './my-company-profile/my-site-visits-details/my-site-visits-details.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MyViewSiteVisitsDetailsComponent } from './view-company-profile/my-view-site-visits-details/my-view-site-visits-details.component';
import { EmployerOnboardingSelfModule } from './employer-onboarding-self/employer-onboarding-self.module';
import { EmployerVacancySelCreateModule } from './employer-vacancy-self-create/employer-vacancy-self-create.module';
import { EmployerVacancSelfCreateComponent } from './employer-vacancy-self-create/employer-vacancy-self-create.component';

@NgModule({
  declarations: [
    // EmployeeDefaultLayoutComponent,
    EmployerHeaderComponent,
    VacanciesComponent,
    EmployerVacancyComponent,
    EmployerVacancSelfCreateComponent,
    EmployeeDefaultLayoutComponent,
    EmployerSupportComponent,
    MyCompanyProfileComponent,
    ViewCompanyProfileComponent,
    VacancyFilterPipe,
    DashboardComponent,
    

    MyCompanyDepartmentsComponent,
    MyCompanyDetailComponent,
    MySubsidiariesListComponent,
    MyCompanySiteVisitsComponent,
    MyCompanySubmissionsComponent,
    MyCompanyVacanciesViewComponent,
    MySiteVisitsDetailsComponent,

    ViewCompanyDepartmentsComponent,
    ViewCompanyDetailComponent,
    ViewMyCompanySiteVisitsComponent,
    ViewMyCompanySubmissionsComponent,
    ViewCompanyVacanciesViewComponent,
    ViewSubsidiariesListComponent,
    MyViewSiteVisitsDetailsComponent
    // StudentFilterPipe
  ],
  imports: [
    SharedModule,
    CommonModule,
    DashboardModule,
    EmployerSideRoutingModule,
    VacanciesModule,
    VacanciesDetailsModule,
    EmployerVacancyModule,
    EmployerVacancySelCreateModule,
    EmployerSupportModule,
    EmployerCompletedPlacementModule,
    EmployerOngoingPlacementModule,
    EmployerOngoingPlacementDetailsModule,
    MaterialModule,
    MyCompanyProfileModule,
    ViewCompanyProfileModule,
    EmployerSiteVisitsDetailsModule,
    NgSelectModule,
    ViewProfileModule,
    CarouselModule,
    // GooglePlaceModule,
    EditorModule,
    ModalModule,
    EmployerOnboardingModule,
    EmployerOnboardingSelfModule,
    EmployerPlacementModule,
    EmployerPlacementDetailsModule,
    EmployerProjectModule,
    EmployerProjectCreateModule,
    EmployerProjectDetailsModule,
     ModalModule,
    NgSelectModule,
    NgxMaterialTimepickerModule,
    ChangePasswordModule,
    NgxMatSelectSearchModule,
    QuillModule.forRoot()
  ]
})
export class EmployerSideModule { }
