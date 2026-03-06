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

  searchText: string = '';
  filterCategory: string = '';
  filterStatus: string = '';
  private searchTimeout: any;

  categoryOptions = [
    { label: 'Coding', value: 'Coding' },
    { label: 'SQL', value: 'SQL' },
    { label: 'Cyber Security', value: 'Cyber Security' },
    { label: 'Testing', value: 'Testing' },
    { label: 'Bug Tracking', value: 'Bug Tracking' },
    { label: 'Load Testing', value: 'Load Testing' },
    { label: 'API Testing', value: 'API Testing' },
  ];

  statusOptions = [
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];

  constructor(
    private service: TopgradserviceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSandboxList();
    this.getSandboxStats();
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.getSandboxList();
    }, 400);
  }

  onFilterChange() {
    this.getSandboxList();
  }

  clearFilters() {
    this.searchText = '';
    this.filterCategory = '';
    this.filterStatus = '';
    this.getSandboxList();
  }

  getSandboxList() {
    const params: any = { search: this.searchText, page: 1, limit: 100 };
    if (this.filterCategory) params.category = this.filterCategory;
    if (this.filterStatus) params.status = this.filterStatus;
    this.service.getSandboxList(params).subscribe({
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
