import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { FileIconService } from 'src/app/shared/file-icon.service';
@Component({
  selector: 'app-employer-support',
  templateUrl: './employer-support.component.html',
  styleUrls: ['./employer-support.component.scss']
})
export class EmployerSupportComponent implements OnInit {

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
  
  constructor(private service: TopgradserviceService, private fb: FormBuilder, private router:Router, private fileIconService:FileIconService) { }

  getSafeSvg(documentName: string) {
    console.log("documentName", documentName);
   return this.fileIconService.getFileIcon(documentName);
  }
  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail") || '{}');
    
    this.userForm = this.fb.group({
      fullName: [
        this.userDetail?.company_name  
          ? `${this.userDetail.company_name}` 
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

  // Optional: reset media array or preserve existing
  this.media = [];

  for (const file of filesArray) {
    if (file.size > 2000971) { // ~2 MB
      this.service.showMessage({
        message: `File "${file.name}" exceeds 2 MB. Please select a smaller file.`
      });
      // Reset file input so user can reselect same file
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('media', file);

    this.service.uploadMedia(formData).subscribe((resp: any) => {
      this.media.push(resp);
    });
  }

  // ✅ Clear file input to allow selecting same file again
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
      sender_type: 'employer',
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
      company_id:this.userDetail?._id
    }

    this.service.getPlcnmtVcncyCompnay(payload).subscribe((res: any) => {   
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
    this.router.navigate(['/employer/ongoing/report-incident-student-form'], { queryParams: { stage: 'dashboard',placement_id: this.placementdata?.placement_id, student_id: this.placementdata?.student_id, vacancy_id:this.placementdata?.vacancy_id, company_id: this.userDetail?._id, type:this.placementdata?.type}  });
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
