import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeGuard } from '../../../guards/employee-guard';
import { EmployerCompletedPlacementComponent } from './employer-completed-placement.component';
import { EmployerStudentFormComponent } from '../../../shared/components/employer/student-form/employer-student-form.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [EmployeeGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerCompletedPlacementComponent
      },
      {
        path: 'employer-student-form',
        pathMatch: 'full',
        canActivate: [EmployeeGuard],
        component: EmployerStudentFormComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployerCompletedPlacementRoutingModule { }
