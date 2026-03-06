import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-sandbox-list',
  templateUrl: './sandbox-list.component.html',
  styleUrls: ['./sandbox-list.component.scss'],
})
export class SandboxListComponent implements OnInit {

  sandboxes: any[] = [];
  totalSandboxes: number = 0;
  activeSandboxes: number = 0;
  inactiveSandboxes: number = 0;

  constructor(
    private service: TopgradserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSandboxList();
    this.getSandboxStats();
  }

  getSandboxList() {
    this.service.getSandboxList({ search: '', page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.sandboxes = res.data || [];
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load sandboxes',
        });
      },
    });
  }

  getSandboxStats() {
    this.service.getSandboxStats({}).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.totalSandboxes = res.data?.total || 0;
          this.activeSandboxes = res.data?.active || 0;
          this.inactiveSandboxes = res.data?.inactive || 0;
        }
      },
      error: () => {},
    });
  }

  editSandbox(sandbox: any) {
    if (sandbox._id) {
      this.router.navigate(['/admin/sandbox-library/edit', sandbox._id]);
    }
  }

  deleteSandbox(sandbox: any, event: Event) {
    event.stopPropagation();
    if (!sandbox._id) return;
    this.service.deleteSandbox({ id: sandbox._id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.getSandboxList();
          this.getSandboxStats();
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to delete sandbox',
        });
      },
    });
  }
}
