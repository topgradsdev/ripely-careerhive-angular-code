import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { SimulationOverviewComponent } from '../simulation-overview/simulation-overview.component';
import { SimulationProgressComponent } from '../simulation-progress/simulation-progress.component';
import { SimulationWorkflowComponent } from '../simulation-workflow/simulation-workflow.component';
import { SimulationEligibleStudentsComponent } from '../simulation-eligible-students/simulation-eligible-students.component';
import { SimulationTestimoniesComponent } from '../simulation-testimonies/simulation-testimonies.component';

@Component({
  selector: 'app-simulation-groups',
  templateUrl: './simulation-groups.component.html',
  styleUrls: ['./simulation-groups.component.scss']
})
export class SimulationGroupsComponent implements OnInit {
  @ViewChild('simOverview') simOverview: SimulationOverviewComponent;
  @ViewChild('simProgress') simProgress: SimulationProgressComponent;
  @ViewChild('simWorkflow') simWorkflow: SimulationWorkflowComponent;
  @ViewChild('simEligibleStudents') simEligibleStudents: SimulationEligibleStudentsComponent;
  @ViewChild('simTestimonies') simTestimonies: SimulationTestimoniesComponent;

  id: string;
  redirectTo: string;
  activeTab = 'overview';

  detail: any = {
    title: '',
    code: '',
    description: '',
    is_publish: false,
    eligible_students: 0,
    pending_placements: 0,
    placed_candidates: 0,
  };

  // Publish
  publishForm: FormGroup;
  publishMode = 'instant';

  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['link']
    ]
  };

  password = null;
  proceedFlow: any = '';
  confirmPassword: FormGroup;
  @ViewChild('closePasswordModal') closePasswordModal: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: TopgradserviceService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
    this.activatedRoute.queryParamMap.subscribe((params: ParamMap) => {
      this.redirectTo = params.get('redirectTo');
      if (this.redirectTo) {
        setTimeout(() => {
          const tabMap: any = {
            'progress': 'sim-progress-tab',
            'workflow': 'sim-workflow-tab',
            'eligible-students': 'sim-students-tab',
            'testimonies': 'sim-testimonies-tab'
          };
          if (tabMap[this.redirectTo]) {
            document.getElementById(tabMap[this.redirectTo])?.click();
          }
        }, 100);
      }
    });

    this.confirmPassword = new FormGroup({
      password: new FormControl('', [Validators.required]),
    });

    this.publishForm = new FormGroup({
      publish_mode: new FormControl('instant'),
      start_date: new FormControl(''),
      end_date: new FormControl(''),
      description: new FormControl(''),
      featured: new FormControl(false)
    });
  }

  getPlacementDetails(detail: any) {
    this.detail = { ...this.detail, ...detail };
  }

  onTabClick(tab: string) {
    this.activeTab = tab;
    switch (tab) {
      case 'overview':
        this.simOverview?.refreshData();
        break;
      case 'progress':
        this.simProgress?.refreshData();
        break;
      case 'workflow':
        this.simWorkflow?.refreshData();
        break;
      case 'eligible-students':
        this.simEligibleStudents?.refreshData();
        break;
      case 'testimonies':
        this.simTestimonies?.refreshData();
        break;
    }
  }

  proceed(e: any) {
    this.proceedFlow = e;
    this.password = null;
  }

  async checkPassword() {
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      email_id: userDetail?.email,
      password: this.password,
    };
    return this.service
      .confirmPassword(payload)
      .toPromise()
      .catch((error) => {
        this.service.showMessage({ message: error?.error?.errors?.msg });
      });
  }

  async unpublishSimulationGroup() {
    const isPasswordValid = await this.checkPassword();
    if (isPasswordValid?.result !== 'success') {
      return true;
    }
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      placement_id: this.id,
      password: this.password,
      is_publish: false,
      publish_by_name: userDetail?.first_name + ' ' + userDetail?.last_name,
    };
    this.service.editPlacementGroup(payload).subscribe((response: any) => {
      if (response.status == HttpResponseCode.SUCCESS) {
        this.password = null;
        this.proceedFlow = null;
        this.simOverview?.refreshData();
        this.service.showMessage({ message: response.msg });
      }
    });
  }

  publishSimGroup() {
    this.detail.is_publish = true;
  }

  unpublishSimGroup() {
    this.unpublishSimulationGroup();
  }
}
