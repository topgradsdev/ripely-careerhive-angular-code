import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmailTemplatesListComponent } from './email-templates-list/email-templates-list.component';
import { PlainTextEmailComponent } from './plain-text-email/plain-text-email.component';
import { HtmlEmailComponent } from './html-email/html-email.component';
import { EmailSentListComponent } from './email-sent-list/email-sent-list.component';

const routes: Routes = [
  {
		path: '',
		component: EmailTemplatesListComponent
	}, 
  {
		path: 'plain-text-email',
		component: PlainTextEmailComponent,
	}, 
  {
		path: 'html-email',
		component: HtmlEmailComponent,
	},
	{
		path: 'sent-email-list',
		component: EmailSentListComponent,
	},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmailTemplatesRoutingModule { }
