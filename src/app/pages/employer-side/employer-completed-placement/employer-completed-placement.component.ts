import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import moment from 'moment';
// import { Label } from 'ng2-charts';

@Component({
  selector: 'app-employer-completed-placement',
  templateUrl: './employer-completed-placement.component.html',
  styleUrls: ['./employer-completed-placement.component.scss']
})
export class EmployerCompletedPlacementComponent implements OnInit {
  studentVacancyDetail = null;
  showDetails: boolean;
  showCollapes: any = '';
  currentTaskTab: any = 'my_task';
  userDetail = null;
  studentNavParam = null;
  searchQuery = "";
  completedPlacementWorkFlow = [];
  days = [
    { name: 'Monday', selected: false },
    { name: 'Tuesday', selected: false },
    { name: 'Wednesday', selected: false },
    { name: 'Thursday', selected: false },
    { name: 'Friday', selected: false }
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

  constructor(private service: TopgradserviceService, private activatedRoute: ActivatedRoute, private router: Router) { 
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.employerPlacementGroupDetail();
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
      contact_person_id: this.userDetail?.contact_person_id,
      stage:"completed",
      type:"internship"
    }
    this.service.getEmployerStudent(payload).subscribe(response => {
      this.employerStudentData = response.result ? response.result : [];
     
      this.employerStudentData.forEach(data => {
        data.showDetails = false;
        data["workFlowTask"] = [];
        this.days.forEach(day => { 
          const found = data?.student_info?.available_days?.split(',').find(days => days === day.name);
          if (found) {
            day.selected = true;
          }
        });
      })

      console.log("this.employerStudentData", this.employerStudentData);
    });
  }

  getWorkFlowTask(payload) {
    return this.service.getEmployerWorkFlowTask(payload).toPromise();
  }

  taskStatus(status) {
    const taskStatus = {
      lock: "Locked",
      pending: "In Progress",
      completed: "Completed"
    }
    return taskStatus[status];
  }

  n = {
    "placement_id": "67576e390fe9fb155a7dde38",
    "student_id": "6736364b847022e410c0d949",
    "vacancy_id": "67363d657c52c627ef927f25"
}
  async showHide(data) {
    console.log("data", data);
    data.showDetails = !data.showDetails;
    this.studentNavParam = {
      placement_id:data.placement_id,
      student_id:data.student_id,
      vacancy_id:data.vacancy_id
    }
    // console.log("this.employerStudentData", this.employerStudentData, data)
    if (data.showDetails) {
      const payload = {
        placement_id: data?.placement_id,
        stage: "Completed",
        student_id: data?.student_id,
        company_id: this.userDetail?._id,
        vacancy_id: data?.vacancy_id,
        workflow_type_id: data?.student_info?.placement_type_id,
      }
      const resultData: any = await this.getWorkFlowTask(payload);
      data.workFlowTask = resultData?.result ? resultData?.result : [];
      data.workFlowTask.forEach(workflow => {
        workflow.showCollapes = false;
      });
      let count = 0;
      for (const task of data.workFlowTask) {
        if (count > 0) {
          if (task.employee_status === 'lock' && data.workFlowTask[count-1].employee_status === 'completed' && task.unlock_task_on_status === 'Completion of Previous Task') {
             task.employee_status = "pending"; 
          }
        }
        count++;
      }
      this.getWorkingHourForStudent(data);  
    }
  }

  collapsToggle(task: any) {
    task.showCollapes = !task.showCollapes
  }

  goToStudentForm(task) {
    this.router.navigate(['/employer/placements/employer-student-form'], { queryParams: { taskId: task._id, studentNavParam: JSON.stringify(this.studentNavParam), tab:'completed', type:'internship' } });
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

      // Clear input and stop further processing
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      task.file = resp; // Push instead of overwrite
    });
  }

  // ✅ Clear the input to allow re-uploading the same file
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
      workflow_type_id: task?.student_info?.placement_type_id,
      employer_name: this.userDetail?.company_name
    }
    this.service.submitWorkFlowAttachment(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
      this.getWorkFlowTask(payload);
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

  getWorkingHourForStudent(data) {
    const payload = {
      placement_id: data?.placement_id,
      student_id: data?.student_id,
      company_id: this.userDetail?._id,
      vacancy_id: data?.vacancy_id
    }
    this.service.getWorkingHourForStudent(payload).subscribe((response: any) => {
      this.workingHoursDetail = response.result ? response?.result : [];
      this.totalWorkingHours = response?.result?.total_working_hours ? response?.result?.total_working_hours : 0;
      this.overviewLineChartData[0].data = [];
      this.workingHoursDetail.map(workingHour => parseInt(workingHour.working_hours));
      this.workingHoursDetail.forEach(workingHour => {
        this.completedWorkingHours = this.completedWorkingHours + parseInt(workingHour.working_hours);
        const currentDate = moment().valueOf();
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
      this.getWorkFlowTask(payload);
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
      this.getWorkFlowTask(payload);
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
