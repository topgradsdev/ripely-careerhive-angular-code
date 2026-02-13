import { Component, ViewChild, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';
import moment from 'moment';
import { TopgradserviceService } from '../../../topgradservice.service';
import { Router } from '@angular/router';
import { MatTooltip } from '@angular/material/tooltip';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-view-student-ongoing-placement',
  templateUrl: './view-student-ongoing-placement.component.html',
  styleUrls: ['./view-student-ongoing-placement.component.scss']
})
export class ViewStudentOngoingPlacementComponent implements OnInit {

  showCollapes: any = '';
  currentTaskTab: any = 'task_progress';
  onGoingPlacementWorkFlow = [];
  showDetails: boolean;
  userProfile = null;
  uploadedMediaFiles = null;
  studentVacancyDetail = null;
  @Input() studentProfile: any;


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

  async ngOnChanges() {
    console.log("app-view-student-ongoing-placementapp-view-student-ongoing-placementapp-view-student-ongoing-placement")
    if (this.studentProfile) {
      this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
      await this.getWorkFlowTask();
      this.getOngoingStudentVacancyDetail();
      this.getWorkingHourForStudent();
    }
  }

  constructor(private service: TopgradserviceService,
    private router: Router) { }

   async ngOnInit() {
      // this.userProfile = JSON.parse(localStorage.getItem('userDetail'));
      // if (this.studentProfile) {
      //   await this.getWorkFlowTask();
      //   this.getOngoingStudentVacancyDetail();
      //   this.getWorkingHourForStudent();
      // }
    }

  changeTaskTab(e: any) {
    this.currentTaskTab = e;
  }

  getOngoingStudentVacancyDetail() {
    console.log("this.studentProfile", this.studentProfile);
    const payload = {
      placement_id: this.studentProfile?.placement_id,
      student_id: this.studentProfile?.student_id,
      vacancy_id: this.studentProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.studentProfile?.company_allocation[0]?.company_id
    };
    this.service.getOngoingStudentVacancyDetail(payload).subscribe((response: any) => {
      this.studentVacancyDetail = response.result ? response.result[0] : [];
      if (this.studentVacancyDetail?.is_withdrawal) {
        this.onGoingPlacementWorkFlow.forEach(task => {
          task.toogle = false;
          task.task_status = "lock";
          return task;
        });
      }
    });
  }

  async getWorkFlowTask() {
    console.log("this.studentProfile", this.studentProfile)
    const payload = {
      placement_id: this.studentProfile?.placement_id,
      stage: "Ongoing",
      student_id: this.studentProfile?.student_id,
      workflow_type_id: this.studentProfile?.placement_type?.placement_type_id ?? this.studentProfile?.placement_type_id

    }

    console.log("Payload Ongoing", payload);
    this.service.getWorkFlowTaskStudentOngoing(payload).subscribe((response: any) => {
      this.onGoingPlacementWorkFlow = response.result ? response.result : [];
      // let count = 0;
      // for (const task of this.onGoingPlacementWorkFlow) {
      //   if (count > 0) {
      //     if (task.task_status === 'lock' && this.onGoingPlacementWorkFlow[count-1].task_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
      //       task.task_status = "pending"; 
      //     }
      //   }
      //   count++;
      // }
      // this.completedTaskCountOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'completed')?.length;
      // this.pendingTaskOfOngoing = this.onGoingPlacementWorkFlow.filter(task => task.task_status === 'lock' || task.task_status === 'pending');
      // this.onGoingPlacementWorkFlow.forEach(workflow => {
      //   workflow.showCollapes = false;
      // });
     this.onGoingPlacementWorkFlow.forEach(placement => {
      const tasks = placement.tasks;

      if (!Array.isArray(tasks)) return; // ⛔️ Skip if tasks is undefined or not an array

      tasks.forEach((task, index) => {
        if (
          index > 0 &&
          task.task_status === 'lock' &&
          tasks[index - 1].task_status === 'completed' &&
          task.unlock_task_on_status === 'Completion of Previous Task'
        ) {
          task.task_status = 'pending';
        }
      });

      this.completedTaskCountOfOngoing = tasks.filter(task => task.task_status === 'completed').length;
      this.pendingTaskOfOngoing = tasks.filter(task =>
        task.task_status === 'lock' || task.task_status === 'pending'
      );

      tasks.forEach(task => {
        task.showCollapes = false;
      });
    });

    console.log("this.onGoingPlacementWorkFlow", this.onGoingPlacementWorkFlow, this.completedTaskCountOfOngoing);
    });
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
  task.file = []; // ✅ Initialize as array to hold multiple file responses

  for (const file of files) {
    if (file.size > 5000971) { // ~5MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });
      input.value = ''; // Allow re-selection of same file
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      task.file = resp;  // ✅ Add response to task.file array
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
      employee_status: "pending",
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
      placement_id: this.studentProfile?.placement_id,
      student_id: this.studentProfile?.student_id,
      vacancy_id: this.studentProfile?.company_allocation[0]?.vacancy_id,
      company_id: this.studentProfile?.company_allocation[0]?.company_id
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
          message += "Staff Status: " + capitalizeStatus(el["staff_status"]) + "\n\n";
        }
      });
      // console.log("message", message)
      return message; // Removes trailing newline
  }


  @ViewChild('tooltipRef') tooltip!: MatTooltip;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.tooltip.show();
    }, 500); // delay to ensure view is initialized
  }



  goToCompanyProfile(company, item) {
    console.log("company", company, "item", item);

    this.router.navigate(['/admin/wil/view-company-details'], { queryParams: { company_id: item.company_id } });
  }

}
