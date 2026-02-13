import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxPermissionsService } from 'ngx-permissions';
import Quill from 'quill';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import { HttpResponseCode } from 'src/app/shared/enum';
import { Utils } from 'src/app/shared/utility';

@Component({
  selector: 'app-company-departments',
  templateUrl: './company-departments.component.html',
  styleUrls: ['./company-departments.component.scss']
})
export class CompanyDepartmentsComponent  implements OnInit {
  placementId: any;
  @Input() employerProfile: any;
  createPlacementType: FormGroup;
  renamePlacementType: FormGroup;
  emailReminder: FormGroup;
  rearrange_task: boolean;
  emptyTaskStep: boolean;
  dragging: boolean = false;
 
  allPlacementTypes = [];
  taskOfPlacementType = [];
  taskList = [];
  stepsType = [];
  allPlacementTitle = [];
  selectedTask: any = {}
  workFlowTask = [];
  stepForDelete: any;
  selectedPlacementType: any;
  placementGroupDetails :any = {};
  stage: string = 'Pre-Placement';
  selectedWorkflowType = {
    _id: null,
    type: null,
    workflow_type_id: null,
    placement_id: null,
    student_count: null
  };
  disabledTrackProgress: boolean = false;
  selectedTabIndex: number = 0;
  placementGroupDetail: any;
  categories = [];
  emailTemplateList = [];
  selectedTemplate = null;
  selectedPlacementTypeFromAllPlacement: any = {};
  canAddPlacementType: boolean = true;
  @ViewChild('closeCreatePlacementModal') closeCreatePlacementModal;
  @ViewChild('renamePlacementModal') renamePlacementModal;
  @ViewChild('closeSendEmailModal') closeSendEmailModal;
  @ViewChild('removedepartmentConfirm') removedepartmentConfirm;
  @ViewChild('removedepartmentMessage') removedepartmentMessage;
  @ViewChild('adddepartment') adddepartment;
  @ViewChild('updatedepartment') updatedepartment;
  @ViewChild('removeContactProcess') removeContactProcess;
  @ViewChild('removeContactConfirm') removeContactConfirm;
  @ViewChild('removeContactMessage') removeContactMessage;
  @ViewChild('removeContactMessageSuccess') removeContactMessageSuccess;
  @ViewChild('removeContactMessageUpdateSuccess') removeContactMessageUpdateSuccess;
  @ViewChild('addContact') addContact;
  @ViewChild('replacePerferredContact') replacePerferredContact;
  @ViewChild('removeContactChange') removeContactChange;
  @ViewChild('contactSendOTP') contactSendOTP;

  
  

    contactForm: FormGroup;
   contactList = [];
  addDepartmentForm: FormGroup;
  departmentList:any = [];
  @Input() updatedPlacementDetail: any;
  isWILWritePermission = false;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: TopgradserviceService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log("this.updatedPlacementDetail", this.employerProfile);
     this.getFormBuilder();
    this.addDepartmentForm = new FormGroup({
      department_id: new FormControl('', [Validators.required]),
    })
    this.createPlacementType = new FormGroup({
      placementType: new FormControl('', [Validators.required]),
    })

    // setTimeout(()=>{
    //   this.replacePerferredContact.show();
    // }, 500)

