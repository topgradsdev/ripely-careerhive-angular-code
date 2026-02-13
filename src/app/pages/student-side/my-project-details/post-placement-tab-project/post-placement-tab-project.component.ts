import { Component, Input, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileIconService } from '../../../../shared/file-icon.service';

@Component({
  selector: 'app-post-placement-tab-project',
  templateUrl: './post-placement-tab-project.component.html',
  styleUrls: ['./post-placement-tab-project.component.scss']
})
export class PostPlacementTabProjectComponent implements OnInit {
  postPlacementWorkFlow = [];
  showDetails: boolean;
  showCollapes: any = '';
  userProfile = null;
  uploadedMediaFiles = null;
  selectTask:any;
   @Input() studentProfile: any;
  constructor(private service: TopgradserviceService,
     private router: Router, private sanitizer: DomSanitizer,private fileIconService: FileIconService) { }
  getSafeSvg(documentName: string) {
    return this.fileIconService.getFileIcon(documentName);
    } 
  ngOnInit(): void {
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.userProfile.placement_id = this.studentProfile.placement_id;
    this.userProfile.placement_type = this.studentProfile.placement_type;
    this.userProfile.company_allocation = this.studentProfile.company_allocation;
    this.getWorkFlowTask();
  }

  getWorkFlowTask() {
    const payload = {
      placement_id: this.studentProfile?.placement_id,
      stage: "Post-Placement",
      student_id: this.userProfile?._id,
      workflow_type_id: this.studentProfile?.placement_type_id
    }
    this.service.getProjectStudentWorkFlowTask(payload).subscribe((response: any) => {
      this.postPlacementWorkFlow = response.result ? response.result : [];
      let count = 0;
      for (const task of this.postPlacementWorkFlow) {
        if (count > 0) {
          if (task.task_status === 'lock' && this.postPlacementWorkFlow[count-1].task_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
            task.task_status = "pending"; 
          }
        }
        count++;
      }
      this.postPlacementWorkFlow =  this.postPlacementWorkFlow.map(task => ({
        ...task,
        safeVideoUrl: task.video_url
          ? this.getVideoUrl(task.video_url)
          : null
      }));
      this.postPlacementWorkFlow.forEach(workflow => {
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

  goToStudentForm(task) {
    this.router.navigate(['/student/project-student-form'], { queryParams: {taskId: task._id,stage:'post-placement', placement_id:task.placement_id,vacancy_id: this.studentProfile?.vacancy_id,
      company_id: this.studentProfile?.company_id, id:this.studentProfile?._id}});
  }

  uploadFile(event: Event, task: any) {
    const input = event.target as HTMLInputElement;
    const fileList = input.files;

    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList); // Convert FileList to array
    task.file = []; // Initialize as array

    for (const file of filesArray) {
      if (file.size > 5000971) { // ~5 MB
        this.service.showMessage({
          message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
        });
        input.value = ''; // Clear input so user can reselect
        return;
      }

      const formData = new FormData();
      formData.append('media', file);

      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
         task.file = resp;  // Append each file upload response
      });
    }

    input.value = ''; // Clear input after all processing
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
      document_types: task.document_types,
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

