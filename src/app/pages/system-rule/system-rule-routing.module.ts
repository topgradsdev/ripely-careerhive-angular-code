import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SystemRuleListComponent } from './system-rule-list/system-rule-list.component';
import { SystemRuleDetailComponent } from './system-rule-details/system-rule-details.component';
import { AddSystemRuleComponent } from './add-system-rule/add-system-rule.component';


const routes: Routes = [
  {
    path: '',
    component: SystemRuleListComponent
  },
  {
    path: 'detail/:id/:type',
    component: SystemRuleDetailComponent
  },
  {
    path: 'add-rule',
    component: AddSystemRuleComponent
  },
  {
    path: 'update-rule/:id',
    component: AddSystemRuleComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRuleRoutingModule { }
