import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentSideRipelyComponent } from './student-side-ripely.component';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
import { StudentSimulationsComponent } from './simulations/simulations.component';
import { StudentCareerCoachingComponent } from './career-coaching/career-coaching.component';
import { StudentSupportComponent } from './support/support.component';

const routes: Routes = [
  {
    path: '',
    component: StudentSideRipelyComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: StudentDashboardComponent },
      { path: 'simulations', component: StudentSimulationsComponent },
      { path: 'career-coaching', component: StudentCareerCoachingComponent },
      { path: 'support', component: StudentSupportComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentSideRipelyRoutingModule { }
