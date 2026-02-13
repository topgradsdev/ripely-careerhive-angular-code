import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
// import { Label } from 'ng2-charts';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-my-project-details',
  templateUrl: './my-project-details.component.html',
  styleUrls: ['./my-project-details.component.scss']
})
export class MyProjectDetailsComponent implements OnInit {
  studentVacancyDetail = null;
  showDetails: boolean;
  showCollapes: any = '';
  currentTaskTab: any = 'my_task';
  userDetail = null;
  studentNavParam = null;
  onGoingPlacementWorkFlow = [];
  employerStudentData = null;
  selectedTab :any = 'nav-pre-placement-tab';
  userProfile = null;
  activeTab: string = 'pre-placement'; // Default active tab
  loadedTabs: Set<string> = new Set(); // Track loaded tabs

  hideCompTab:boolean = false;
  constructor(private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
      this.loadedTabs.add(this.activeTab);
    this.userDetail = JSON.parse(localStorage.getItem('userSDetail'));
    this.activatedRoute.queryParams.subscribe(params => {
      if (params?.student_id) {
        this.studentNavParam = params;
        if(this.studentNavParam?.type==="ongoing"){
          this.hideCompTab = true;
        }else{
          this.hideCompTab = false;
        }
        this.employerPlacementGroupDetail();
        this.getPlacementProjectDetail()
      }
    });
  }
  getInitials(name: string): string {
    if (!name) return '';
    const nameParts = name.split(' ');
    return nameParts[0]?.[0] + (nameParts[1]?.[0] || '');
  }

  goToTab(tab) {
    this.selectedTab = tab;
  }

  async ngAfterViewInit() {

    setTimeout(()=>{
      this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        if (params?.stage) {
          this.selectedTab = params.stage;
          
        }else {
         
        }
      });
    })

    
  }
  setActiveTab(tab: string): void {
    this.activeTab = tab;

    // Add tab to the set of loaded tabs if not already loaded
    if (!this.loadedTabs.has(tab)) {
      this.loadedTabs.add(tab);

      // Perform tab-specific API calls if needed
      this.loadTabData(tab);
    }
  }

  loadTabData(tab: string): void {
    switch (tab) {
      case 'pre-placement':
        console.log('Loading Pre Placement Data...');
        break;
      case 'ongoing':
        console.log('Loading Ongoing Data...');
        break;
      case 'post-placement':
        console.log('Loading Post Placement Data...');
        break;
      case 'completed':
        console.log('Loading Completed Data...');
        break;
      default:
        console.log('No data to load for this tab.');
    }
  }

  ngOnInit(): void {
  
  }

   projectDetails:any = {};
    selectedCompany:any = {};
    getPlacementProjectDetail(){
      let payload = { placement_id: this.studentNavParam.placement_id };
      this.service
        .getPlacementGroupProjectDetails(payload)
        .subscribe((response: any) => {
          if (response.status == HttpResponseCode.SUCCESS) {
            this.projectDetails = response.data[0];
            this.selectedCompany = response.data[0].company_info[0];
  
            console.log("this.projectDetailsthis.projectDetails", this.projectDetails)
          }else{
            // this.projectDetails = {};
            // this.selectedCompany ={}
          }
        });
    }

  changeTaskTab(e: any) {
    this.currentTaskTab = e;
  }

  employerPlacementGroupDetail() {

    const payload = {
      allocation_id: this.studentNavParam?.id
    }
    this.service.getEmployerStudentProjectById(payload).subscribe(response => {
      this.employerStudentData = response.result[0];
      console.log("this.employerStudentData", this.employerStudentData);
      // this.getWorkFlowTask( this.employerStudentData);
    });
  }

  // async getWorkFlowTask(data) {
  //   this.onGoingPlacementWorkFlow = [];
  //   const payload = {
  //     placement_id: data?.placement_id,
  //     stage: "Ongoing",
  //     student_id: this.studentNavParam?.student_id,
  //     company_id: this.userDetail?._id,
  //     vacancy_id: this.studentNavParam?.vacancy_id,
  //     workflow_type_id: data?.placement_type_id,
  //   }
  //   this.service.getProjectStudentWorkFlowTask(payload).subscribe((response: any) => {
  //     this.onGoingPlacementWorkFlow = response.result ? response.result : [];
  //     let count = 0;
  //     for (const task of this.onGoingPlacementWorkFlow) {
  //       if (count > 0) {
  //         if (task.employee_status === 'lock' && this.onGoingPlacementWorkFlow[count - 1].employee_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
  //           task.employee_status = "pending";
  //         }
  //       }
  //       count++;
  //     }
  //     this.onGoingPlacementWorkFlow.forEach(workflow => {
  //       workflow.showCollapes = false;
  //     });
  //   });
  // }

  taskStatus(status) {
    const taskStatus = {
      lock: "Locked",
      pending: "In Progress",
      completed: "Completed"
    }
    return taskStatus[status];
  }

  showHide() {
    this.showDetails = !this.showDetails;
  }

  collapsToggle(task: any) {
    task.showCollapes = !task.showCollapes
  }

uploadFile(event: Event, task: any) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList); // Convert FileList to Array

  task.file = []; // Initialize as array

  for (const file of filesArray) {
    if (file.size > 5000971) { // ~5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });
      input.value = ''; // Clear file input if validation fails
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      task.file = resp;  // Accumulate uploaded files
    });
  }

  input.value = ''; // Clear input after processing
}


  submitWorkflowttachment(task) {
    const payload = {
      placement_id: this.userDetail?.placement_id,
      student_id: this.studentNavParam?.student_id,
      task_id: task._id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
      employee_status: "completed",
      task_status: "completed",
      type: 'employee',
      attachments: task.file,
      document_types: task?.document_types,
      employer_name: this.userDetail?.company_name
    }
    this.service.submitWorkFlowAttachment(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
      // this.getWorkFlowTask(this.employerStudentData);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getSubmittedTask(task) {
    const payload = {
      placement_id: this.userDetail?.placement_id,
      student_id: this.studentNavParam?.student_id,
      task_id: task._id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
    }
    this.service.getSubmittedWorkFlowTask(payload).subscribe((response: any) => {
      if (response?.result?.attachments) {
        window.open(response?.result?.attachments?.url, '_blank');
      }
    });
  }

  
  getMessage(task) {
    const capitalizeStatus = (status: string) => {
      if (!status) return '';
      return status
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    };
  
  
     let message = "";
     if(task.statusToolTips){
      task.statusToolTips.forEach(el => {
        if (el["employee_status"]) {
          message += "Employer Status: " + capitalizeStatus(el["employee_status"]) + "\n";
        }
        if (el["student_status"]) {
          message += "Student Status: " + capitalizeStatus(el["student_status"]) + "\n";
        }
        if (el["staff_status"]) {
          message += "Staff Status: " + capitalizeStatus(el["staff_status"]) + "\n";
        }
      });
     }
     
      return message.trim(); // Removes trailing newline
  }

  showFullEmails:boolean = false;
  maskEmail(email: string): string {
    if(email){
  const [local, domain] = email.split('@');
      if (!local || !domain) return email;
      // const firstChar = local.charAt(0);
      // ${firstChar}
      const masked = '*'.repeat(local.length - 1);
      return `${masked}@${domain}`;
    }else{
      return '';
    }
   
  }

  gotoReportIncident(data){
   this.router.navigate(['/student/report-incident-student-form'], { queryParams: { stage: this.activeTab,placement_id: data?.placement_id, student_id: this.userProfile?._id, vacancy_id:data?.vacancy_id, company_id: data?.company_id, type:'project'}  });
  }
}
