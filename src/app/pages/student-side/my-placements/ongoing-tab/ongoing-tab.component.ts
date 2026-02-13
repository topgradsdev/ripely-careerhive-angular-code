import { Component, Input, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { Router } from '@angular/router';
// import { Label } from 'ng2-charts';
import moment from 'moment';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FileIconService } from '../../../../shared/file-icon.service';

@Component({
  selector: 'app-ongoing-tab',
  templateUrl: './ongoing-tab.component.html',
  styleUrls: ['./ongoing-tab.component.scss']
})
export class OngoingTabComponent implements OnInit {

  showCollapes: any = '';
  currentTaskTab: any = 'task_progress';
  onGoingPlacementWorkFlow = [];
  showDetails: boolean;
  userProfile = null;
  uploadedMediaFiles = null;
  studentVacancyDetail = null;
  @Input() studentProfile: any;
  selectTask:any;

  public overviewLineChartType = 'line';
  public overviewLineChartData: any = [
    {
      label: 'Working Hours',
      data: [],
      // tension: 0,
      fill: false,
      borderColor: '#464BA8',
      borderWidth: 3,
      pointBorderWidth: 0,
      pointBackgroundColor: '#464BA8',
      pointHoverBorderColor: '#464BA8',
      pointHoverBackgroundColor: '#464BA8',
      pointStyle: 'circle',
      pointRadius: 10,
      pointHoverRadius: 12,
    }
  ];

