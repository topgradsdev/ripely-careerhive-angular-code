import { Component, OnInit } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-view-user-super-admin',
  templateUrl: './view-user-super-admin.component.html',
  styleUrls: ['./view-user-super-admin.component.scss']
})
export class ViewUserSuperAdminComponent implements OnInit {
  showPs: boolean;
  pass: String = 'password'
  cpass: String = 'password'
  newpass: String = 'password'
  userProfileForm: FormGroup;
  resetPasswordForm: FormGroup;
  navigateFrom = null;
  selectedAdminId = null;
  userProfile = null;
  activityLogs = [];
  loggedInUserDetail = null;
  password = null;
  constructor(private service: TopgradserviceService, private fb: FormBuilder,
     private activatedRoute: ActivatedRoute, private router: Router) {
    this.loggedInUserDetail = JSON.parse(localStorage.getItem('userDetail'));
    this.selectedAdminId = this.loggedInUserDetail?._id;
  }
  searchKeyword:any = '';
    filteredActivities() {
      const keyword = this.searchKeyword.trim().toLowerCase();
      if (!keyword) return this.activityLogs;

      return this.activityLogs
        .map((activity) => {
          // Match at parent level (module/sub_module)
          const matchesParent =
            activity.module?.toLowerCase().includes(keyword) ||
            activity.sub_module?.toLowerCase().includes(keyword);

          // Filter inner activities
          const filteredSub = activity.activities.filter((a) =>
            a.activity.toLowerCase().includes(keyword)
          );

          // Include the item only if parent or child matches
          if (matchesParent || filteredSub.length > 0) {
            return { ...activity, activities: filteredSub.length ? filteredSub : activity.activities };
          }

          return null;
        })
        .filter((a) => a !== null);
    }

  ngOnInit(): void {
    this.userProfileForm = this.fb.group({
      first_name: [""],
      last_name: [""],
      phone: [''],
      secondary_phone: [''],
      email: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      secondary_email: ['', [Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$')]],
      image: ['']
    });

    this.resetPasswordForm = this.fb.group({
      password: ['',[Validators.required]],
      newPassword:['',[Validators.required,Validators.pattern(
       /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
      ),]],
      confirmPassword:['',[Validators.required]]
    }, {
      validator: this.checkPasswords,
    });
    this.getAdminDetail();
    this.getActivityLogs();
    this.getNotes(this.notepage);
  }

  limit = 10;          // number of records per load
offset = 0;          // current offset
activitLimit = 0;    // total records in backend
isLoading = false;   // prevent multiple calls
// activityLogs: any[] = [];


allActivityLogs: any[] = [];  // full dataset from API


onSearchChange() {
  // Reset scroll & data
  this.activityLogs = [];
  this.allActivityLogs = [];
  // Fetch new data with search filter
  this.getActivityLogs();
}



onScrollDown() {
  // stop if already loading or all data shown
  if (this.isLoading) return;
  if (this.activityLogs.length >= this.allActivityLogs.length) return;
  this.loadMore();
}

getActivityLogs() {
  this.isLoading = true;

  const payload: any = {
     admin_id: this.selectedAdminId,
  };

  if (this.searchKeyword?.trim()) payload.search = this.searchKeyword.trim();

  this.service.getActivityLogs(payload).subscribe({
    next: (res) => {
      if (res.status === HttpResponseCode.SUCCESS) {
        // store full data (all records from API)
        this.allActivityLogs = res.result || [];

        // initialize visible list with first 20
        this.activityLogs = this.allActivityLogs.slice(0, this.limit);
      }
      this.isLoading = false;
    },
    error: (err) => {
      this.isLoading = false;
      this.service.showMessage({
        message:
          err.error?.errors?.msg ||
          'Something went wrong while loading activities',
      });
    },
  });
}

loadMore() {
  this.isLoading = true;
  const nextItems = this.allActivityLogs.slice(
    this.activityLogs.length,
    this.activityLogs.length + this.limit
  );

  // append next 20 items
  this.activityLogs = [...this.activityLogs, ...nextItems];

  this.isLoading = false;
}


  getAdminDetail() {
    const payload = {
      admin_id: this.selectedAdminId
    }
    this.service.getAdminById(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.userProfile = res.result;
        // if(!this.userProfile.image){
        //     this.userProfile.image = '../../../assets/img/graduate_login_img.png'
        // }
        this.userProfileForm.patchValue(this.userProfile);
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

  checkPasswords(group: FormGroup) {
    let pass = group.controls.newPassword.value;
    let confirmPass = group.controls.confirmPassword.value;
    var flag = false
    let returnable: any = {
      pwdNotSame: null,
    }
    if (pass != confirmPass) {
      returnable.pwdNotSame = true
      flag = true
    }
    return flag ? returnable : null;
  }

  showPassword() {
    this.showPs = !this.showPs;
  }

  onEyeClick(field: any, type: any) {
    if (field == 'pass') {
      this.pass = type
    }
  }

  onEyeClickNew(field: any, type: any) {
    if (field == 'pass') {
      this.newpass = type
    }
  }
  onEyeClickC(field: any, type: any) {
    if (field == 'pass') {
      this.cpass = type
    }
  }

  getFile(event) {
    const formData = new FormData();
    formData.append('media', event.target.files[0]);
    this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
      this.userProfileForm.patchValue({
        image: resp.url
      });
    });
    event.target.value = "";
  }

  checkValidPassword() {
    const userDetail = JSON.parse(localStorage.getItem('userDetail'));
    const payload = {
      email_id: userDetail?.email,
      password: this.password
    }
    return this.service.confirmPassword(payload).toPromise().catch((error) => {
      this.service.showMessage({message: error?.error?.errors?.msg});
    });
  }

  async updateAdminProfile(type?) {
    if (type =='email') {
      const isPasswordValid = await this.checkValidPassword();
      if (isPasswordValid?.result !== 'success') {
        return true;
      }
    }

    if (this.userProfileForm.invalid) {
      this.userProfileForm.markAllAsTouched();
      return;
    }
    const payload = {
      ...this.userProfileForm.value,
      admin_id: this.selectedAdminId
    }

    this.service.updateAdminProfile(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Admin profile updated successfully"
        });
        this.getAdminDetail();
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

  updateAdminPassword() {
    if (this.userProfileForm.invalid) {
      this.userProfileForm.markAllAsTouched();
      return;
    }
    const payload = {
      password: this.resetPasswordForm.value.newPassword,
      old_password: this.resetPasswordForm.value.password,
      admin_id: this.selectedAdminId
    }

    this.service.resetpassword(payload).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.service.showMessage({
          message: "Admin password updated successfully"
        });
        localStorage.clear();
        this.router.navigate(['login']);
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

  addSpacesInNumber() {
    this.userProfileForm.controls.phone.patchValue(this.userProfileForm.value.phone.replace(/[^\dA-Z]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ').trim());
    this.userProfileForm.controls.secondary_phone.patchValue(this.userProfileForm.value.secondary_phone.replace(/[^\dA-Z]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ' ').trim());
  }

  goToUserDetail() {

  }


  addnote:boolean = false;
  note:any = '';
  selectedNode:any 
  deleteNote(id){
   
    let body = {
      "_id": id,
    }
    this.service.deleteAdminNote(body).subscribe(res => {
      if (res.status == 200) {
        this.addnote = false;
        this.getNotes(this.notepage);
        this.selectedNode = null;
      } else {
        this.service.showMessage({ message: res.msg });
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }

  notepage:any = 0;
  notelimit:any = 5;
  totalNotes:any = 0
  totalNoteList:any = 0
  noteList:any = [];
  getNotes(page){
    let userDetail:any = JSON.parse(localStorage.getItem('userDetail'));
    this.notepage = page;
    this.notelimit = 5;
    let body = {
      "admin_id": userDetail._id,
      "limit": this.notelimit,
      "offset": page,
     }
    this.service.getAdminNote(body).subscribe(res => {

      console.log("res", res);
      if (res.status == 200) {
        // this.addnote = false
        if(res.count <= this.notelimit){
          this.notelimit = res.count;
        }

        // let totalPages_pre = (res.count/this.notelimit)
        // this.totalNotes = (search.total % page_size) == 0 ? totalPages_pre : totalPages_pre + 1
        this.totalNoteList = res.count;
        this.totalNotes = Math.ceil(res.count/this.notelimit);
        console.log(" this.totalNotes",  this.totalNotes);
        this.noteList  = res.result;
      } else {
        this.noteList  =[];
        // this.totalNoteList =0;
        // this.notelimit =0;
        this.service.showMessage({ message: res.msg });
      }
    }, err => {
      this.noteList  = [];
      this.service.showMessage({
        message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
      })

    }
    );
  }
  
  createNote(){
    if(!this.note){
      this.service.showMessage({ message: "Note Required!" });
      return false;
    }
    let userDetail:any = JSON.parse(localStorage.getItem('userDetail'));

    if(this.selectedNode){
      let body = {
        "_id": this.selectedNode._id,
        "created_by": userDetail._id,
        "description": this.note ,
        "admin_id": userDetail._id,
       }
      this.service.updateAdminNote(body).subscribe(res => {
        if (res.status == 200) {
          this.note = '';
          this.selectedNode = null;
          this.getNotes(this.notepage);
          this.service.showMessage({ message: res.msg });
          // this.closeResendOTPEmailModal.ripple.trigger.click();
          // this.selectedCompany = {};
  
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
  
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }else{
      let body = {
        "admin_id": userDetail._id,
        "created_by": userDetail._id,
        "description": this.note 
       }

       console.log("body", body)
      this.service.addAdminNote(body).subscribe(res => {
        if (res.status == 200) {
          this.note = '';
          this.getNotes(this.notepage);
          this.selectedNode = null;

          this.service.showMessage({ message: res.msg });
          // this.closeResendOTPEmailModal.ripple.trigger.click();
          // this.selectedCompany = {};
  
        } else {
          this.service.showMessage({ message: res.msg });
        }
      }, err => {
  
        this.service.showMessage({
          message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
        })
  
      }
      );
    }
   

  }


}
