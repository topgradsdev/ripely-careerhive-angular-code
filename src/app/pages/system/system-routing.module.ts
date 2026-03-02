import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AIAgentComponent } from './agent/ai-agent.component';
import { AddAIAgentComponent } from './add-agent/add-ai-agent.component';
import { AddKnowledgeBaseComponent } from './add-knowledge-base/add-knowledge-base.component';

const routes: Routes = [
  {
		path: 'agent-list',
		component: AIAgentComponent
	},
  {
    path:'add-agent',
    component:AddAIAgentComponent
  },
  {
    path:'edit-agent/:id',
    component:AddAIAgentComponent
  },
  {
    path:'add-knowledge-base',
    component:AddKnowledgeBaseComponent
  },
  {
    path:'edit-knowledge-base/:id',
    component:AddKnowledgeBaseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
