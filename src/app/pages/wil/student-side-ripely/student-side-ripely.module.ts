import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentSideRipelyRoutingModule } from './student-side-ripely-routing.module';
import { StudentSideRipelyComponent } from './student-side-ripely.component';
import { StudentNavbarComponent } from './navbar/navbar.component';
import { StudentFooterComponent } from './footer/footer.component';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
import { StudentSimulationsComponent } from './simulations/simulations.component';
import { StudentCareerCoachingComponent } from './career-coaching/career-coaching.component';
import { StudentSupportComponent } from './support/support.component';

@NgModule({
  declarations: [
    StudentSideRipelyComponent,
    StudentNavbarComponent,
    StudentFooterComponent,
    StudentDashboardComponent,
    StudentSimulationsComponent,
    StudentCareerCoachingComponent,
    StudentSupportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StudentSideRipelyRoutingModule
  ]
})
export class StudentSideRipelyModule { }
