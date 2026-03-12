import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SimulationShellComponent } from './simulation-shell/simulation-shell.component';
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
import { TaskGuard } from './shared/task.guard';

const routes: Routes = [
  {
    path: '',
    component: SimulationShellComponent,
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },
      { path: 'overview', component: SimulationOverviewComponent },
      { path: 'intro', component: SimulationIntroComponent },
      { path: 'messages', component: SimulationMessagesComponent },
      { path: 'chat', component: SimulationChatComponent },
      { path: 'library', component: SimulationLibraryComponent },
      { path: 'tasks', component: SimulationTasksComponent },
      { path: 'workstation', component: SimulationWorkstationComponent },
      { path: 'feedback', component: SimulationFeedbackComponent },
      { path: 'scorecard', component: SimulationScorecardComponent },
      { path: 'task/gather-data', component: TaskGatherDataComponent, canActivate: [TaskGuard], data: { taskKey: 'migration' } },
      { path: 'task/drift-calculator', component: TaskDriftCalculatorComponent, canActivate: [TaskGuard], data: { taskKey: 'compliance' } },
      { path: 'task/watch-video', component: TaskWatchVideoComponent, canActivate: [TaskGuard], data: { taskKey: 'hotfix' } },
      { path: 'task/submit-form', component: TaskSubmitFormComponent, canActivate: [TaskGuard], data: { taskKey: 'waterbalance' } },
      { path: 'task/calculation-report', component: TaskCalculationReportComponent, canActivate: [TaskGuard], data: { taskKey: 'report' } },
      { path: 'crisis', component: TaskCrisisComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SimulationRoutingModule { }
