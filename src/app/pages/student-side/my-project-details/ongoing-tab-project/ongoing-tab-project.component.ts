import { Component, Input, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { Router } from '@angular/router';
// import { Label } from 'ng2-charts';
import moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileIconService } from '../../../../shared/file-icon.service';

@Component({
  selector: 'app-ongoing-tab-project',
  templateUrl: './ongoing-tab-project.component.html',
  styleUrls: ['./ongoing-tab-project.component.scss']
})
export class OngoingTabProjectComponent implements OnInit {

  showCollapes: any = '';
  currentTaskTab: any = 'task_progress';
  onGoingPlacementWorkFlow = [];
  showDetails: boolean;
  userProfile = null;
  uploadedMediaFiles = null;
  studentVacancyDetail = null;
  @Input() studentProfile: any;
  selectTask:any;

  completedTaskCountOfOngoing = 0;
  pendingTaskOfOngoing = [];

  constructor(private service: TopgradserviceService,
    private router: Router, private sanitizer: DomSanitizer, private fileIconService: FileIconService) { }
  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
    }
  async ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.userProfile.placement_id = this.studentProfile?.placement_id;
    this.userProfile.placement_type = this.studentProfile?.placement_type;
    this.userProfile.company_allocation = this.studentProfile?.company_allocation;
    await this.getWorkFlowTask();
    this.getOngoingStudentVacancyDetail();
    // this.getWorkingHourForStudent();
  }

  changeTaskTab(e: any) {
    this.currentTaskTab = e;
  }

  getOngoingStudentVacancyDetail() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id
    };
    this.service.getOngoingStudentVacancyDetail(payload).subscribe((response: any) => {
      this.studentVacancyDetail = response.result ? response.result[0] : [];
      if (this.studentVacancyDetail?.is_withdrawal) {
        this.onGoingPlacementWorkFlow.forEach(task => {
          task.task_status = "lock";
          return task;
        });
      }
    });
  }

  async getWorkFlowTask() {
    const payload = {
      placement_id: this.studentProfile?.placement_id,
      stage: "Ongoing",
      student_id: this.userProfile?._id,
      workflow_type_id: this.studentProfile?.placement_type_id
    }
    this.service.getProjectStudentWorkFlowTask(payload).subscribe((response: any) => {
      this.onGoingPlacementWorkFlow = response.result ? response.result : [];
      let count = 0;
      for (const task of this.onGoingPlacementWorkFlow) {
        if (count > 0) {
          if (task.task_status === 'lock' && this.onGoingPlacementWorkFlow[count-1].task_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
            task.task_status = "pending"; 
          }
        }
        count++;
      }
       this.onGoingPlacementWorkFlow =  this.onGoingPlacementWorkFlow.map(task => ({
          ...task,
          safeVideoUrl: task.video_url
            ? this.getVideoUrl(task.video_url)
            : null
        }));
      this.completedTaskCountOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'completed')?.length;
      this.pendingTaskOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
      this.onGoingPlacementWorkFlow.forEach(workflow => {
        workflow.showCollapes = false;
      });
    });
  }

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

  async goToStudentForm(task) {

    console.log("task", task, this.userProfile);
    // return false;
    this.onGoingPlacementWorkFlow

    let count = 0;
    await this.onGoingPlacementWorkFlow.map(el=>{
      if(el.task_status=="pending"){
        count++;
      }
    })
    this.router.navigate(['/student/project-student-form'], { queryParams: { taskId: task._id , isLast:count, stage: 'ongoing', placement_id:task.placement_id,vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id, id:this.studentProfile?._id}  });
  }
