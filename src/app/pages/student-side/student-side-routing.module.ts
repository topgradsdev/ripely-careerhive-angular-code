import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MyPlacementsComponent } from './my-placements/my-placements.component';
import { StudentFormComponent } from '../../shared/components/student/student-form/student-form.component';
import { StudentGuard } from '../../guards/student-guard';
import { StudentDefaultLayoutComponent } from '../../containers';
import { OnboardingAboutYouComponent } from './onboarding-about-you/onboarding-about-you.component';
import { PlacementTypeFormComponent } from './placement-type-form/placement-type-form.component';
import { MyProfileStudentComponent } from './my-profile-student/my-profile-student.component';
import { StudentSupportComponent } from './student-support/student-support.component';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { WorkflowTypeFormComponent } from './workflow-type-form/workflow-type-form.component';
import { ProjectStudentFormComponent } from '../../shared/components/student/project-student-form/project-student-form.component';
import { OnboradingCompanyComponent } from './onborading-company/onborading-company.component';
import { SelectslotComponent } from './select-slot/select-slot.component';
import { PlacementGroupSearchComponent } from './placement-group-search/placement-group-search.component';
import { ReportIncidentStudentFormComponent } from 'src/app/shared/components/student/report-incident-student-form/report-incident-student-form.component';
import { StudentVideoComponent } from 'src/app/shared/components/student/student-video/student-video.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [StudentGuard],
    component: StudentDefaultLayoutComponent,
    data: {
      title: 'Student'
    },
    children: [
      {
        path: 'dashboard',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: DashboardComponent
      },
      {
        path: 'change-password',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: ChangePasswordComponent
      },
      {
        path: 'my-placements',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: MyPlacementsComponent
      },
      {
        path: 'my-placements/company-onboard',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: OnboradingCompanyComponent
      },
      {
        path: 'my-project',
        canActivate: [StudentGuard],
        loadChildren: () => import('../student-side/my-project/my-project.module').then(m => m.MyProjectModule)
      },

      {
        path: 'student-form',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: StudentFormComponent
      },
      {
        path: 'student-video',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: StudentVideoComponent
      },
      {
        path: 'project-student-form',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: ProjectStudentFormComponent
      },

      {
        path: 'report-incident-student-form',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: ReportIncidentStudentFormComponent
      },

      {
        path: 'onboarding',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: OnboardingAboutYouComponent
      },
      {
        path: 'placement-type-form',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: PlacementTypeFormComponent
      },
      {
        path: 'placement-group',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: PlacementGroupSearchComponent
      },
      {
        path: 'interview-slot',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: SelectslotComponent
      },
      
      {
        path: 'workflow-type-form',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: WorkflowTypeFormComponent
      },
      {
        path: 'my-profile',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: MyProfileStudentComponent
      },
      {
        path: 'student-support',
        pathMatch: 'full',
        canActivate: [StudentGuard],
        component: StudentSupportComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSideRoutingModule { }
