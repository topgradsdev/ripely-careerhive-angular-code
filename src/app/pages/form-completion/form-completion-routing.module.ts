
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormCompletionComponent } from './form/form-completion.component';

const routes: Routes = [
  {
    path: 'completion',
    component: FormCompletionComponent,
    data: {
      title: 'Form'
    }
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormCompletionRoutingModule { }
