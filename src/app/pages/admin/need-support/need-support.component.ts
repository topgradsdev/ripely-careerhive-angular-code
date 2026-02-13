import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { HttpResponseCode } from '../../../shared/enum';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { SafeHtml } from '@angular/platform-browser';


@Component({
  selector: 'app-need-support',
  templateUrl: './need-support.component.html',
  styleUrls: ['./need-support.component.scss']
})
export class NeedSupportComponent implements OnInit {
  userDetail: any;
  enquiry_subject: string = "";
  enquiry_detail: string = "";
  enquiry_checked: boolean = false;
  dropdown:any = null;
  files = [];
  media = [];
  userForm: FormGroup;
  
  constructor(private service: TopgradserviceService, private fb: FormBuilder, private fileIconService: FileIconService) { 
   
  }
 getSafeSvg(documentName: string): SafeHtml {
   return this.fileIconService.getFileIcon(documentName);
  }
  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userDetail") || '{}');

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
  getFile(event: Event) {
    const input = event.target as HTMLInputElement;
    const fileList: FileList | null = input.files;

    if (!fileList || fileList.length === 0) return;

    const filesArray = Array.from(fileList);

    // Check for oversized files before upload
    for (const file of filesArray) {
      if (file.size > 2000971) { // ~2 MB
        this.service.showMessage({
          message: `File "${file.name}" exceeds 2 MB. Please select a smaller file.`
        });
        // Reset input so the same file can be selected again
        input.value = '';
        return;
      }
    }

    // Ensure this.media is initialized
    this.media = this.media ?? [];

    filesArray.forEach((file) => {
      const formData = new FormData();
      formData.append('media', file);

      this.service.uploadMedia(formData).subscribe((resp: any) => {
        this.media.push(resp);
      });
    });

    // Clear input so the same file can be selected again
    input.value = '';
  }

  removeFile(index) {
    // this.media.splice(index, 1);
    // this.media = this.media.length>0?this.media:[];
     this.service.deleteFileS3({file_url:this.media[index].url}).subscribe(res => {
        if (res.status == HttpResponseCode.SUCCESS) {
          this.media.splice(index, 1);
        } else {
          this.service.showMessage({
            message: res.msg
          });
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
 
  }

  submitAdminEnquiry() {
    const payload = {
      // userId: this.userDetail?._id, 
      sender_name: this.userForm.value.fullName,
      sender_email: this.userForm.value.email,
      sender_type: this.userDetail && this.userDetail.type?this.userDetail.type:'admin',
      priority:this.dropdown,
      is_flagged:this.enquiry_checked,
      subject: this.enquiry_subject,
      message: this.enquiry_detail,
      attachments: this.media
    }

    this.service.submitEnquiry(payload).subscribe((res: any) => {  
      this.enquiry_subject = "";
      this.enquiry_detail = "";
      this.enquiry_checked = false;
      this.dropdown = null;
      this.files = [];
      this.media = [];     
    }, err => {        
      this.service.showMessage({
        message: err.msg ? err.msg : 'Something went Wrong'
      });
      this.enquiry_subject = "";
      this.enquiry_detail = "";
      this.enquiry_checked = false;
      this.dropdown = null;
      this.files = [];
      this.media = [];
    });
  }

}