  public overviewLineChartLegend = false
  public overviewLineChartLabels: any[] = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12'];
  public overviewLineChartOptions: any = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: (ctx) => 'Point Style: ' + ctx.chart.data.datasets[0].pointStyle,
      }
    },
    scales: {

      yAxes: [{
        ticks: {
          beginAtZero: true,
          max: 25,
          stepSize: 5
        }
      }

      ],
      xAxes: [{
        gridLines: {
          borderDash: [6, 6],
          lineWidth: 1,
          color: "rgb(70 75 168 / 50%)",
        },
      }]

    },
  };

  workingHoursDetail = [];
  totalWorkingHours = 0;
  completedWorkingHours = 0;
  completedTaskCountOfOngoing = 0;
  pendingTaskOfOngoing = [];

  constructor(private service: TopgradserviceService,
    private router: Router, private sanitizer: DomSanitizer, private fileIconService: FileIconService) { }
 getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }
  async ngOnInit() {
    this.userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    // this.userProfile.placement_id = this.studentProfile?.placement_id;
    // this.userProfile.placement_type = this.studentProfile?.placement_type;
    if (typeof this.studentProfile.placement_type === 'string') {
      this.studentProfile.placement_type = {
        name: this.studentProfile?.placement_type,
        placementType:this.studentProfile?.placementType,
        placement_type_id: this.studentProfile?.placement_type_id,
      };
    } else if (typeof this.studentProfile.placement_type === 'object') {
      this.studentProfile.placement_type.placement_type_id = this.studentProfile?.placement_type_id;
      this.studentProfile.placement_type.placementType = this.studentProfile?.placementType;
    }
    this.userProfile.company_allocation = this.studentProfile?.company_allocation.sort((a, b) => {
  if (a.status === 'Placed' && b.status !== 'Placed') return -1;
  if (a.status !== 'Placed' && b.status === 'Placed') return 1;
  return 0; // keep original order for others
});
    await this.getWorkFlowTask();
    this.getOngoingStudentVacancyDetail();
    this.getWorkingHourForStudent();
  }

  changeTaskTab(e: any) {
    this.currentTaskTab = e;
  }

  getOngoingStudentVacancyDetail() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id,
      workflow_type_id: this.userProfile?.placement_type?.placement_type_id
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

  loader:boolean = true

  async getWorkFlowTask() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      stage: "Ongoing",
      student_id: this.userProfile?._id,
      workflow_type_id: this.userProfile?.placement_type?.placement_type_id
    }
    this.service.getWorkFlowTask(payload).subscribe((response: any) => {
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
      this.completedTaskCountOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'completed')?.length;
      this.pendingTaskOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
      this.onGoingPlacementWorkFlow.forEach(workflow => {
        workflow.showCollapes = false;
      });

      this.onGoingPlacementWorkFlow =  this.onGoingPlacementWorkFlow.map(task => ({
        ...task,
        safeVideoUrl: task.video_url
          ? this.getVideoUrl(task.video_url)
          : null
      }));
       this.loader = false;
    }, (err)=>{
       this.loader = false;
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
//   taskStatus(status, item: any): string {
//   // 1. Locked
//   if (item.status === 'lock') {
//     return 'Locked';
//   }

//   if (item && item.student_status !== 'completed' && item.form_status === 'save') {
//     return 'In Progress';
//   }
//   // 2. Pending
//   if (item.completed_step_count === 0) {
//     return 'Pending';
//   }

//   // 3. Completed
//   if (item.employee_status === 'completed' &&
//       item.student_status === 'completed' &&
//       item.staff_status === 'completed') {
//     return 'Completed';
//   }


//   // 4. Handle Submit Flow
//   if (item.form_status === 'submit') {
//     const criteria = item?.additional_criteria_status?.toLowerCase() || '';

//     // Employer → Student → Staff
//     if (criteria.includes('employer') && criteria.includes('student') && criteria.includes('staff')) {
//       console.log("come");
//       if (item.student_status !== 'completed') {
//         return 'Pending';
//       }
//       if (item.employee_status !== 'completed') {
//         return 'Awaiting Approval';
//       }
//       if (item.staff_status !== 'completed') {
//         return 'Awaiting Approval'; // ✅ waiting for staff
//       }
//       return 'Completed';
//     }

//     // Student → Staff
//     if (criteria.includes('student') && criteria.includes('staff') && !criteria.includes('employer')) {
//        console.log("come student");
//       if (item.student_status !== 'completed') {
//         return 'Pending';
//       }
//       if (item.staff_status !== 'completed') {
//         return 'Awaiting Approval';
//       }
//       return 'Completed';
//     }

//     // Employer only
//     if (criteria.includes('employer') && !criteria.includes('student') && !criteria.includes('staff')) {
//       return item.employee_status === 'completed' ? 'Completed' : 'In Progress';
//     }

//     // Student only
//     if (criteria.includes('student') && !criteria.includes('employer') && !criteria.includes('staff')) {
//       return item.student_status === 'completed' ? 'Completed' : 'In Progress';
//     }
//   }

//   // Default
//     const taskStatus = {
//     lock: "Locked",
//     pending: "In Progress",
//     completed: "Completed"
//   }
//   return taskStatus[status];
// }

  showHide() {
    this.showDetails = !this.showDetails;
  }

  collapsToggle(task: any) {
    task.showCollapes = !task.showCollapes
  }

  async goToStudentForm(task) {
    this.onGoingPlacementWorkFlow

    let count = 0;
    await this.onGoingPlacementWorkFlow.map(el=>{
      if(el.task_status=="pending"){
        count++;
      }
    })
    this.router.navigate(['/student/student-form'], { queryParams: { taskId: task._id , isLast:count, stage: 'ongoing'}  });
  }
uploadFile(event: Event, task: any) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Initialize task.file as an array
  task.file = [];

  for (const file of filesArray) {
    if (file.size > 5000971) { // ~5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });

      input.value = ''; // Clear input so same file can be selected again
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
     task.file = resp;  // Add response to file array
    });
  }

  // ✅ Clear the input after processing
  input.value = '';
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
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id,
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
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id
    }
    this.service.getSubmittedWorkFlowTask(payload).subscribe((response: any) => {
      if (response?.result?.attachments) {
        window.open(response?.result?.attachments?.url, '_blank');
      }
    });
  }

  getWorkingHourForStudent() {
    const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id
    }
    this.service.getWorkingHourForStudent(payload).subscribe((response: any) => {
      this.workingHoursDetail = response.result ? response?.result : [];
      this.totalWorkingHours = response?.result?.total_working_hours ? response?.result?.total_working_hours : 0;
      this.overviewLineChartData[0].data = [];
      this.workingHoursDetail.map(workingHour => parseInt(workingHour.working_hours));
      this.workingHoursDetail.forEach(workingHour => {
        this.completedWorkingHours = this.completedWorkingHours + parseInt(workingHour.working_hours);
        let currentDate: any = moment().format("YYYY-MM-DD");
        currentDate = moment(currentDate, "YYYY-MM-DD").valueOf();
        const startDate = moment(workingHour.start_date, "YYYY-MM-DD").valueOf();
        const endDate = moment(workingHour.end_date, "YYYY-MM-DD").valueOf();
        workingHour.isCurrentWeek = false;
        workingHour.isNextWeeks = false;
        if (currentDate >= startDate && currentDate <= endDate) {
          workingHour.isCurrentWeek = true;
          this.overviewLineChartData[0].data.push(parseInt(workingHour.working_hours));
        } else if (startDate >= currentDate && endDate >= currentDate) {
          workingHour.isNextWeeks = true;
        } else {
          this.overviewLineChartData[0].data.push(parseInt(workingHour.working_hours));
        }
      });
    });
  }

  submitStudentWorkingHours(workingHour) {
     const payload = {
      placement_id: this.userProfile?.placement_id,
      student_id: this.userProfile?._id,
      vacancy_id: this.userProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.userProfile?.company_allocation[0]?.company_id,
      start_date: workingHour?.start_date,
      end_date:  workingHour?.end_date,
      working_hours:  workingHour?.working_hours
    }
    this.service.submitWorkingHourForStudent(payload).subscribe(res => {
      this.getWorkingHourForStudent();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  

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

  
parseDate(dateStr: string | null | undefined): Date | null {
  if (!dateStr || typeof dateStr !== 'string') {
    // console.error('Invalid date string:', dateStr);
    return null;
  }

  const parts = dateStr.split('/');
  if (parts.length !== 3) {
    // console.error('Date string format should be DD/MM/YYYY:', dateStr);
    return null;
  }

  const [day, month, year] = parts.map(Number);

  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    // console.error('Invalid numeric values in date string:', dateStr);
    return null;
  }

  return new Date(year, month - 1, day); // JS months are 0-indexed
}

 getInternshipDuration(start: string, end: string): string {
  if(start && end){
    const startDate = this.parseDate(start);
      const endDate = this.parseDate(end);

      if (!startDate || !endDate) {
        console.error('Invalid start or end date:', { start, end });
        return 'Invalid date(s)';
      }

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      const weeks = Math.floor(totalDays / 7);
      const days = totalDays % 7;

      const weekStr = weeks === 0 ? '' : `${weeks} week${weeks === 1 ? '' : 's'}`;
      const dayStr = days === 0 ? '' : `${days} day${days === 1 ? '' : 's'}`;

      if (!weekStr && !dayStr) return 'No duration';
      if (weekStr && dayStr) return `${weekStr} and ${dayStr}`;
      return weekStr || dayStr;
    }else{
      return '';
    }
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
      student_name: this.userProfile?.first_name + ' ' + this.userProfile?.last_name
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
   this.router.navigate(['/student/report-incident-student-form'], { queryParams: { stage: 'ongoing',placement_id: this.userProfile?.placement_id, student_id: this.userProfile?._id, vacancy_id:this.userProfile?.company_allocation[0]?.vacancy_id, company_id: this.userProfile?.company_allocation[0]?.company_id, type:'intership'}  });
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

