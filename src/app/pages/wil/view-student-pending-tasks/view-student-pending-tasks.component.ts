import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-view-student-pending-tasks',
  templateUrl: './view-student-pending-tasks.component.html',
  styleUrls: ['./view-student-pending-tasks.component.scss']
})
export class ViewStudentPendingTasksComponent implements OnInit {
  prePlacementWorkFlow = [];
  showDetails: boolean;
  showCollapes: any = '';
  userProfile = null;
  uploadedMediaFiles = null;
  @Input() studentProfile: any;
  intershiptoggle:boolean = false;

  @ViewChild('previewVideoInterview') public previewVideoInterview: ModalDirective;
  constructor(private service: TopgradserviceService,private router: Router, private sanitizer: DomSanitizer) { }

  ngOnChanges() {
    console.log("studentProfile", this.studentProfile);
    // if (this.studentProfile) {
    //   this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    //   this.getWorkFlowTask();
    // }
  }

  ngOnInit(): void {
    this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
    if (this.studentProfile) {
      this.getProjectStudent();
      this.getWorkFlowTask();
    }
  }

  getWorkFlowTask() {
    const payload = {
      placement_id: this.studentProfile?.placement_id,
      stage: "Pre-Placement",
      student_id: this.studentProfile?.student_id,
      workflow_type_id: this.studentProfile?.placement_type_id
    }
    this.service.getWorkFlowTask(payload).subscribe((response: any) => {
      this.prePlacementWorkFlow = response.result ? response.result : [];
      let count = 0;
      for (const task of this.prePlacementWorkFlow) {
        if (count > 0) {
          if (task.task_status === 'lock' && this.prePlacementWorkFlow[count - 1].task_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
            task.task_status = "pending";
          }
        }
        count++;
      }
      this.prePlacementWorkFlow.forEach(workflow => {
        workflow.showCollapes = false;
      });

      console.log("prePlacementWorkFlow", this.prePlacementWorkFlow)
    });
  }

  getProjectStudent() {
    const payload = {
      placement_id: this.studentProfile?.placement_id,
      stage: "Pre-Placement",
      student_id: this.studentProfile?.student_id,
      workflow_type_id: this.studentProfile?.placement_type_id
    }
    this.service.getProjectEmployerStudentAdmin(payload).subscribe((response: any) => {
      this.projectPendingTask = response.result ? response.result : [];
     
      this.projectPendingTask.forEach(workflow => {
        workflow.toggle = false;
      });

    });
  }

  closeAll(){
    if(this.intershiptoggle){
      this.projectPendingTask.forEach(workflow => {
        workflow.toggle = false;
      })
    }
  }
  async closeToogle(item){
  if (item.toggle) {
    item.toggle = false;
    return;
  }
  if(this.intershiptoggle){
    this.intershiptoggle = false;
  }

  // Close all others
  this.projectPendingTask.forEach(workflow => {
    workflow.toggle = false;
  });

  // Open the clicked item
  item.toggle = true;
    this.getWorlflowProject(item);
  }

  projectTask:any = [];
  getWorlflowProject(item){

    // this.projectPendingTask.forEach(workflow => {
    //   workflow.toggle = false;
    // });
    // item.toggle = !item.toggle
    console.log("item", item);
    const payload = {
      placement_id: item?.placement_id,
      stage: "Pre-Placement",
      student_id: item?.student_id,
      workflow_type_id: item?.placement_type_id
    }
    this.service.getProjectStudentWorkFlowTask(payload).subscribe((response: any) => {
      this.projectTask = response.result ? response.result : [];
      let count = 0;
      for (const task of this.projectTask) {
        if (count > 0) {
          if (task.task_status === 'lock' && this.projectTask[count - 1].task_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
            task.task_status = "pending";
          }
        }
        count++;
      }
    
    });
  }

  projectPendingTask:any = [ {id:1, toogle:false},  {id:2, toogle:false}];



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

  goToStudentForm(task) {
    this.router.navigate(['/student/student-form'], { queryParams: { taskId: task._id } });
  }

  uploadFile(event: Event, task: any) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const files = Array.from(fileList); // ✅ Convert FileList to array
  task.file = []; // ✅ Initialize as array to hold responses

  for (const file of files) {
    if (file.size > 5000971) { // ~5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });
      input.value = ''; // Clear input to allow re-selection
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      task.file = resp; // ✅ Push each uploaded file's response
    });
  }

  input.value = ''; // ✅ Clear input after processing
}

  submitWorkflowttachment(task) {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_status: "completed",
      attachments: task.file,
      document_types: task?.document_types,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id
    }
    this.service.submitWorkFlowAttachment(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
      this.getWorkFlowTask();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  getSubmittedTask(task) {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id
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
    return message.trim(); // Removes trailing newline
}

}