    this.renamePlacementType = new FormGroup({
      placementType: new FormControl('', [Validators.required]),
    })
    this.emailReminder = new FormGroup({
      category_id: new FormControl('', [Validators.required]),
      template_id: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      message: new FormControl('', [Validators.required]),
    });
    // this.getEmailCategories();
    // this.getPlacementGroupDetails();
    // this.getAllTask();
    // this.getPlacementTypes();
    // this.getAllWorkflowTypes();
    this.service.placementGroupDetails.subscribe((data) => {
      this.placementGroupDetails = data;
    })
    this.getDeprtmentbyCompany();
   
   
    this.getdepartmenList();
  

  }

  // getFormBuilder(){
  //    this.contactForm = this.fb.group({
  //     first_name: ["", Validators.required],
  //     last_name: ["", Validators.required],
  //     primary_email: [
  //       "",
  //       [
  //         Validators.required,
  //         Validators.email,
  //         Validators.pattern(
  //           '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$'
  //         ),
  //       ],
  //     ],
  //     secondary_email: [
  //       "",
  //       [
  //         Validators.email,
  //         Validators.pattern(
  //           '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,8}$'
  //         ),
  //       ],
  //     ],
  //     primary_phone: ["", Validators.required],
  //     secondary_phone: [
  //       "",
  //       [
  //         Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/), // Format: 0 123 456 789
  //         Validators.minLength(13), // should match pattern length
  //         Validators.maxLength(13),
  //       ],
  //     ],
  //     // department_id: [null, Validators.nullValidator],
  //     role: ["", Validators.required],
  //     preferred_contact: [false, Validators.nullValidator],
  //     updatedAt: [new Date().toISOString()],
  //     createdAt: [new Date().toISOString()], // ✅ typo fixed from createddAt
  //   });
  // }

  getFormBuilder() {
  this.contactForm = this.fb.group({
    first_name: ["", Validators.required],
    last_name: ["", Validators.required],
    primary_email: [
      "",
      [
        Validators.required,
        Validators.email,
        Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z.]{2,}$'
        ),
      ],
    ],
    secondary_email: [
      "",
      [
        Validators.email,
        Validators.pattern(
          '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z.]{2,}$'
        ),
      ],
    ],
    primary_phone: [
      "",
      [
        Validators.required,
        Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/),
        Validators.minLength(12),
        Validators.maxLength(12),
      ],
    ],
    secondary_phone: [
      "",
      [
        Validators.pattern(/^\d{1}\s\d{3}\s\d{3}\s\d{3}$/),
        Validators.minLength(12),
        Validators.maxLength(12),
      ],
    ],
    role: ["", Validators.required],
    preferred_contact: [false],
    updatedAt: [new Date().toISOString()],
    createdAt: [new Date().toISOString()], // ✅ typo fixed from createddAt
  });
}

