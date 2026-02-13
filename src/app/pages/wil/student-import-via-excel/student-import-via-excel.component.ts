import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { Router } from '@angular/router';
import { HttpEventType } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-student-import-via-excel',
  templateUrl: './student-import-via-excel.component.html',
  styleUrls: ['./student-import-via-excel.component.scss']
})
export class StudentImportViaExcelComponent implements OnInit {
  eligibleStudentList = [
    {
      name: '',
      last_name: '',
      major: '',
      priority: '',
      status: '',
      workflow: '',
    },
  ]
  studentList = [
    {
      schoolName: '',
      homeCampus: '',
      studentCode: '',
      displayName: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      courseCode: '',
      courseName: '',
      coursStartDate: '',
      coursEndDate: '',
      subjectStatus: '',
      nationality: '',
      email: '',
      addressLine1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      mobile: '',
      tentativeStartDate: '',
      internshipStartDate: '',
      internshipEndDate: '',
      semesterName: '',
      year: '',
      subjectCode: '',
      subjectName: '',
      userName: '',
    },
    {
      schoolName: '',
      homeCampus: '',
      studentCode: '',
      displayName: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      courseCode: '',
      courseName: '',
      coursStartDate: '',
      coursEndDate: '',
      subjectStatus: '',
      nationality: '',
      email: '',
      addressLine1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      mobile: '',
      tentativeStartDate: '',
      internshipStartDate: '',
      internshipEndDate: '',
      semesterName: '',
      year: '',
      subjectCode: '',
      subjectName: '',
      userName: '',
    },
    {
      schoolName: '',
      homeCampus: '',
      studentCode: '',
      displayName: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      courseCode: '',
      courseName: '',
      coursStartDate: '',
      coursEndDate: '',
      subjectStatus: '',
      nationality: '',
      email: '',
      addressLine1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      mobile: '',
      tentativeStartDate: '',
      internshipStartDate: '',
      internshipEndDate: '',
      semesterName: '',
      year: '',
      subjectCode: '',
      subjectName: '',
      userName: '',
    },
    {
      schoolName: '',
      homeCampus: '',
      studentCode: '',
      displayName: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      courseCode: '',
      courseName: '',
      coursStartDate: '',
      coursEndDate: '',
      subjectStatus: '',
      nationality: '',
      email: '',
      addressLine1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      mobile: '',
      tentativeStartDate: '',
      internshipStartDate: '',
      internshipEndDate: '',
      semesterName: '',
      year: '',
      subjectCode: '',
      subjectName: '',
      userName: '',
    },
    {
      schoolName: '',
      homeCampus: '',
      studentCode: '',
      displayName: '',
      first_name: '',
      last_name: '',
      gender: '',
      dob: '',
      courseCode: '',
      courseName: '',
      coursStartDate: '',
      coursEndDate: '',
      subjectStatus: '',
      nationality: '',
      email: '',
      addressLine1: '',
      suburb: '',
      state: '',
      postcode: '',
      country: '',
      mobile: '',
      tentativeStartDate: '',
      internshipStartDate: '',
      internshipEndDate: '',
      semesterName: '',
      year: '',
      subjectCode: '',
      subjectName: '',
      userName: '',
    },
    
  ];

  displayStudentColumns: string[]=[
  // 'checkbox',
  'student_id',
  'student_code',
  // 'full_name',
  'first_name',
  'middle_name',
  'last_name',
  'preferred_name',
  'username',
  'phone_no',
  'advocate_care_history',
  'degree_level',
  'majors',
  'class_level',
  'minors',
  'gpa',
  'credit_points',
  'unit_name',
  'unit_code',
  'delivery_mode',
  'work_authorization',
  // 'program_type',
  'applicant_type',
  'geographic_preferences',
  'affiliations',
  'assignedTo',
  // 'priority',
  // 'status',
  // 'placement_group',
  'cohort_start_date',
  'cohort_end_date',
  'certificates',
  'home_campus',
  // 'resume_level',
  // 'placement_doc_status',
  'primaryEmail',
  'permanent_email',
  'gender',
  'date_of_birth',
  'course_code',
  'graduation_date',
  'course_name',
  'address',
  'nationality',
  'addressLine1',
  'suburb',
  'state',
  'postcode',
  'country',
  'mobile',
  'permanentAddress',
  'permanent_suburb',
  'permanent_state',
  'permanent_country',
  'language_proficiencies',
  'rights',
  // 'internship_start_date',
  // 'internship_end_date',
  'semester_name',
  'year',
  'alum',
  'advocate_incident_history',
  'accommodate_accessibility',
  // 'ABN',
  // 'last_login',
  // 'lastupdatedby',
  // 'lastupdate',
  // 'actions'
]
  
