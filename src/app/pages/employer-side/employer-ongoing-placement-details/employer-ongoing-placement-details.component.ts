import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-employer-ongoing-placement-details',
  templateUrl: './employer-ongoing-placement-details.component.html',
  styleUrls: ['./employer-ongoing-placement-details.component.scss']
})
export class EmployerOngoingPlacementDetailsComponent implements OnInit {
  studentVacancyDetail = null;
  showDetails: boolean;
  showCollapes: any = '';
  currentTaskTab: any = 'my_task';
  userDetail = null;
  studentNavParam = null;
  onGoingPlacementWorkFlow = [];
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false },
     { name: 'Saturday', selected: false },
    { name: 'Sunday', selected: false }
  ];
  employerStudentData = null;

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

  constructor(private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router) {
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.activatedRoute.queryParams.subscribe(params => {
      if (params?.student_id) {
        this.studentNavParam = params;
        this.employerPlacementGroupDetail();
      }
    });
  }

  ngOnInit(): void {
  }
  changeTaskTab(e: any) {
    this.currentTaskTab = e;
  }

  employerPlacementGroupDetail() {

    const payload = {
      // placement_id: this.userDetail?.placement_id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
      student_id: this.studentNavParam?.student_id,
      type:"internship"
    }
    this.service.getEmployerStudentById(payload).subscribe(response => {
      this.employerStudentData = response.result;
      console.log("this.employerStudentData", this.employerStudentData);
      this.days.forEach(day => {
        const found = this.employerStudentData?.working_hours_info?.[0]?.internship_days?.split(',').find(days => days === day.name);
        if (found) {
          day.selected = true;
        }
      });
      this.getWorkFlowTask();
      this.getWorkingHourForStudent();
    });
  }

  async getWorkFlowTask() {
    this.onGoingPlacementWorkFlow = [];
    const payload = {
      placement_id: this.employerStudentData?.placement_id,
      stage: "Ongoing",
      student_id: this.studentNavParam?.student_id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
      workflow_type_id: this.employerStudentData?.student_info?.placement_type_id,
    }
    this.service.getEmployerWorkFlowTask(payload).subscribe((response: any) => {
      this.onGoingPlacementWorkFlow = response.result ? response.result : [];
      let count = 0;
      for (const task of this.onGoingPlacementWorkFlow) {
        if (count > 0) {
          if (task.employee_status === 'lock' && this.onGoingPlacementWorkFlow[count - 1].employee_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
            task.employee_status = "pending";
          }
        }
        count++;
      }
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

  goToStudentForm(task) {
    console.log("this.studentNavParam", this.studentNavParam);
    this.router.navigate(['/employer/placements/employer-student-form'], { queryParams: { taskId: task._id, studentNavParam: JSON.stringify(this.studentNavParam), tab:'ongoing', vacancy_type:'internship'  } });
    // this.router.navigate(['/employer/ongoing/employer-student-form'], { queryParams: { taskId: task._id, studentNavParam: JSON.stringify(this.studentNavParam), tab:'ongoing', vacancy_type:'internship'  } });
  }

 uploadFile(event: Event, task: any) {
  const input = event.target as HTMLInputElement;
  const fileList = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Initialize task.file as array
  task.file = [];

  for (const file of filesArray) {
    if (file.size > 5000971) { // ~5 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 5 MB. Please select a smaller file.`
      });
      input.value = ''; // Clear input if rejected
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      task.file = resp; // Add uploaded file response to array
    });
  }

  // ✅ Clear file input to allow re-uploading same file again
  input.value = '';
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
      this.getWorkFlowTask();
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

  getWorkingHourForStudent() {
    const payload = {
      placement_id: this.employerStudentData?.placement_id,
      student_id: this.studentNavParam?.student_id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
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
      placement_id: this.employerStudentData?.placement_id,
      student_id: this.studentNavParam?.student_id,
      vacancy_id: this.studentNavParam?.vacancy_id,
      company_id: this.userDetail?._id,
      start_date: workingHour?.start_date,
      end_date: workingHour?.end_date,
      working_hours: workingHour?.working_hours
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

  attend(task){
    const payload = {
      placement_id: this.userDetail?.placement_id,
      student_id: this.studentNavParam?.student_id,
      task_id: task._id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
      employee_status: "completed",
      task_status: "completed",
      type: 'employee',
      appointment_url: task.appointment_url,
      document_types: task?.document_types,
      workflow_type_id: task?.student_info?.placement_type_id,
      employer_name: this.userDetail?.company_name
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
      placement_id: this.userDetail?.placement_id,
      student_id: this.studentNavParam?.student_id,
      task_id: task._id,
      company_id: this.userDetail?._id,
      vacancy_id: this.studentNavParam?.vacancy_id,
      employee_status: "completed",
      task_status: "completed",
      type: 'employee',
      event_url: task.event_url,
      document_types: task?.document_types,
      workflow_type_id: task?.student_info?.placement_type_id,
      employer_name: this.userDetail?.company_name
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
