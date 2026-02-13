import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../../guards/admin-guard';
import { AnalyticsModule } from '../analytics/analytics.module';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [AdminGuard],
        loadChildren: () => import('../../views/dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'users',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['Users'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule)
      },
      {
        path: 'my-task',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['My Tasks'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../my-task/my-task.module').then(m => m.MyTaskModule)
      },
      {
        path: 'incident-and-reporting',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['My Tasks'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../incident-and-reporting/incident-and-reporting.module').then(m => m.IncidentAndReportingModule)
      },
      {
        path: 'students',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['Students'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../students/students.module').then(m => m.StudentsModule)
      },
      {
        path: 'wil',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['WIL'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../wil/wil.module').then(m => m.WilModule)
      },
      {
        path: 'form-builder',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['Form Builder'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../form-builder/form-builder.module').then(m => m.FormBuilderModule)
      },
      {
        path: 'email-templates',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['Email Templates'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../email-templates/email-templates.module').then(m => m.EmailTemplatesModule)
      },
       {
        path: 'system-rule',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['Email Templates'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../system-rule/system-rule.module').then(m => m.SystemRuleModule)
      },

      {
        path: 'analytics',
        canActivate: [AdminGuard],
        // canActivate: [AdminGuard, NgxPermissionsGuard],
        // data: {
        //   permissions: {
        //     only: ['Email Templates'],
        //     redirectTo: '404'
        //   }
        // },
        loadChildren: () => import('../analytics-page/power-bi.module').then(m => m.PowerBIModule)
      },

      {
        path: 'system',
        canActivate: [AdminGuard],
        loadChildren: () => import('../system/system.module').then(m => m.SystemModule)
      },
      
      {
        path: 'analytics',
        canActivate: [AdminGuard],
        loadChildren: () => import('../analytics/analytics.module').then(m => AnalyticsModule)
      },
      {
        path: 'need-support',
        canActivate: [AdminGuard],
        loadChildren: () => import('../admin/need-support/need-support.module').then(m => m.NeedSupportModule)
      },
      {
        path: 'articles',
        canActivate: [AdminGuard],
        loadChildren: () => import('../admin/articles/articles.module').then(m => m.ArticlesModule)
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