  // ['school_name',
  // 'home_campus',
  // 'student_code',
  // 'display_name',
  // 'first_name',
  // 'last_name',
  // 'gender',
  // 'date_of_birth',
  // 'course_code',
  // 'course_name',
  // 'course_start_date',
  // 'course_end_date',
  // 'subject_status',
  // 'nationality',
  // 'email',
  // 'address_line_01',
  // 'suburb',
  // 'state',
  // 'post_code',
  // 'country',
  // 'mobile',
  // 'tentative_start_date',
  // 'internship_start_date',
  // 'internship_end_date',
  // 'semester_name',
  // 'year',
  // 'subject_code',
  // 'subject_name',
  // 'user_name',]
  eligibleStudentListDisplayedColumns: string[]=['name', 'last_name', 'major', 'priority', 'status', 'workflow']
  dataSource: MatTableDataSource<any>;

  fileName: any;
  file: any;
  @Input() placementGroupId;
  @Output() studentUpdates = new EventEmitter();
  uploadId = "";
  isErrorExistInFile = false;

  constructor(
    private service: TopgradserviceService,
    private router: Router
    ) { }
 
  ngOnInit(): void {
  }

  returnBack() {
    this.studentUpdates.emit('back');
  }


  isLoading: boolean = false;  // Loader state
  uploadProgress: number = 0;  // To track upload progress


  getFile(event, stepper: MatStepper) {
    this.fileName = event.target.files[0]?.name;
    this.uploadStudentsByExcel(event, stepper);
    event.target.value = "";
  }

  uploadStudentsByExcel(event, stepper: MatStepper) {
    const formData = new FormData();
    formData.append('students', event.target.files[0]);
    if (this.router.url.indexOf("students-list") == -1) {
      formData.append('placement_id', this.placementGroupId);
    }
  
    this.isErrorExistInFile = false;
    this.isLoading = true;  // Start loader
    this.uploadProgress = 0;  // Reset progress to 0

    this.service.addNewStudentsViaExcel(formData).subscribe((response: any) => {

      
      if (response.type === HttpEventType.UploadProgress) {
        this.uploadProgress = Math.round((100 * event.loaded) / event.total);
      }

      
      if (response.status == HttpResponseCode.SUCCESS) {
        this.service.updateData({placement_id: this.placementGroupId});
        this.isLoading = false; 
        this.service.showMessage({message: response.msg});
      
      }
      this.uploadId = response.upload_id;
      this.isErrorExistInFile = false;
      this.getUploadedStudensList();
      stepper.next();
    }, err => {
      this.isLoading = false;
      this.isErrorExistInFile = true;
      this.fileName = "";
      if (err?.status === 600) {
      //  const element = document.getElementById("errorPopup");
      //  element.click();
        this.service.showMessage({
          message: 'No new data found in the CSV file.'
        });
      } else {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      }
    });
  }

  getUploadedStudensList() {
      const payload = {
        upload_id: this.uploadId
      }
      this.service.getAllUploadedStudents(payload).subscribe((response: any) => {
        if (response.status == HttpResponseCode.SUCCESS) {
          this.studentList = response.result;
        }
      });
  }

  confirm() {
    const payload = {
      upload_id: this.uploadId
    }
    this.service.approveUploadedStudents(payload).subscribe((response: any) => {
      this.studentUpdates.emit("confirm");
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    });
  }

  downloadStudentTemplate() {
    this.service.downloadStudentTemplate();
  }
    getFirstLetter(assignedTo) {
    if (assignedTo) {
      let split = assignedTo.split(' ');
      let firstName = split[0];
      let lastName = split[1];
      return `${firstName.charAt(0)} ${lastName.charAt(0)}`;
    }
  }

}
