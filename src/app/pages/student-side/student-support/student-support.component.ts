import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
@Component({
  selector: 'app-student-support',
  templateUrl: './student-support.component.html',
  styleUrls: ['./student-support.component.scss']
})
export class StudentSupportComponent implements OnInit {

 
  userDetail: any;
  enquiry_subject: string = "";
  enquiry_detail: string = "";
  enquiry_checked: boolean = false;
  dropdown:any = null;
  issue_type:any = null;
  selectedPlacement:any = null;
  placement_issue_type:any = null;
  files = [];
  media = [];
  userForm: FormGroup;
  
  constructor(private service: TopgradserviceService, private fb: FormBuilder, private fileIconService: FileIconService, private router: Router) { }

   getSafeSvg(documentName: string): SafeHtml {
       return this.fileIconService.getFileIcon(documentName);
      }

  ngOnInit(): void {
     this.userDetail = JSON.parse(localStorage.getItem("userSDetail") || '{}');
    
        this.userForm = this.fb.group({
          fullName: [
            this.userDetail?.first_name && this.userDetail?.last_name 
              ? `${this.userDetail.first_name} ${this.userDetail.last_name}` 
              : '',
            [Validators.required, Validators.minLength(3)]
          ],
          email: [
            this.userDetail?.email || '', 
            [Validators.required, Validators.email]
          ]
        });
  }

 getFile(event: Event) {
  const input = event.target as HTMLInputElement;
  const fileList: FileList | null = input.files;

  if (!fileList || fileList.length === 0) return;

  const filesArray = Array.from(fileList);

  // Reset media array
  this.media = [];

  for (const file of filesArray) {
    if (file.size > 2000971) { // ~2 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 2 MB. Please select a smaller file.`
      });
      // Clear the input so user can re-select same file
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.push(resp);
    });
  }

  // ✅ Clear the file input after all uploads
  input.value = '';
}


  removeFile(index) {
    this.media.splice(index, 1);
  }


  onNextStep(stepper: MatStepper) {
    if (this.userForm.valid) {
      console.log("Form Data: ", this.userForm.value);

      // Save data to localStorage or send to API
      // localStorage.setItem("userDetail", JSON.stringify(this.userForm.value));

      // Move to the next step
      stepper.next();
    } else {
      console.log("Form is invalid!");
      this.userForm.markAllAsTouched(); // Show validation errors
    }
  }

  submitEmployerEnquiry() {
    const payload = {
      // userId: this.userDetail?._id, 
      sender_name: this.userForm.value.fullName,
      sender_email: this.userForm.value.email,
      sender_type: this.userDetail && this.userDetail.type?this.userDetail.type:'student',
      priority:this.dropdown,
      is_flagged:this.enquiry_checked,
      subject: this.enquiry_subject,
      message: this.enquiry_detail,
      attachments: this.media,
      placement_id:this.placementdata,
      issue_type:this.issue_type
    }

    this.service.submitEnquiry(payload).subscribe((res: any) => {   
      this.enquiry_subject = "";
      this.enquiry_detail = "";
      this.issue_type = '';
      this.enquiry_checked = false;
      this.dropdown = null;
      this.files = [];
      this.media = [];  
      this.placementdata = null;  
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
      this.enquiry_subject = "";
      this.enquiry_detail = "";
      this.issue_type = '';
      this.enquiry_checked = false;
      this.dropdown = null;
      this.files = [];
      this.media = [];
      this.placementdata = null;
    });
  }

  vacncyList:any = [];
  getPlcnmtVcncyStdnt() {
    if(this.issue_type =="Technical Issue"){
      return false;
    }
    const payload = {
      student_id:this.userDetail?._id
    }

    this.service.getPlcnmtVcncyStdnt(payload).subscribe((res: any) => {   
        console.log("res", res)
        if(res.status==200){
          this.vacncyList = res.result.allVacancies;
        }else{
          this.vacncyList = [];
        }
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
    });
  }

  gotoReportIncident(){
    console.log("data", this.placementdata)
    let userProfile = JSON.parse(localStorage.getItem('userSDetail'));
    this.router.navigate(['/student/report-incident-student-form'], { queryParams: { stage: 'dashboard',placement_id: this.placementdata?.placement_id, student_id: userProfile?._id, vacancy_id:this.placementdata?.vacancy_id, company_id: this.placementdata?.company_id, type:this.placementdata?.type}  });
  }

  placementdata:any = null;
  onPlacementChange(selected: any) {
    console.log("Selected placement:", selected);
    // let find = this.vacncyList.find(el=>el.vacancy_id==selected);
    // if(find){
      this.placementdata = selected;
    // }
  }


}

