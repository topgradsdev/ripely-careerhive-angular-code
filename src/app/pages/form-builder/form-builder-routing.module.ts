import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormBuilderListComponent } from './form-builder-list/form-builder-list.component';
import { SinglePageFormComponent } from './single-page-form/single-page-form.component';
import { MultiStepFormComponent } from './multi-step-form/multi-step-form.component';
import { PreviewSingleFormComponent } from './preview-single-form/preview-single-form.component';
import { FormBuilderComponent } from './form-builder.component';
import { SubmitedFormListComponent } from './submited-form-list/submited-form-list.component';
import { ConditionalLogicListComponent } from './conditional-logic-list/conditional-logic-list.component';

const routes: Routes = [{
  path: '',
  component: FormBuilderComponent,
  children: [
    {
      path: 'form-builder-list',
      pathMatch: "full",
      component: FormBuilderListComponent
    }, {
      path: 'single-page-form',
      pathMatch: "full",
      component: SinglePageFormComponent
    }, {
      path: 'multi-step-form',
      pathMatch: "full",
      component: MultiStepFormComponent
    },
    {
      path: 'single-page-form-preview',
      pathMatch: "full",
      component: PreviewSingleFormComponent
    },
    {
      path: 'submited-form-list/:id',
      pathMatch: "full",
      component: SubmitedFormListComponent
    },
    {
      path: 'conditional-logic-list',
      pathMatch: "full",
      component: ConditionalLogicListComponent
    },

    
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FormBuilderRoutingModule { }
