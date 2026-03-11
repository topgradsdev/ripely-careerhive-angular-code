import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SimulationRoutingModule } from './simulation-routing.module';
import { StudentNavbarModule } from '../navbar/navbar.module';
import { SimulationWindowService } from './shared/simulation-window.service';
import { SimulationShellComponent } from './simulation-shell/simulation-shell.component';
import { SimulationTaskbarComponent } from './shared/simulation-taskbar/simulation-taskbar.component';
import { SimulationDesktopComponent } from './shared/simulation-desktop/simulation-desktop.component';
import { SimulationOverviewComponent } from './simulation-overview/simulation-overview.component';
import { SimulationIntroComponent } from './simulation-intro/simulation-intro.component';
import { SimulationMessagesComponent } from './simulation-messages/simulation-messages.component';
import { SimulationChatComponent } from './simulation-chat/simulation-chat.component';
import { SimulationLibraryComponent } from './simulation-library/simulation-library.component';
import { SimulationTasksComponent } from './simulation-tasks/simulation-tasks.component';
import { SimulationWorkstationComponent } from './simulation-workstation/simulation-workstation.component';
import { SimulationFeedbackComponent } from './simulation-feedback/simulation-feedback.component';
import { SimulationScorecardComponent } from './simulation-scorecard/simulation-scorecard.component';
import { TaskGatherDataComponent } from './task-gather-data/task-gather-data.component';
import { TaskDriftCalculatorComponent } from './task-drift-calculator/task-drift-calculator.component';
import { TaskWatchVideoComponent } from './task-watch-video/task-watch-video.component';
import { TaskSubmitFormComponent } from './task-submit-form/task-submit-form.component';
import { TaskCalculationReportComponent } from './task-calculation-report/task-calculation-report.component';
import { TaskCrisisComponent } from './task-crisis/task-crisis.component';

@NgModule({
  declarations: [
    SimulationShellComponent,
    SimulationTaskbarComponent,
    SimulationDesktopComponent,
    SimulationOverviewComponent,
    SimulationIntroComponent,
    SimulationMessagesComponent,
    SimulationChatComponent,
    SimulationLibraryComponent,
    SimulationTasksComponent,
    SimulationWorkstationComponent,
    SimulationFeedbackComponent,
    SimulationScorecardComponent,
    TaskGatherDataComponent,
    TaskDriftCalculatorComponent,
    TaskWatchVideoComponent,
    TaskSubmitFormComponent,
    TaskCalculationReportComponent,
    TaskCrisisComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SimulationRoutingModule,
    StudentNavbarModule
  ],
  providers: [
    SimulationWindowService
  ]
})
export class SimulationModule { }
