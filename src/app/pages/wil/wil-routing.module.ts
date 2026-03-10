import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlacementGroupsListComponent } from './placement-groups-list/placement-groups-list.component';
import { WilCompaniesListComponent } from './wil-companies-list/wil-companies-list.component';
import { WilVacanciesListComponent } from './wil-vacancies-list/wil-vacancies-list.component';
import { PlacementGroupsComponent } from './placement-groups/placement-groups.component';
import { PlacementWorkflowCreateTaskComponent } from './placement-workflow-create-task/placement-workflow-create-task.component';
import { ViewStudentProfileComponent } from './view-student-profile/view-student-profile.component';
import { ViewCompanyDetailsComponent } from './view-company-details/view-company-details.component';
import { WorkflowTrackProgressComponent } from './workflow-track-progress/workflow-track-progress.component';
import { StudentSearchDatabaseComponent } from './student-search-database/student-search-database.component';
import { SiteVisitsDetailsComponent } from './site-visits-details/site-visits-details.component';
import { CreateVacancyAdminComponent } from './create-vacancy-admin/create-vacancy-admin.component';
import { VacancyViewComponent } from './vacancy-view/vacancy-view.component';
import { AddCompanyMenuallyComponent } from './add-company-menually/add-company-menually.component';
import { PendingCompanyApprovavalsComponent } from './pending-company-approvavals/pending-company-approvavals.component';
import { CreateCompanyAdminComponent } from './create-company-admin/create-company-admin.component';
import { CreateProjectAdminComponent } from './create-project-admin/create-project-admin.component';
import { ProjectViewComponent } from './project-view/project-view.component';
import { PlacementGroupsProjectComponent } from './placement-groups-project/placement-groups-project.component';
import { WilCompaniesRequestListComponent } from './wil-companies-request-list/wil-companies-request-list.component';


const routes: Routes = [
  {
    path: 'placement-groups-list',
    component: PlacementGroupsListComponent
  },
  {
    path: 'placement-groups/:id',
    component: PlacementGroupsComponent
  },
  {
    path: 'placement-groups/project/:id',
    component: PlacementGroupsProjectComponent
  },
  {
    path: 'wil-companies-list',
    component: WilCompaniesListComponent
  },
  {
    path: 'wil-companies-request-list',
    component: WilCompaniesRequestListComponent
  },
  {
    path: 'wil-vacancies-list',
    component: WilVacanciesListComponent
  },
  {
    path: 'workflow-task/:placement_id',
    component: PlacementWorkflowCreateTaskComponent
  },
  {
    path: 'view-student-profile',
    component: ViewStudentProfileComponent
  },
  {
    path: 'view-company-details',
    component: ViewCompanyDetailsComponent
  },
  {
    path: 'workflow-track-progress/:placement_id',
    component: WorkflowTrackProgressComponent
  },
  {
    path: 'student-search-database',
    component: StudentSearchDatabaseComponent
  },
  {
    path: 'site-visits-details',
    component: SiteVisitsDetailsComponent
  },
  {
    path: 'create-vacancy',
    component: CreateVacancyAdminComponent
  },
  {
    path: 'create-project',
    component: CreateProjectAdminComponent
  },

  {
    path: 'create-company',
    component: CreateCompanyAdminComponent
  },

  {
    path: 'view-vacancy',
    component: VacancyViewComponent
  },
  {
    path: 'view-project',
    component: ProjectViewComponent
  },
  {
    path: 'add-company-menually',
    component: AddCompanyMenuallyComponent
  },
  {
    path: 'pending-company-approvals',
    component: PendingCompanyApprovavalsComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WilRoutingModule { }
