import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';

import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';

import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { IconModule, IconSetModule, IconSetService } from '@coreui/icons-angular';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatMenuModule} from '@angular/material/menu';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ModalModule, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { EditorModule } from '@tinymce/tinymce-angular';
import {MatRadioModule} from '@angular/material/radio';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatExpansionModule} from '@angular/material/expansion';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxDropzoneModule } from 'ngx-dropzone';
import {MatTabsModule} from '@angular/material/tabs';
import { PlyrModule } from 'ngx-plyr';

// Material import
import { MaterialModule } from './material.module';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import { AppComponent } from './app.component';

// Import containers
import { DefaultLayoutComponent, StudentDefaultLayoutComponent, EmployeeDefaultLayoutComponent } from './containers';


import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './views/register/register.component';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete'; 


const APP_CONTAINERS = [
  DefaultLayoutComponent
];

// import {
//   AppAsideModule,
//   AppBreadcrumbModule,
//   AppHeaderModule,
//   AppFooterModule,
//   AppSidebarModule,
// } from '@coreui/angular';

// import { SidebarModule } from '@coreui/angular';
// import { HeaderModule } from '@coreui/angular';
// import { FooterModule } from '@coreui/angular';
// import { BreadcrumbModule } from '@coreui/angular';
// import { SidebarNavModule } from '@coreui/angular';
// import { SidebarTogglerModule } from '@coreui/angular';
// import { SidebarBrandModule } from '@coreui/angular';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule as SharedModuleA,
  SidebarModule,
  TabsModule as TabsModuleA,
  UtilitiesModule
} from '@coreui/angular';
// import { IconModule, IconSetService } from '@coreui/icons-angular';



// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgChartsModule } from 'ng2-charts';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { UserManagementComponent } from './pages/user-management/user-management.component';
import { ForgetPasswordComponent } from './pages/auth/forget-password/forget-password.component';

import { TermsConditionsComponent } from './pages/content-management/terms-conditions/terms-conditions.component';
import { CareerVideosComponent } from './pages/content-management/career-videos/career-videos.component';
import { ViewArticleComponent } from './pages/content-management/view-article/view-article.component';
import { EditArticleComponent } from './pages/content-management/edit-article/edit-article.component';
import { AddVideoComponent } from './pages/content-management/add-video/add-video.component';
import { ViewVideoComponent } from './pages/content-management/view-video/view-video.component';
import { EditVideoComponent } from './pages/content-management/edit-video/edit-video.component';
import { AboutUsComponent } from './pages/content-management/about-us/about-us.component';
import { HomepageManagementComponent } from './pages/homepage-management/homepage-management.component';

import { ViewReportComponent } from './pages/support-management/view-report/view-report.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TopgradserviceService } from './topgradservice.service';
import { ResetPasswordComponent } from './pages/auth/reset-password/reset-password.component';
import { TermsSubHeadingsComponent } from './pages/content-management/terms-sub-headings/terms-sub-headings.component';
import { AddHeadingComponent } from './pages/content-management/add-heading/add-heading.component';
import { EditHeadingComponent } from './pages/content-management/edit-heading/edit-heading.component';
import { EditSubHeadingComponent } from './pages/content-management/edit-sub-heading/edit-sub-heading.component';
import { AddSubHeadingComponent } from './pages/content-management/add-sub-heading/add-sub-heading.component';
import { GraduateAddFaqComponent } from './pages/support-management/faq_emp-grad/graduate-add-faq/graduate-add-faq.component';
import { GraduateEditFaqComponent } from './pages/support-management/faq_emp-grad/graduate-edit-faq/graduate-edit-faq.component';
import { ReportsComponent } from './pages/support-management/reports/reports.component';
import { DateAgoPipe } from '../pipes/date-ago.pipe';
import { NgxStarRatingModule } from 'ngx-star-rating';
import { MatIconModule } from '@angular/material/icon';
import { LoginInitialComponent } from './pages/auth/login-initial/login-initial.component';
import { StudentLoginComponent } from './pages/auth/student-login/student-login.component';
import { EmployerLoginComponent } from './pages/auth/employer-login/employer-login.component';
import { StaffLoginComponent } from './pages/auth/staff-login/staff-login.component';
import { StudentTermsAndConditionsModule } from './pages/student-terms-and-conditions/student-terms-and-conditions.module';
import { EmployerRegisterModule } from './pages/auth/employer-register/employer-register.module';
import { QuillModule } from 'ngx-quill';
import { MY_DATE_FORMATS } from './custom-date-format';
import { AdminOnboardingComponent } from './pages/auth/admin-onboarding/admin-onboarding.component';
import { NgxPermissionsModule } from 'ngx-permissions';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
// import { MaintenanceInterceptor } from './maintenance.interceptor';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from './shared/shared.module';
import { ChangePasswordModule } from './pages/change-password/change-password.module';
import { LoaderComponent } from './shared/components/loader/loader.component';
import { environment } from 'src/environments/environment';
import { AuthModule } from '@auth0/auth0-angular';
import { YoutubeVimeoUrlValidatorDirective } from './youtube-vimeo-url.directive';
import { StudentLoginCallBackComponent } from './pages/auth/student-login-callback/student-login-callback.component';
import OktaAuth from '@okta/okta-auth-js';
import { OktaAuthModule, OktaConfig } from '@okta/okta-angular';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
// import { AutoResizeDirective } from './auto-resize-height.directive';
import { HighchartsChartModule } from 'highcharts-angular';
import { AgGridModule } from 'ag-grid-angular';
import { ActionCellRendererComponent } from './ag-grid/action-cell-renderer/action-cell-renderer.component';
import { CellInputRendererComponent } from './ag-grid/cell-input-renderer/cell-input-renderer.component';
import { CellNumberRendererComponent } from './ag-grid/cell-number-renderer/cell-number-renderer.component';
import { CellDropdownRendererComponent } from './ag-grid/cell-dropdown-renderer/cell-dropdown-renderer.component';
import { LinkRendererComponent } from './ag-grid/link-renderer/link-renderer.component';
import { TextRendererComponent } from './ag-grid/text-renderer/text-renderer.component';
import { DateCellRendererComponent } from './ag-grid/date-cell-renderer/date-cell-renderer.component';
import { TimeCellRendererComponent } from './ag-grid/time-cell-renderer/time-cell-renderer.component';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';


const modalDefaults: ModalOptions = {
  backdrop: 'static',
  ignoreBackdropClick: true,
};


// const oktaAuth = new OktaAuth({
//   issuer: environment.auth.issuer,
//   clientId: environment.auth.clientId,
//   redirectUri: environment.auth.redirectUri,
//   scopes: environment.auth.scopes,
//   pkce: environment.auth.pkce,
//   tokenManager: { storage: 'localStorage' }
// });

const oktaAuth = new OktaAuth({
  issuer: environment.okta.issuer,
  clientId: environment.okta.clientId,
  redirectUri: environment.okta.redirectUri,
  postLogoutRedirectUri: environment.okta.postLogoutRedirectUri,
  scopes: environment.okta.scopes,
  responseType: 'code',
  pkce: true
});
const oktaConfig: OktaConfig = { oktaAuth };


@NgModule({
  imports: [
    //GooglePlaceModule,
    CommonModule,
    SharedModule,
    NgxStarRatingModule ,
     BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    // SidebarModule,
    // BreadcrumbModule,
    // FooterModule,
    // HeaderModule,
    SidebarModule,
    AvatarModule,
    BadgeModule,
    BreadcrumbModule,
    ButtonGroupModule,
    ButtonModule,
    CardModule,
    DropdownModule,
    FooterModule,
    FormModule,
    GridModule,
    HeaderModule,
    ListGroupModule,
    NavModule,
    ProgressModule,
    SharedModule,
    SharedModuleA,
    TabsModuleA,
    UtilitiesModule,
    HighchartsChartModule,
    AgGridModule,
    NgxMaterialTimepickerModule,
    // SidebarModule,
    // PerfectScrollbarModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    NgChartsModule,
    IconModule,
    IconSetModule.forRoot(),
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatIconModule,
    MatDatepickerModule,
    ModalModule,
    MatCheckboxModule,
    MaterialModule,
    EditorModule,
    QuillModule.forRoot(),
    MatRadioModule,
    MatAutocompleteModule,
    MatExpansionModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    NgxSliderModule,
    NgxDropzoneModule,
    MatTabsModule,
    // PlyrModule,
    MaterialModule,
    NgxMatSelectSearchModule,
    EmployerRegisterModule,
    MatProgressSpinnerModule,
    StudentTermsAndConditionsModule,
    NgxPermissionsModule.forRoot(),
    OktaAuthModule.forRoot(oktaConfig),
    ChangePasswordModule,
    InfiniteScrollModule,
    
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: environment.auth.redirectUri,
      }
    }),
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    P404Component,
    P500Component,
    LoginComponent,
    StaffLoginComponent,
    LoginInitialComponent,
    StudentLoginComponent,
    StudentLoginCallBackComponent,
    EmployerLoginComponent,
    RegisterComponent,
    UserManagementComponent,
    ForgetPasswordComponent,
    ReportsComponent,
    TermsConditionsComponent,
    CareerVideosComponent,
    ViewArticleComponent,
    EditArticleComponent,
    AddVideoComponent,
    ViewVideoComponent,
    EditVideoComponent,
    AboutUsComponent,
    GraduateAddFaqComponent,
    GraduateEditFaqComponent,
    HomepageManagementComponent,
    ViewReportComponent,
    ResetPasswordComponent,
    TermsSubHeadingsComponent,
    AddHeadingComponent,
    EditHeadingComponent,
    EditSubHeadingComponent,
    AddSubHeadingComponent,
    DateAgoPipe,
    AdminOnboardingComponent,
    YoutubeVimeoUrlValidatorDirective,
    ActionCellRendererComponent,
    CellInputRendererComponent,
    CellNumberRendererComponent,
    CellDropdownRendererComponent,
    LinkRendererComponent,
    TextRendererComponent,
    DateCellRendererComponent,
    TimeCellRendererComponent
    // LoaderComponent,
    // AutoResizeDirective
  ],
  providers: [
    BsModalService,
    // {
    //   provide: LocationStrategy,
    //   useClass: HashLocationStrategy,
    // },
    { provide: ModalOptions, useValue: modalDefaults },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TopgradserviceService, multi:true
    },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Use en-GB for dd/MM/yyyy format
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: MaintenanceInterceptor,
    //   multi: true
    // },
    IconSetService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [ AppComponent ]
})
export class AppModule { 
  
}