uploadFile(event: Event, task: any) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList); // Convert FileList to array
  task.file = []; // Initialize file array

  for (const file of filesArray) {
    if (file.size > 5000971) { // 5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });
      input.value = ''; // Clear input so same file can be reselected
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      task.file = resp;  // Accumulate uploaded file response
    });
  }

  input.value = ''; // Clear file input after all processing
}

 

  submitWorkflowttachment(task) {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_status: "completed",
      employee_status: "pending",
      type: 'student',
      attachments: task.file,
      document_types: task?.document_types,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id,
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name
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



  requestWithdrawl() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id
    }
    this.service.requestWithdrawl(payload).subscribe(res => {
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
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id
    }
    this.service.getSubmittedWorkFlowTask(payload).subscribe((response: any) => {
      if (response?.result?.attachments) {
        window.open(response?.result?.attachments?.url, '_blank');
      }
    });
  }


  // submitStudentWorkingHours(workingHour) {
  //    const payload = {
  //     placement_id: this.userProfile?.placement_id,
  //     student_id: this.userProfile?._id,
  //     vacancy_id: this.studentProfile?.vacancy_id,
  //     company_id: this.studentProfile?.company_id,
  //     start_date: workingHour?.start_date,
  //     end_date:  workingHour?.end_date,
  //     working_hours:  workingHour?.working_hours
  //   }
  //   this.service.submitWorkingHourForStudent(payload).subscribe(res => {
  //     this.getWorkingHourForStudent();
  //   }, err => {
  //     this.service.showMessage({
  //       message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
  //     });
  //   })
  // }
  

  getVacancyTitle(studentProfile: any): string {
    if (studentProfile?.company_allocation?.length > 0) {
      const placedVacancy = studentProfile.company_allocation.find(el => el.status === 'Placed');
      return placedVacancy?.vacancy_name || studentProfile.company_allocation[0]?.vacancy_name;
    }
    return studentProfile?.title || '';
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




  submitWorkflowVideo(task) {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_status: "completed",
      employee_status: "pending",
      type: 'student',
      attachments: task.file,
      video_url: task.video_url,
      document_types: task?.document_types,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id,
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name
    }
    this.service.submitWorkFlowVideo(payload).subscribe(res => {
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

  submitWorkflowDocReview(task) {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_status: "completed",
      employee_status: "pending",
      type: 'student',
      attachments: task.file,
      documents: task.documents,
      document_types: task?.document_types,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id,
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name
    }
    this.service.submitWorkFlowReviewDoc(payload).subscribe(res => {
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

  viewFile(index, file){
    console.log("index, file", index, file)
    window.open(file.url);
  }
  downloadFile(url: string) {
    window.open(url);
  } 
  videoUrl(rawUrl){
    return this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl);
  }

    isYoutubeOrVimeoUrl(url: string): boolean {
    if (!url) return false;

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)$/;

    return youtubeRegex.test(url) || vimeoRegex.test(url);
  }
  
  
    submitUploadVideo(task) {
    console.log("task", task);

   
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_type:"Video",
      is_approve:true,
      status:task.additional_criteria_status == "Staff Marks Complete"?'to_do':'approve',
      task_status: task.additional_criteria_status == "Staff Marks Complete"?"pending":"completed",
      employee_status: "pending",
      student_status: "completed",
      type:task.additional_criteria_status == "Staff Marks Complete"?'staff':'student',
      attachments: task.file,
      video_url: task.video_url,
      document_types: task?.document_types,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id,
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name,
      student_submitted_at:new Date().toISOString()
    }
    console.log("payload", payload)
    //  return false;
    this.service.submitWorkFlowVideoUrl(payload).subscribe(res => {
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

  gotoReportIncident(data){
    console.log("data", data)
    this.router.navigate(['/student/report-incident-student-form'], { queryParams: { stage: 'completed',placement_id: this.userProfile?.placement_id, student_id: this.userProfile?._id, vacancy_id:this.userProfile?.company_allocation[0]?.vacancy_id}  });
  }

    getVideoUrl(data: { video_url: string } | string | null): SafeResourceUrl | null {
      if (!data) return null;

      // Handle string input
      const url = typeof data === 'string' ? data : data.video_url;
      if (!url) return null;

      // YouTube URLs
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (youtubeMatch) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
      }

      // Vimeo URLs
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/); // normal Vimeo page
      const vimeoPlayerMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/); // already player URL
      const vimeoId = vimeoMatch ? vimeoMatch[1] : vimeoPlayerMatch ? vimeoPlayerMatch[1] : null;

      if (vimeoId) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoId}`);
      }

      // Unsupported URL
      return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }

     attend(task){
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_status: "completed",
      employee_status: "completed",
      type: 'student',
      appointment_url: task.appointment_url,
      document_types: task?.document_types,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id,
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name
    }
    this.service.submitWorkFlowAttachment(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
        window.open(task.appointment_url, '_blank', 'noopener,noreferrer');

      // window.open(task.appointment_url)
      this.getWorkFlowTask();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  openwindow(task){
     window.open(task.appointment_url, '_blank', 'noopener,noreferrer');
  }


  attendEvent(task){
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      task_id: task._id,
      task_status: "completed",
      employee_status: "completed",
      type: 'student',
      event_url: task.event_url,
      document_types: task?.document_types,
      vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id,
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name
    }
    this.service.submitWorkFlowAttachment(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
        window.open(task.event_url, '_blank', 'noopener,noreferrer');

      // window.open(task.appointment_url)
      this.getWorkFlowTask();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  openwindowEvent(task){
     window.open(task.event_url, '_blank', 'noopener,noreferrer');
  }

}


