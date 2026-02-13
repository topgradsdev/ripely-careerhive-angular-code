import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AIAgentComponent } from './agent/ai-agent.component';
import { AddAIAgentComponent } from './add-agent/add-ai-agent.component';

const routes: Routes = [
  {
		path: 'agent-list',
		component: AIAgentComponent
	},
  {
    path:'add-agent',
    component:AddAIAgentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
