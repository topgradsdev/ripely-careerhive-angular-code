import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentSideRipelyRoutingModule } from './student-side-ripely-routing.module';
import { StudentSideRipelyComponent } from './student-side-ripely.component';
import { StudentNavbarModule } from './navbar/navbar.module';
import { StudentFooterComponent } from './footer/footer.component';
import { StudentDashboardComponent } from './dashboard/dashboard.component';
import { StudentSimulationsComponent } from './simulations/simulations.component';
import { StudentCareerCoachingComponent } from './career-coaching/career-coaching.component';
import { StudentSupportComponent } from './support/support.component';

@NgModule({
  declarations: [
    StudentSideRipelyComponent,
    StudentFooterComponent,
    StudentDashboardComponent,
    StudentSimulationsComponent,
    StudentCareerCoachingComponent,
    StudentSupportComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    StudentSideRipelyRoutingModule,
    StudentNavbarModule
  ]
})
export class StudentSideRipelyModule { }