isFormFilled(): boolean {
  if (!this.contactForm) return false;

  // Get all form values
  const values = this.contactForm.value;

  // Define which fields must be non-empty
  const requiredFields = [
    'first_name',
    'last_name',
    'role',
    'primary_email',
    'primary_phone'
  ];

  // Check if any required field is empty/null/undefined
  for (const field of requiredFields) {
    const value = values[field];
    if (!value || value.toString().trim() === '') {
      return false;
    }
  }

  return true;
}

    companycontactList: any = [];
    getContactList(id) {
      this.service.getContactList({company_id:id}).subscribe((res:any) => {
      
        if (res.status == HttpResponseCode.SUCCESS) {
          this.companycontactList = res.data;
          this.companycontactList = this.companycontactList.map(c => ({
            ...c,
            fullName: `${c.first_name} ${c.last_name}`
          }));
          this.companycontactList = this.companycontactList.filter(el=>el._id != this.selectedContact._id)
        } else {
            this.companycontactList = [];
        }
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
  


  departmentmasterList: any = []
  getdepartmenList() {
    this.service.getdepartments({}).subscribe((res:any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.departmentmasterList = res.data;
      } else {
          this.departmentmasterList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  addSpacesInNumber(type: 'primary_phone' | 'secondary_phone') {
  const control = this.contactForm.get(type);

  if (!control) return;

  const inputValue = control.value;

  // If empty, clear errors and return
  if (!inputValue) {
    control.setErrors(null);
    return;
  }

  // Remove non-numeric characters
  const rawNumber = inputValue.replace(/[^\d]/g, '');

  // Dynamically format the number with spaces (e.g., 1 234 567 890)
  const formattedNumber = rawNumber.replace(/(\d)(?=(\d{3})+$)/g, '$1 ');

  // Update the form control value with the formatted number
  control.patchValue(formattedNumber.trim(), { emitEvent: false });

  // Validation: Ensure the length is valid (e.g., between 10 and 15 digits)
  if (rawNumber.length < 10 || rawNumber.length > 15) {
    control.setErrors({ pattern: true });
    return;
  }

  // Validation: Check for 8+ repeating digits (e.g., 11111111)
  const repeatingPattern = /(\d)\1{7}/;
  if (repeatingPattern.test(rawNumber)) {
    control.setErrors({ pattern: true });
    return;
  }

  // Clear errors if all validations pass
  control.setErrors(null);
}


  addSpacesInNumber1(type: 'primary_phone' | 'secondary_phone'): void {
  const control = this.contactForm.get(type);

  if (!control) {
    console.error(`Control '${type}' does not exist in contactForm`);
    return;
  }

  const rawInput = control.value || '';

  if (typeof rawInput !== 'string') {
    console.error(`Value of control '${type}' is not a string:`, rawInput);
    return;
  }

  // Remove all non-digit characters
  const rawNumber = rawInput.replace(/[^\d]/g, '');

  // Format with spaces after every 3 digits
  const formattedNumber = rawNumber.replace(/(\d{1})(\d{3})(\d{3})(\d{3})/, '$1 $2 $3 $4');

  // Update the value
  control.patchValue(formattedNumber.trim(), { emitEvent: false });

  // Validate length (you can change range if needed)
  if (rawNumber.length < 10 || rawNumber.length > 15) {
    control.setErrors({ pattern: true });
    return;
  }

  // Check for repeating digits (e.g., 11111111)
  if (/(\d)\1{7}/.test(rawNumber)) {
    control.setErrors({ pattern: true });
    return;
  }

  // Clear errors if all checks pass
  control.setErrors(null);
}


  deprtmentList:any = [];
  selectedDepartment:any = {};
  
  getDeprtmentbyCompany() {
    this.service.getDeprtmentbyCompany({company_id:this.employerProfile._id}).subscribe(async(res:any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.deprtmentList = res.data.departments;
        if(this.selectedDepartment && this.selectedDepartment.company_department_id){
            if(await this.selectedDepartment){
              let find = await this.deprtmentList.find(el=>el.company_department_id==this.selectedDepartment.company_department_id);
              this.selectedDepartment = find;
              this.getDeprtmentbyCompanyContact(this.selectedDepartment.company_department_id);
            }
        }else{
          this.selectedDepartment=this.deprtmentList[0];
          if(this.selectedDepartment){
            this.getDeprtmentbyCompanyContact(this.deprtmentList[0].company_department_id);
          }
        }
      
      } else {
        this.deprtmentList = [];
      }
    }, err => {
      this.deprtmentList = [];
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }
  getDeprtmentbyCompanyContact(id) {

    this.service.getDeprtmentbyCompanyContact({company_id:this.employerProfile._id,company_department_id:id}).subscribe((res:any) => {
    
      if (res.status == HttpResponseCode.SUCCESS) {
        this.contactList = res.data;
      } else {
        this.contactList = [];
      }
    }, err => {
      this.contactList = [];
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


 async showOnly(data){
    if(data.type){
      // let find = this.placementGroupDetails?.placement_type?.find(e=>e.toLowerCase() == data.type.toLowerCase());
      // if(find){
      //   return true;
      // }else{
      //   return false;
      // }
      return false;
    }else{
      return false;
    }
  }
  isMenuOpen = false;
  removeDepartmentModel(data){
    console.log("data.contact_count", data.contact_count, data)
    if (data.contact_count && data.contact_count > 0) {
      // If department has contacts, ask for confirmation
      this.removedepartmentConfirm.show(data);
    } else {
      // Safe to delete immediately
      this.service.removeDepartmentFromCompany({ company_department_id: data.company_department_id }).subscribe(
        (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.getDeprtmentbyCompany();
            this.service.showMessage({ message: res.msg });
          } else {
            this.service.showMessage({ message: res.msg });
          }
        },
        err => {
          this.contactList = [];
          this.service.showMessage({
            message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
          });
        }
      );
    }
  }


  removeDepartment(){
    this.removedepartmentConfirm.hide();
  }
  userDetail:any;
  addDepartmentSubmit(){
      console.log("this.addDepartmentForm",this.addDepartmentForm);
      // 
      let find = this.departmentmasterList.find((el:any)=>el._id=== this.addDepartmentForm.value.department_id);
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let body = {
          "company_id": this.employerProfile._id,
          "department_id": this.addDepartmentForm.value.department_id,
          "department_name": find.name,
          "created_by_id": this.userDetail._id,
          "updated_by_id":  this.userDetail._id,
      }
      this.service.addDepartmentToCompany(body).subscribe(
        (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.adddepartment.hide();
            this.getDeprtmentbyCompany();
            this.addDepartmentForm.reset();
          } else {
          }
        },
        err => {
          this.service.showMessage({
            message: err.error.errors?.msg || 'Something went wrong',
          });
        }
      );
  }

  updatedepartmentModel(){
    console.log("this.selectedDepartment", this.selectedDepartment);
    this.addDepartmentForm.patchValue({
      department_id:this.selectedDepartment.department_id
    }) 
    this.updatedepartment.show()();
  }

  updateDepartmentSubmit(){
      let find = this.departmentmasterList.find((el:any)=>el._id=== this.addDepartmentForm.value.department_id);
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let body = {
        "company_id": this.employerProfile._id,
        "company_department_id": this.selectedDepartment.company_department_id,
        "department_id": this.addDepartmentForm.value.department_id,
        "department_name": find.name
      }
      this.service.updateDepartmentToCompany(body).subscribe(
        (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.updatedepartment.hide();
            this.getDeprtmentbyCompany();
            this.addDepartmentForm.reset();
          } else {
          }
        },
        err => {
          this.service.showMessage({
            message: err.error.errors?.msg || 'Something went wrong',
          });
        }
      );
  }

  selectedContact:any = {};
  editContact(data){
    this.selectedContact = data;
    this.contactForm.patchValue({
        first_name: data.first_name,
        last_name:data.last_name,
        role: data.role,
        primary_email: data.primary_email,
        secondary_email: data.secondary_email?data.secondary_email:null,
        primary_phone: data.primary_phone,
        secondary_phone: data.secondary_phone?data.secondary_phone:null,
        company_id: this.employerProfile._id,
        preferred_contact:data.preferred_contact?data.preferred_contact:false,
        company_department_id: this.selectedDepartment.company_department_id,
    })
    if(data.primary_phone){
      this.addSpacesInNumber('primary_phone')
    }
       if(data.secondary_phone){
      this.addSpacesInNumber('secondary_phone')
    }
   
    console.log("this.contactForm", this.contactForm, this.selectedContact)
    this.addContact.show();
  }

  getPreferredContactCount(departmentId: string): number {
    return this.contactList.filter(
      contact => contact.company_department_id === departmentId && contact.preferred_contact === true
    ).length;
  }

  onPreferredChange(): void {
    const form = this.contactForm;
    const deptId = form.get('department_id')?.value;
    const isChecked = form.get('preferred_contact')?.value;

    const count = this.getPreferredContactCount(deptId);

    // If already 3 preferred contacts and trying to set another one
    if (!isChecked && count >= 2) {
      form.get('preferred_contact')?.setValue(false);
      form.get('preferred_contact')?.disable();
      this.service.showMessage({
        message: 'Max 3 preferred contacts allowed per department.'
      });
    } else {
      form.get('preferred_contact')?.enable();
    }
  }

  setdata(){
    this.contactForm.patchValue({
      preferred_contact:true
    })
  }
  preferredContactList:any = [];
  checkPreferredContac(){
      if(this.selectedContact && this.selectedContact._id){
        if(this.contactForm.value.preferred_contact){
           this.preferredContactList = this.contactList.filter(el=>el.preferred_contact && el._id!=this.selectedContact._id);
            this.preferredContactList = this.preferredContactList.map(c => ({
              ...c,
              fullName: `${c.first_name} ${c.last_name}`
            }));
            if(this.preferredContactList.length>=2){  
              this.addContact.hide();
              this.replacePerferredContact.show();
            }else{
              this.addContactSubmit();
            }
        }else{
           this.addContactSubmit();
        }
      }else{
        if(this.contactForm.value.preferred_contact){
          this.preferredContactList = this.contactList.filter(el=>el.preferred_contact);
            this.preferredContactList = this.preferredContactList.map(c => ({
              ...c,
              fullName: `${c.first_name} ${c.last_name}`
            }));
            if(this.preferredContactList.length>=2){  
              this.addContact.hide();
              this.replacePerferredContact.show();
            }else{
              this.createSendMailOption();
            }
        }else{
           this.createSendMailOption();
        }
          
      }
      console.log("this. this.preferredContactList",  this.preferredContactList)
    
  }

  createSendMailOption(){
    this.addContact.hide();
    this.contactSendOTP.show();
  }

  selectedContactId:any = null;
  replacePrederredContactSubmit(){
    console.log("selectedContactId", this.selectedContactId);
    this.addContactSubmit();
  }

  addContactSubmit(status = ''){
      console.log("this.addDepartmentForm",this.contactForm);
      this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      let body = {
          first_name: this.contactForm.value.first_name,
          last_name:this.contactForm.value.last_name,
          role: this.contactForm.value.role,
          primary_email: this.contactForm.value.primary_email,
          secondary_email: this.contactForm.value.secondary_email,
          primary_phone: this.contactForm.value.primary_phone,
          secondary_phone: this.contactForm.value.secondary_phone,
          company_id: this.employerProfile._id,
          company_department_id: this.selectedDepartment.company_department_id,
          status: "active",
          created_by: this.userDetail.first_name+" "+this.userDetail.last_name,
          created_by_id: this.userDetail._id,
          preferred_contact:this.contactForm.value.preferred_contact,
          contact_id_old:this.selectedContactId,
          onboarding_status: status?'OTP Sent':null
      }
      if(this.selectedContact && this.selectedContact._id){
        body['_id'] = this.selectedContact._id;
      }
      this.service.addContactToCompany(body).subscribe(
        (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            if(status == 'mail'){
              this.selectedContact = res.data;
              this.reSendOtpEmail(status);
            }else{
              if(this.selectedContactId){
                  this.replacePerferredContact.hide();
                    this.selectedContact = null;
                    this.selectedContactId = '';
                }else{
                  this.addContact.hide();
                  this.selectedContact = null;
                  this.contactForm.reset();
                }
            }
            
             this.getFormBuilder();
             this.getDeprtmentbyCompany();
            this.getDeprtmentbyCompanyContact(this.selectedDepartment.company_department_id);
           
          } else {
          }
        },
        err => {
          this.service.showMessage({
            message: err.error.errors?.msg || 'Something went wrong',
          });
        }
      );
}
emailTaken: boolean = false;

checkEmailExists() {
  const emailControl = this.contactForm.get('primary_email');
  const email = emailControl?.value;

  if (!email || emailControl?.invalid) return;

  this.service.cehckEmailExistCompnayLogin({ email: email}).subscribe(
    (res: any) => {
      if (res.code === 200) {
        if(res.result){
          if(this.selectedContact && this.selectedContact._id){
            this.emailTaken = false;
            if (emailControl?.hasError('emailTaken')) {
              delete emailControl.errors?.emailTaken;
              emailControl.updateValueAndValidity({ onlySelf: true });
            }
          }else{
            this.emailTaken = true;
            emailControl?.setErrors({ emailTaken: true });
          }
         
        }else{
           this.emailTaken = false;
          if (emailControl?.hasError('emailTaken')) {
            delete emailControl.errors?.emailTaken;
            emailControl.updateValueAndValidity({ onlySelf: true });
          }
        }
      } else {
        this.emailTaken = false;
        if (emailControl?.hasError('emailTaken')) {
          delete emailControl.errors?.emailTaken;
          emailControl.updateValueAndValidity({ onlySelf: true });
        }
      }
    },
    err => {
      this.service.showMessage({
        message: err.error.errors?.msg || 'Something went wrong',
      });
    }
  );
}
checkContacts:any= []
contactdata:any;
checkContact(item){
  this.selectedContact = item;
  this.service.checkVacancyByContact({company_id:this.employerProfile._id, contact_id:item._id}).subscribe(
      (res: any) => {
        if (res.code === HttpResponseCode.SUCCESS) {
          this.checkContacts= res.result;
          this.contactdata = res;
          this.checkContacts = [...this.checkContacts, ...this.contactdata.supervisor_data].filter(
              (item, index, self) =>
                index === self.findIndex((obj) => obj._id === item._id)
            );
          this.contactdata.supervisor_data = [];
          if(res.is_vacancy || res.is_supervisor || res.is_placed_supervisor) {
            this.getContactList(this.employerProfile._id);
            this.removeContactProcess.show();
          }else{
            this.removeContactMessage.show();
          }
        } else {
        }
      },
      err => {
        this.service.showMessage({
          message: err.error.errors?.msg || 'Something went wrong',
        });
      }
    );
}

selectedcontats: string[] = [];
selectedcontatSupervisor:any = null;
removeContact(){
  this.service.removeContactsFromCompany({contact_id:this.selectedContact._id}).subscribe(
      (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          if(!this.updateRouting){
            this.removeContactMessage.hide();
            this.removeContactMessageSuccess.show();
          }
        
          this.getDeprtmentbyCompany();
          this.getDeprtmentbyCompanyContact(this.selectedDepartment.company_department_id);;
        } else {
          this.service.showMessage({
            message: res.msg || 'Something went wrong',
          });
        }
      },
      err => {
        this.service.showMessage({
          message: err.error.errors?.msg || 'Something went wrong',
        });
      }
    );
}

updateRouting:boolean = false;
removeContactUpdate(){
  let body= {
    vacancy_id: this.checkContacts.map(el => el._id),
    contact_id: this.selectedContact._id,
    updated_contact_id:this.selectedcontats,
    updated_supervisor_id:this.selectedcontatSupervisor
  }
  this.service.removeContactUpdate(body).subscribe(
      (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.removeContactChange.hide();
          this.removeContactMessageUpdateSuccess.show();
          this.updateRouting =true;
          this.removeContact();
          this.selectedcontatSupervisor = null;
          this.selectedcontats = [];
          // this.getDeprtmentbyCompany();
          //  this.getDeprtmentbyCompanyContact(this.selectedDepartment.company_department_id);
        } else {
          this.service.showMessage({
            message: res.msg || 'Something went wrong',
          });
        }
      },
      err => {
        this.service.showMessage({
          message: err.error.errors?.msg || 'Something went wrong',
        });
      }
    );
}

//  getPreferredContactCount(deptId: any): number {
//       return this.contactlist.controls.filter(ctrl =>
//         ctrl.get('preferred_contact')?.value &&
//         ctrl.get('department_id')?.value === deptId
//       ).length;
//     }

//   onPreferredChange(index: number): void {
//     const currentCtrl = this.contactlist.at(index);
//     const deptId = currentCtrl.get('department_id')?.value;

//     const isCurrentlyChecked = currentCtrl.get('preferred_contact')?.value;

//     if (isCurrentlyChecked) {
//       const alreadyExists = this.contactlist.controls.some(
//         (ctrl, i) =>
//           i !== index &&
//           ctrl.get('preferred_contact')?.value &&
//           ctrl.get('department_id')?.value === deptId
//       );

//       if (alreadyExists) {
//         currentCtrl.get('preferred_contact')?.setValue(false, { emitEvent: false });
//         this.service.showMessage({
//           message: 'Only 1 preferred contact is allowed per department.'
//         });
//       }
//     }
//   }
  copy(text: string) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input);
    return result;
  }

  openedMenuDepartmentId: string | null = null;

  onMenuOpened(departmentId: string) {
    this.openedMenuDepartmentId = departmentId;
  }

  onMenuClosed() {
    this.openedMenuDepartmentId = null;
  }

  addIndex(index, type){
    if(type=="p"){
        this.contactList.map(el=>{
          delete el.index;
          delete el.sindex;
        })
        this.contactList[index]['index']=index;
    }else{
       this.contactList.map(el=>{
          delete el.sindex;
           delete el.index;
        })
        this.contactList[index]['sindex']=index;
    }
    
  }

    @ViewChild('closeResendOTPEmailModal') closeResendOTPEmailModal;
    @ViewChild('emailSendSuccess') emailSendSuccess: ModalDirective;
    reSendOtpEmail(status='') {

      console.log("this.selectedContact", this.selectedContact);

      // return false;
    let body = {
      "company_id" :this.selectedContact.company_id,
      "contact_person":[this.selectedContact._id],
       onboarding_status: 'OTP Sent'
    };
    this.service.resendOTPEamilCompany(body).subscribe(res => {
      if (res.status == 200) {
        this.service.showMessage({ message: res.msg });
        // this.routeForm.reset()
        if(!status){
            this.closeResendOTPEmailModal.ripple.trigger.click();
            this.emailSendSuccess.show();
        }
      
        this.getDeprtmentbyCompanyContact(this.selectedDepartment.company_department_id);
        console.log("this.selectedDepartment", this.selectedDepartment, this.selectedContact)
        // this.selectedDepartment = {};
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


