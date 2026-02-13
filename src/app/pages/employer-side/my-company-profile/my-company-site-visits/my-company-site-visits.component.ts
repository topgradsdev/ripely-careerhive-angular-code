import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Lightbox } from 'ngx-lightbox';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpResponseCode } from 'src/app/shared/enum';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { MatStepper } from '@angular/material/stepper';
import { FileIconService } from 'src/app/shared/file-icon.service';
import heic2any from "heic2any";

@Component({
  selector: 'app-my-company-site-visits',
  templateUrl: './my-company-site-visits.component.html',
  styleUrls: ['./my-company-site-visits.component.scss']
})
export class MyCompanySiteVisitsComponent implements OnInit {

   @ViewChild('addhcaafModal1') addhcaafModal1: ModalDirective;
      @ViewChild('alreadyHcaafPendingModel') alreadyHcaafPendingModel: ModalDirective;
      @ViewChild('submithcaafModal1') submithcaafModal1: ModalDirective;
      @ViewChild('viewSubmithcaafModal') viewSubmithcaafModal: ModalDirective;
    
      @ViewChild('removeCompanyFlagModel') removeCompanyFlagModel: ModalDirective;
      @ViewChild('closeAddCompanyFlagModal') closeAddCompanyFlagModal;
  @Input() employerProfile: any = {
    site_visits:[]
  };
   @ViewChild('sitevisitSuccess') sitevisitSuccess: ModalDirective;
   @ViewChild('addSiteVisit') addSiteVisit: ModalDirective;
   
  siteVisitForm: FormGroup;
  formSubmitted:boolean = false;
  studentNavParam = null;
  selectedIndex:any = 0;
  signaturesArray: any = [1, 2, 3, 4, 5];
  singleStepForm = null;
  hcaafForm: FormGroup;
    multiStepForm = null;
    elementsForm = null;
    @ViewChild('closeCompanyHcaafModal') closeCompanyHcaafModal;
 selectedImage:any;
  customOptionsPopup: OwlOptions = {
      loop: false,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 1
        },
        740: {
          items: 1
        },
        940: {
          items: 1
        }
      },
      nav: true
    }
    customOptions: OwlOptions = {
      loop: false,
      mouseDrag: false,
      touchDrag: false,
      pullDrag: false,
      dots: false,
      navSpeed: 700,
      navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
      responsive: {
        0: {
          items: 1
        },
        400: {
          items: 2
        },
        740: {
          items: 3
        },
        940: {
          items: 4
        }
      },
      nav: true
    }
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private service: TopgradserviceService,
    private sanitizer: DomSanitizer,
     private fb: FormBuilder,
    private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef, private lightbox: Lightbox,
    private fileIconService: FileIconService
  ) { }
  userDetail:any;
   getSafeSvg(documentName: string): SafeHtml {
     return this.fileIconService.getFileIcon(documentName);
    }
  companyId:any;
  ngOnInit(): void {
    console.log("this.updatedPlacementDetail", this.employerProfile);
    this.userDetail = JSON.parse(localStorage.getItem('userDetail'));
      // this.activatedRoute.queryParams.subscribe(params => {
      //   if (params.company_id) {
        
      //   }
      // });
      this.companyId = this.userDetail._id;
    this.siteVisitForm = this.fb.group({
          date: ["", Validators.required],
          time: ["", Validators.required],
          recorded_by: ["", Validators.required],
          supervisor: ["", Validators.required],
          notes: ["", Validators.required]
        });
        this.hcaafForm = this.fb.group({
        form_id: ["", Validators.required],
      });
       this.getCustomFormBySubmitter({
        "is_hcaaf": true,
        "company_id":this.companyId
      });
      this.getHcaafPendingList();
      this.gethcaafList();
      this.getEmployerProfile();
      this.getCompanyContactList();
  }


    formList: any = [];
  
    getCustomFormBySubmitter(data) {
      this.service.getForm(data).subscribe((response: any) => {
        this.formList = response.result;
      })
    }
  
   hcaafList: any = [];
hcaafPending: any = [];
    hcaafs: any = [];
  async gethcaafList() {
    const body = {
      company_id: this.userDetail?._id,
      "staff_status": "completed",
      "employee_status": "completed"
    }
    await this.service.getSubmittedHcaafForm(body).subscribe((response: any) => {

      console.log("response", response);
      // if (response.status == 200) {
      this.hcaafList = [...response.records];
      this.hcaafList = this.removeDuplicatesById([
        ...this.hcaafList,
        ...this.hcaafPending,
        ...this.hcaafPending1
      ]);
      this.getHcaafPendingList();
      // } else {
      //   this.hcaafList = [];
      // }
    }, (err)=>{
      this.getHcaafPendingList();
    });

    
  }

  currentUserType = 'employer';

get visibleStepIndexes() {
  return this.multiStepForm
    .map((step, index) => {
      // If permissions or user type is missing, default to true (step visible)
      const canRead = step.permissions?.[this.currentUserType]?.read ?? true;
      return canRead ? index : -1;
    })
    .filter(index => index !== -1);
}


isLastVisibleStep(index: number): boolean {
  const visible = this.visibleStepIndexes;
  return index === visible[visible.length - 1];
}


  removeDuplicatesById(arr: any[]): any[] {
    const map = new Map();
    arr.forEach(item => {
      map.set(item._id, item); // only keeps last one with same _id
    });
    return Array.from(map.values());
  }

  getHcaafPendingList() {
    const body = {
      company_id: this.userDetail?._id,
      "staff_status": "pending",
      "employee_status": "pending"
    }
    this.service.getEmployerHcaafTask(body).subscribe(async(response: any) => {
      console.log("response", response, "response")
      if (response.status == 200) {
        this.hcaafPending =await [...response.result];

        await this.hcaafPending.map(el=>{
          el.staus = 'pending';
        })
        this.hcaafList =await [...this.hcaafList, ...this.hcaafPending];

        this.hcaafList = this.removeDuplicatesById([
          ...this.hcaafList,
          ...this.hcaafPending,
          ...this.hcaafPending1
        ]);
        console.log("this.hcaafList", this.hcaafList);
      } else {
        this.hcaafPending = [];
      }
    });
    this.getHcaafPendingList1();
  }

  hcaafPending1:any = [];
  getHcaafPendingList1() {
    const body = {
      company_id: this.userDetail?._id,
      "staff_status": "pending",
      "employee_status": "completed"
    }
    this.service.getEmployerHcaafTask(body).subscribe(async(response: any) => {
      console.log("response", response, "response")
      if (response.status == 200) {
        this.hcaafPending1 =await [...response.result];

        await this.hcaafPending1.map(el=>{
          el.staus = 'pending';
        })
        this.hcaafList =await [...this.hcaafList, ...this.hcaafPending1];

        this.hcaafList = this.removeDuplicatesById([
          ...this.hcaafList,
          ...this.hcaafPending,
          ...this.hcaafPending1
        ]);
        console.log("this.hcaafList", this.hcaafList);
      } else {
        this.hcaafPending1 = [];
      }
    });
  }


    getEmployerProfile() {
    const payload = {
      _id: this.employerProfile._id
    }
    this.service.getEmployerProfile(payload).subscribe(response => {
      console.log("response.record", response.record);
      this.employerProfile = response.record;
      this.employerProfile.description = this.employerProfile?.description ? this.employerProfile?.description : "";
      this.employerProfile.site_visits = (this.employerProfile.site_visits || []).reverse();
      // this.basicProfileForm.patchValue(response.record);
    });
  }

  companyContactList: any = [];
  getCompanyContactList() {
    this.service.getCompanyContactList({company_id:this.employerProfile._id}).subscribe((res:any) => {
      if (res.status == HttpResponseCode.SUCCESS) {
        this.companyContactList = res.data;
        this.companyContactList = this.companyContactList.map(c => ({
          ...c,
          fullName: `${c.first_name} ${c.last_name}`
        }));
      } else {
          this.companyContactList = [];
      }
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  goToSiteVisitDetail(siteVisit) {
    this.router.navigate(['/employer/my-site-visits-details'], { queryParams: { companyId: this.employerProfile._id, site_visit_id: siteVisit?.site_visit_id } })
  }

  public showAll = false;

  public toggleShowMore(): void {
    this.showAll = !this.showAll;
  }
  currentSite:any = null;
  createSiteVisit() {
    const obj = this.siteVisitForm.value;
    obj.site_visit_id = new Date().getTime();
    obj.index = this.employerProfile.site_visits.length + 1;
    obj.pictures = [];
   let userDetail:any = JSON.parse(localStorage.getItem('userDetail'));
    obj.notes = [{title:obj.notes, created_by_name:userDetail?.first_name+' '+userDetail?.last_name, created_by:userDetail?.first_name?._id, created_at:new Date().toISOString(), updated_at:new Date().toISOString()}];
    obj.pictures= this.selectedSiteVisit?.pictures;
    this.employerProfile.site_visits.push(this.siteVisitForm.value)
    const payload = {
      site_visits: this.employerProfile?.site_visits,
      _id: this.employerProfile._id
    }
     this.currentSite = obj;
    this.updateEmployerProfile(payload);
    this.siteVisitForm.reset();
    document.getElementById('cancel')?.click();
  }

  updateEmployerProfile(payload) {
    this.service.SubmitEmployerProfile(payload).subscribe(res => {
      this.service.showMessage({
        message: "Employer profile updated successfully"
      });
      this.addSiteVisit.hide();
      this.sitevisitSuccess.show();
      this.getEmployerProfile();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  openLightbox(array, index: number): void {
    console.log("array, index", array, index)
    let data = array
      .filter(p => p?.image?.url) // only include if src is valid
      .map(p => ({
        src: p.image.url,
        caption: p.image.caption || '', // optional
        thumb: p.image.url // or use a smaller thumbnail if available
      }));
    this.lightbox.open(data, index);
    // setTimeout(() => {
    //   const existingBtn = document.querySelector('.lightbox-close-btn');
    //   if (!existingBtn) {
    //     const btn = document.createElement('span');
    //     btn.className = 'lightbox-close-btn';
    //     btn.innerHTML = '&times;';
    //     btn.onclick = () => this.closeLightbox();
    //     const container = document.querySelector('.lightboxContainer');
    //     if (container) container.appendChild(btn);
    //   }
    // }, 100);
  }

  closeLightbox(): void {
    this.lightbox.close();
  }

    fun(stepper: MatStepper) {  
        if (this.hcaafForm.invalid) {
          this.hcaafForm.markAllAsTouched()
        } else {
          stepper.next();
          const self = this;
          setTimeout(() => {
            self.initializeSignatures();
          }, 5000);
        }
      }
    
      
      taskDetail:any = {};
    
    
      resetHcaaf(){
        this.hcaafForm.patchValue({
          form_id: ''
        })
      }
    
      async getFormdata() {
        console.log(this.hcaafForm.value.form_id);
      
        const find = this.formList.find(el => el._id == this.hcaafForm.value.form_id);
        if (find) {
          this.studentFormDetail = find;
          if (this.studentFormDetail?.type === 'simple') {
            this.singleStepForm = this.studentFormDetail?.widgets?.values;
          } else {
            this.multiStepForm = this.studentFormDetail?.widgets?.values;
          }
          console.log("find:", find);
        } else {
          console.log("No match found for form_id:", this.hcaafForm.value.form_id);
        }
      }
      
    
      // async getFormdata(){
      //   console.log(this.hcaafForm.value.form_id);
      //   let find =await this.formList.find(el=>el._id === this.hcaafForm.value.form_id);
      //   if(find){
      //     this.studentFormDetail = find;
      //     if (this.studentFormDetail?.type === 'simple') {
      //       this.singleStepForm = this.studentFormDetail?.widgets?.values;
      //     } else {
      //       this.multiStepForm = this.studentFormDetail?.widgets?.values;
      //     }
      //     console.log("find", find);
      //   }
    
      //   // const self = this;
      //   // setTimeout(() => {
      //   //   self.initializeSignatures();
      //   // }, 5000);
      // }
    
     async createHaccf(stepper: MatStepper) {
        console.log("this.addhcaafModal1", this.addhcaafModal1, this.singleStepForm);
        // return false;
    
        if(!this.singleStepForm){
          const find = this.formList.find(el => el._id == this.hcaafForm.value.form_id);
          if (find) {
            this.studentFormDetail = find;
            if (this.studentFormDetail?.type === 'simple') {
              this.singleStepForm = this.studentFormDetail?.widgets?.values;
            } else {
              this.multiStepForm = this.studentFormDetail?.widgets?.values;
            }
            console.log("find:", find);
          } else {
            console.log("No match found for form_id:", this.hcaafForm.value.form_id);
          }
        }
    
        if (this.hcaafForm.valid) {
          let body = {
            "hcaaf_form_id": this.hcaafForm.value.form_id,
            "company_id": this.companyId,
            "created_by_id": this.userDetail._id,
            "created_by": this.userDetail.first_name + " " + this.userDetail.last_name,
            form_fields: { fields: this.studentFormDetail?.type=== 'simple'? this.singleStepForm:  this.multiStepForm, type: this.studentFormDetail?.type },
          }
    
          console.log("body", body);
          // return false;
          this.service.sendNewHcaaf(body).subscribe(res => {
    
            setTimeout(() => {
              this.addhcaafModal1.hide();
              this.closeCompanyHcaafModal.ripple.trigger.click();
              this.submitdisabled = false;
            }, 500)
            // this.submitdisabled = false;
    
           
            if (res.status == 200) {
    
              // if (this.studentFormDetail?.type === 'simple') {
              //   this.submitWorkflowttachment(this.singleStepForm);
              // } else if (this.studentFormDetail?.type === 'multi_step') {
              //   this.submitWorkflowttachment(this.multiStepForm);
              // }
    
    
              this.service.showMessage({ message: res.msg });
              this.gethcaafList();
              // this.getPenddinghcaafList();
              this.getHcaafPendingList();
           
             
            } else {
              this.service.showMessage({ message: res.msg });
            }
            this.hcaafForm.patchValue({
              form_id: ""
            })
            stepper.selectedIndex = 0;
    
          }, err => {
            this.service.showMessage({
              message: err.error.errors.msg ? err.error.errors.msg : 'Something went Wrong'
            })
    
          }
          );
        } else {
          this.service.showMessage({
            message: 'Form Required'
          })
        }
      }
      vertical:boolean = false;
      studentFormDetailStatus:any={};
      openModelPendding(data) {
        console.log("data", this.hcaafPending[0]);
        const loader = document.getElementById('loader');
        if (loader) loader.style.display = 'none'; // Hide the loader on error
        this.vertical = false; // Reset vertical state
        this.submithcaafModal1.show();
    
        this.studentFormDetailStatus = this.hcaafPending[0]
        this.studentFormDetail = this.hcaafPending[0]['form_fields'];
    
        console.log("this.studentFormDetailthis.studentFormDetail", this.studentFormDetail)
        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.fields;
        } else {
          this.multiStepForm = this.studentFormDetail?.fields;
        }
        const self = this;
        setTimeout(() => {
          self.initializeSignatures();
        }, 5000);
        // this.getStudentTaskForm(this.hcaafPending[0].hcaaf_form_id);
      }
    
    
      openModelViewHcaaf(data) {
        console.log("data", data[0]);
        this.submithcaafModal1.show();
        this.studentFormDetailStatus = data[0];
        this.studentFormDetail = data[0]['form_fields'];
        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.fields;
        } else {
          this.multiStepForm = this.studentFormDetail?.fields;
        }
    
        // this.studentFormDetail.fields.map(async(el)=>{
        //   if(el.id === "signature"){
        //     if(el.elementData){
        //       let url =await this.getBase64Image(el.elementData.items[0].signature.url);
        //       console.log("urlurlurl", url);
        //       el.elementData.items[0].signature.baseurl = url;
        //     }
        //   }
        // })
    
        console.log("this.studentFormDetail", this.studentFormDetail);
    
        
        const self = this;
        setTimeout(() => {
          self.initializeSignatures();
        }, 5000);
        // this.getStudentTaskForm(this.hcaafPending[0].hcaaf_form_id);
      }
    
    
      studentFormDetail: any;
    
    
    async getStudentTaskForm(formId) {
      this.service.getSubmittedHcaafFormDetailById({ _id: formId }).subscribe(response => {
        this.studentFormDetail = response.data[0].form_fields;
        // if(this.studentFormDetail.form_fields?.type == "multi_step"){
        //   this.studentFormDetail?.form_fields?.fields.map(el=>{
        //     el.component.map(e=>{
        //       if(e.id=="single" || e.id=="multi"){
        //         e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
        //       }
        //     })
        //   })
        // }else{
        //   this.studentFormDetail?.form_fields?.fields.map(e=>{
        //       if(e.id=="single" || e.id=="multi"){
        //         e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
        //       }
        // })
        // }
       
        if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.fields;
           this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));
        } else if (this.studentFormDetail?.type === 'multi_step') {
          this.multiStepForm = this.studentFormDetail?.fields;
          this.multiStepForm.forEach(el=>{
           el.component.forEach(field => this.manageFieldVisibility(field, el.component));
        })
        }
  
  
      });
    }
  
    
      initializeSignatures() {
        console.log("this.signaturesArray", this.signaturesArray)
        // this.signaturesArray.forEach((signatureData, index) => {
        //   const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-Employer-${index}`) as HTMLCanvasElement;
        //   const canvas1: HTMLCanvasElement = document.getElementById(`signaturePad-Staff-${index}`) as HTMLCanvasElement;
        //   const canvas2: HTMLCanvasElement = document.getElementById(`signaturePad-${index}`) as HTMLCanvasElement;
        //   if (canvas) {
        //     const signaturePad = new SignaturePad(canvas);
        //     this.signaturePads.push(signaturePad);
        //     console.log(" this.signaturePads",  this.signaturePads)
        //   }
        //   if (canvas1) {
        //     const signaturePad1 = new SignaturePad(canvas1);
        //     this.signaturePads.push(signaturePad1);
        //     console.log(" this.signaturePads",  this.signaturePads)
        //   }
        //   if (canvas2) {
        //     const signaturePad2 = new SignaturePad(canvas2);
        //     this.signaturePads.push(signaturePad2);
        //     console.log(" this.signaturePads",  this.signaturePads)
        //   }
        // });
      }
    
      cancelSignature(i, item) {
        // this.signaturePads[i].clear();
        item.signature = {};
        setTimeout(() => {
          const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${i}`) as HTMLCanvasElement;
          if (canvas) {
            // this.signaturePads[i] = new SignaturePad(canvas);
          }
        }, 1000);
      }
    
     uploadFile(event: any, field: any) {
        const files: FileList = event.target.files;
  
        // Check if any file is too large
        const maxSizeMB = field?.elementData?.size || 5; // Default to 5MB if undefined
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
  
          if (file.size > maxSizeBytes) {
            this.service.showMessage({
              message: `Please select file less than ${maxSizeMB} MB`
            });
            continue;
          }
  
          const formData = new FormData();
          formData.append('media', file);
  
          this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
            if (!Array.isArray(field.elementData.value)) {
              field.elementData.value = [];
            }
            field.elementData.value.push(resp);
          });
        }
  
        // Reset file input
        event.target.value = "";
      }
  
  getValueInsideSingleBracket(input: unknown): string[] {
    try {
      if (!input) {
        return [];
      }

      let text = '';

      if (Array.isArray(input)) {
        text = input.join(' ');
      } else if (typeof input === 'string') {
        text = input;
      } else {
        console.warn('Invalid input type:', input);
        return [];
      }

      const regex = /\(([^)]+)\)/g;
      const matches = [...text.matchAll(regex)];

      return matches.map(match => match[1]);
    } catch (error) {
      console.error('getValueInsideSingleBracket error:', error);
      return [];
    }
}
    
    
    
      getFilehcaaf(i, item) {
        // // console.log(this.signaturePads, i, item);
        // if(this.signaturePads.length==1){
        //   if(item.item=="Staff"){
        //     i = i-1;
        //     if(i<0){
        //       i = 0;
        //     }
        //   }
        // }
      
        // const dataURL = this.signaturePads[i].toDataURL('image/svg+xml');
        // const file = this.dataURLToBlob(dataURL);
        // const formData = new FormData();
        // formData.append('media', file);
        // this.service.uploadMedia(formData).subscribe((resp: any) => {
        //   item.signature = resp;
        //   item.signature.baseurl = dataURL;
        //   // if (this.studentFormDetail?.type === 'simple') {
        //   //   this.singleStepForm.forEach(form => {
        //   //     if (form.id === 'signature') {
        //   //       form.elementData.value = !form.elementData.value ? [] : form.elementData.value;
        //   //       form.elementData.value.push(resp);
        //   //     }
        //   //   })
        //   // } else if (this.studentFormDetail?.type === 'multi_step') {
        //   //   this.multiStepForm.forEach(form => {
        //   //     form.component.forEach(comp => {
        //   //       if (comp.id === 'signature') {
        //   //         comp.elementData.value = !comp.elementData.value ? [] : comp.elementData.value;
        //   //         comp.elementData.value.push(resp);
        //   //       }
        //   //     })
        //   //   })
        //   // }
        //   // if (i === this.signaturePads.length - 1) {
        //   //   // callback();
        //   // }
        // });
        // }); 
      }
    
      dataURLToBlob(dataURL) {
        const parts = dataURL.split(';base64,');
        const contentType = parts[0].split(':')[1];
        const raw = window.atob(parts[1]);
        const rawLength = raw.length;
        const uInt8Array = new Uint8Array(rawLength);
        for (let i = 0; i < rawLength; ++i) {
          uInt8Array[i] = raw.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: contentType });
      }
    
      submitdisabled:boolean = false;
      submitForm(status = '') {
        if (this.studentFormDetail?.type === 'simple') {
          this.submitWorkflowttachment(this.singleStepForm, status);
        } else if (this.studentFormDetail?.type === 'multi_step') {
          this.submitWorkflowttachment(this.multiStepForm, status);
        }
      }


        @ViewChild('submithcaafModal') public submithcaafModal: ModalDirective;
    openModel(data) {
      console.log("data",data);
      // this.getStudentTaskForm(data._id);
      // this.studentFormDetail = data;
       console.log('data', data);
      this.studentFormDetail = data.form_fields;
      // this.getStudentTaskForm(data.hcaaf_form_id);
      // this.studentFormDetail = data;
      console.log("this.studentFormDetail", this.studentFormDetail);
      this.taskDetail = data;
      if (this.studentFormDetail?.type === 'simple') {
          this.singleStepForm = this.studentFormDetail?.fields;
          this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));
        } else if (this.studentFormDetail?.type === 'multi_step') {
      
          this.multiStepForm = this.studentFormDetail?.fields;
          this.multiStepForm.forEach(el=>{
            el.component.forEach(field => this.manageFieldVisibility(field, el.component));
          })

        }
      this.submithcaafModal.show();
      const self = this;
      setTimeout(() => {
        self.initializeSignatures();
      }, 5000);

    }
    getCheckValid(item){
      if(item.status){
        return true;
      }else{
        return false;
      }
      item?.status && item?.status=='pending'
    }
    
      disableBtnform:boolean = false;
        @ViewChild('multiStepFormStepper') stepper!: MatStepper;
    submitWorkflowttachment(fields, status) {
  
    
      const payload = {
        "company_id": this.userDetail?._id,
        "hcaaf_form_id": this.hcaafPending[this.hcaafPending.length-1].hcaaf_form_id,
        "employer_hcaaf_id": this.hcaafPending[this.hcaafPending.length-1]._id,
        "task_status": "completed",
         employee_status:status ? 'pending':'completed',
         employee_form_status:status?status:'submit',
        "staff_status": "pending",
        "form_title": this.hcaafPending[this.hcaafPending.length-1].form_title,
        "submitted_by": this.userDetail?.role,
        //  "employer_hcaaf_id": "66bc4d107bf036f45a939171",
  
        form_fields: { fields, type: this.studentFormDetail?.type },
        employer_name: this.userDetail?.company_name
      }
      this.service.submitHcaafForm(payload).subscribe(res => {
        if(status){
           this.service.showMessage({
          message: 'Agreement Forms saved successfully',
        });
        }else{
           this.service.showMessage({
          message: 'Agreement Forms submitted successfully',
        });
        }
       
         if (this.stepper) {
          this.stepper.selectedIndex = 0; // Go to the desired step
          // this.onStepChange(index);           // Optional: call a function for logic
        }
        this.submitdisabled = false;
        // this.goBack();
        this.submithcaafModal.hide();
        this.gethcaafList();
       
      }, err => {
        this.service.showMessage({
          message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
        });
      })
    }
      getSubmittedTask() {
        const payload = {
          placement_id: this.studentNavParam?.placement_id,
          student_id: this.studentNavParam?.student_id,
          task_id: 1,
          company_id: this.companyId,
        }
        this.service.getSubmittedWorkFlowTask(payload).subscribe((response: any) => {
          if (response.result) {
            console.log("response.result", response.result);
            this.studentFormDetail = { type: response.result?.form_fields?.type,
              student_name: response.result?.student_name,
              employer_name: response.result?.employer_name,
              staff_name: response.result?.staff_name,
              student_submitted_at: response.result?.student_submitted_at,
              employer_submitted_at:response.result?.employer_submitted_at,
              staff_submitted_at: response.result?.staff_submitted_at
             }
            if (this.studentFormDetail?.type === 'simple') {
              this.singleStepForm = response.result?.form_fields?.fields;
            } else if (this.studentFormDetail?.type === 'multi_step') {
              this.multiStepForm = response.result?.form_fields?.fields;
            }
          }
        });
      }
    
      // goBack() {
      //   // this.location.back();
      // }
    
    
      // (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0)))
      // ||
      checkIsFormValid(formFields) {
        if (formFields && formFields.length > 0) {
          // && form.id !== 'checkbox'
          return formFields.some(form => (form.id !== 'signature'  && form.id !== 'checkbox' &&  form.elementData?.required && !form.elementData?.value));
        } else {
          return true;
        }
      }
    
    
      checkIsFormValidSubmit(formFields) {
        // form.id !== 'checkbox' && 
        if (formFields && formFields.length > 0) {
          return formFields.some(form => (form.id !== 'signature' && form.elementData?.required && !form.elementData?.value) ||
            (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))));
        } else {
          return true;
        }
      }
    
     checkFieldPermission(permissions) {
      // if (this.taskDetail?.employee_status !== 'completed') {
        if (permissions?.employee.write && permissions?.employee.read) {
          return 'editable';
        } else if (!permissions?.employee.write && permissions?.employee.read) {
          return 'readOnly';
        } else {
          return 'hidden';
        }
      // }
    }
    
      // downloadFile(url: string) {
      //   window.open(url);
      // }
    
      async downloadhcaafPDF(url: string, filename: string): Promise<void> {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const blob = await response.blob();
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename;
          link.click();
          window.URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('There was an error downloading the PDF:', error);
          this.downloadFile(url);
        }
      }
     downloadFile(url: string) {
      window.open(url);
    }
      async viewhcaafPDF(url: string): Promise<void> {
        try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
    
          const blob = await response.blob();
          const blobURL = window.URL.createObjectURL(blob);
          window.open(blobURL, '_blank');
          window.URL.revokeObjectURL(blobURL);
        } catch (error) {
          console.error('There was an error viewing the PDF:', error);
          this.downloadFile(url);
        }
      }
      
      validurl(url){
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
    
      // generatePDF(): Promise<any> {
      //   const data = document.getElementById('pdfContent') as HTMLElement;
      
      //   if (data) {
      //     // Find all elements with the ID 'submitButton' and hide them
      //     const submitButtons = document.querySelectorAll('#submitButton') as NodeListOf<HTMLElement>;
          
      //     submitButtons.forEach(button => {
      //       button.style.display = 'none';
      //     });
      
      //     return domtoimage.toPng(data).then((contentDataURL) => {
      //       const pdf = new jsPDF('p', 'mm', 'a4');
            
      //       // Define image width and height for A4
      //       const imgWidth = 210; // A4 size width in mm
      //       const pageHeight = 297; // A4 size height in mm
      
      //       // Create an Image instance
      //       const img = new Image();
      //       img.src = contentDataURL;
      
      //       return new Promise<any>((resolve, reject) => {
      //         img.onload = () => {
      //           const aspectRatio = img.width / img.height;
      //           let imgHeight = imgWidth / aspectRatio;
      
      //           if (imgHeight > pageHeight) {
      //             // Calculate the total number of pages needed
      //             let positionY = 0;
      //             const totalPages = Math.ceil(imgHeight / pageHeight);
      
      //             for (let i = 0; i < totalPages-1; i++) {
      //               if (i > 0) {
      //                 pdf.addPage();
      //               }
      
      //               // Calculate the portion of the image that fits on the current page
      //               const heightForPage = Math.min(pageHeight, imgHeight - positionY);
      //               pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, heightForPage);
      //               positionY += heightForPage;
      //             }
      //           } else {
      //             // If the image fits on one page
      //             pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
      //           }
      
      //           // Save the PDF as a Blob and create a URL
      //           const pdfBlob = pdf.output('blob');
      //           const pdfURL = URL.createObjectURL(pdfBlob);
      //           console.log("pdfURL", pdfURL);
      
      //           // Prepare FormData for upload
      //           const formData = new FormData();
      //           formData.append('media', pdfBlob, new Date().getTime() + '.pdf');
      
      //           // Upload the PDF using the Angular service
      //           this.service.uploadMedia(formData).subscribe((resp: any) => {
      //             console.log('Upload response:', resp);
      //             resolve(resp); // Resolve the promise with the upload response
      //           }, (error) => {
      //             console.error('Upload error:', error);
      //             reject(error); // Reject the promise on error
      //           });
      //         };
      
      //         img.onerror = (error) => {
      //           console.error('Error loading image:', error);
      //           reject(error); // Reject the promise on image load error
      //         };
      //       });
      
      //     }).catch(error => {
      //       console.error('Error capturing HTML:', error);
      //       return Promise.reject(error); // Return rejected promise on capture error
      //     }).finally(() => {
      //       // Restore the submit buttons after the image is captured
      //       submitButtons.forEach(button => {
      //         button.style.display = 'block';
      //       });
      //     });
      //   } else {
      //     return Promise.reject('No content found to generate PDF'); // Handle case where content is not found
      //   }
      // }
    
      async generatePDF(): Promise<any> {
    
        // console.log("this.employerProfile.company_nam",this.employerProfile.company_name)
        // return 
        return new Promise<void>((resolve, reject) => {
          const loader = document.getElementById('loader');
          setTimeout(async () => {
            const element = document.getElementById('pdfContent');
            if (!element) {
              console.error('Element not found!');
              if (loader) loader.style.display = 'none';
              reject('Element not found');
              return;
            }
      
            if (loader) loader.style.display = 'block';
      
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
      
            try {
              const canvas = await domtoimage.toPng(element, { quality: 1 });
              const img = new Image();
              img.src = canvas;
      
              img.onload = () => {
                const imgWidth = pdfWidth;
                const imgHeight = (img.height * imgWidth) / img.width;
      
                let position = 0;
                let currentHeight = imgHeight;
      
                pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
                currentHeight -= pdfHeight;
      
                while (currentHeight > 0) {
                  position -= pdfHeight;
                  pdf.addPage();
                  pdf.addImage(img, 'PNG', 0, position, imgWidth, imgHeight);
                  currentHeight -= pdfHeight;
                }
      
                const pdfBlob = pdf.output('blob');
                console.log('Generated PDF Blob:', pdfBlob, this.employerProfile?.company_name, this.studentFormDetailStatus);
      
                // const fileName = `${
                //   this.studentFormDetailStatus.form_title+'_'+this.employerProfile?.company_name ||
                //   new Date().getTime()
                // }`;
    
                const currentDate = new Date();
                const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;
    
                const fileName = `${
                  this.studentFormDetailStatus?.form_title + '_' + 
                  (this.employerProfile?.company_name || new Date().getTime()) + '_' + 
                  formattedDate
                }`;
    
                console.log("fileName", fileName);
                
                const formData = new FormData();
                formData.append('media', pdfBlob, fileName + '.pdf');
      
                for (const pair of (formData as any).entries()) {
                  console.log(`${pair[0]}:`, pair[1]);
                }
      
                this.service.uploadMediaHcaaf(formData).subscribe(
                  (resp: any) => {
                    console.log('Upload response:', resp);
                    if (loader) loader.style.display = 'none';
                    this.vertical = false;
                    resolve(resp);
                  },
                  (error) => {
                    console.error('Upload error:', error);
                    if (loader) loader.style.display = 'none';
                    this.vertical = false;
                    reject(error);
                  }
                );
              };
            } catch (error) {
              console.error('Error generating PDF:', error);
              if (loader) loader.style.display = 'none';
              this.vertical = false;
              reject(error);
            }
          }, 500);
        });
      }
      getStatus(data) {
      return new Date().getTime() >= new Date(data.valid_from).getTime() && new Date().getTime() <= new Date(data.valid_to).getTime()
    }


       isAnyItemSelected(items: any[]): boolean {
        return items?.some(item => item.selected);
      }
    isFieldInvalid(field): boolean {
      const access = this.checkFieldPermission(field.elementData?.permissions);
      const isEditable = access === 'editable';
      const isRequired = field.elementData?.required;

      let hasValue = false;

      if (field.elementData?.type === 'checkbox') {
        hasValue = this.isAnyItemSelected(field.elementData?.items);
      } else if (field.elementData?.type === 'attachment') {
        hasValue = field.elementData?.value && field.elementData?.value.length > 0;
      } else {
        hasValue = !!field.elementData?.value;
      }

      return this.formSubmitted && isEditable && isRequired && !hasValue;
    }
  
    showFormView(item){
  
      this.viewSubmithcaafModal.show();
  
      this.studentFormDetailStatus = item
      this.studentFormDetail =item['form_fields'];
  
      console.log("this.studentFormDetailthis.studentFormDetail", this.studentFormDetail)
      if (this.studentFormDetail?.type === 'simple') {
        this.singleStepForm = this.studentFormDetail?.fields;
          this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));
      } else {
        this.multiStepForm = this.studentFormDetail?.fields;
        this.multiStepForm.forEach(el=>{
           el.component.forEach(field => this.manageFieldVisibility(field, el.component));
        })
      }

     
    }

          
   onNextOrSubmit(data, stepper: MatStepper, type) {
         console.log("data", data);

   let fields = data?.component?data?.component:data;
    console.log("fields", fields);
      
      // Determine access level helper
      const getAccessLevel = (permissions) => {
        if (permissions?.employee?.write && permissions?.employee?.read) {
          return 'editable';
        } else if (!permissions?.employee?.write && permissions?.employee?.read) {
          return 'readOnly';
        } else {
          return 'hidden';
        }
      };
    
      // Skip validation if all fields are just descriptions
     const onlyDescriptions = fields.every(
          field => field.elementData?.type === 'description'
        );

        if (onlyDescriptions) {
          if (this.studentFormDetail?.type === 'multi_step') {
            const findIndex = this.multiStepForm.findIndex(
              f => f.name === data.name
            );

            const isLastStep = findIndex === this.multiStepForm.length - 1;

            // 🔹 If NOT last step → move next
            if (!isLastStep && findIndex > -1) {
              const nextStep = this.multiStepForm[findIndex + 1];

              nextStep?.component.forEach(field => {
                this.checkFieldLogic(field, nextStep?.component);
              });

              stepper.next();
              return;
            }

            // 🔹 If LAST step → submit
            if (isLastStep) {
              this.submitForm();
              this.submitdisabled = true;
              return;
            }
          }

          stepper.next();
          return;
        }

    fields.forEach(field => {
        this.checkFieldLogic(field, fields)
    });

    
      // Validate only editable + required fields
      const isInvalid = fields.some(field => {
        const accessLevel = getAccessLevel(field.elementData?.permissions);
        const isEditable = accessLevel === 'editable'; // only check editable fields
        const isRequired = field.elementData?.required;
        const isDescription = field.elementData?.type === 'description';
           const isHidden = field.hidden === true; // check if field is hidden
    
        if (!isEditable || isDescription || !isRequired || isHidden) {
          return false; // skip validation if not editable, not required, or description
        }
    
        // Now check value based on type
        const hasValue = field.elementData?.type === 'checkbox'
          ? field.elementData?.items?.some(item => item.selected)
          : !!field.elementData?.value;
    
        return !hasValue;
      });
    
      console.log("isInvalid", isInvalid);
    
     if (isInvalid || this.stopnext || this.disbaledBtnLogic || this.processEnd) {

        this.formSubmitted = true;
        return false;
      } else {
        this.formSubmitted = false;
        if (type === "submit") {
          this.submitForm();
          this.submitdisabled = true;
        } else {
          if (this.studentFormDetail?.type === 'multi_step') {
      const findIndex = this.multiStepForm.findIndex(f => f.name === data.name);
        console.log("findIndex", findIndex);

        if (findIndex > -1 && findIndex + 1 < this.multiStepForm.length) {
          let mfields = this.multiStepForm[findIndex + 1];
          console.log("mfields", mfields);
          mfields?.component.forEach(field => {
            // if(!field.elementData.value){
              this.checkFieldLogic(field, mfields?.component)
            // }
          });
        }
      }
          stepper.next();
        }
      }
    }
    


  errorMessage:any = null;
  processEnd:boolean = false;
  processEndObj:any = null;
  disbaledBtnLogic:boolean = false;
  stopnext:boolean = false;


checkFieldLogic(changedField: any, fields: any[]) {
  console.log("changedField, fields", changedField, ' == = = ', fields, ' = = == = = = ', this.processEnd, this.stopnext);

  if (this.studentFormDetail?.type === 'simple' || this.studentFormDetail?.type === 'multi_step') {
    this.manageFieldVisibility(changedField, fields);
  }

  if (this.processEnd || this.stopnext) {
    console.log("this.processEndObj", this.processEndObj)
      // const passed = this.checkCondition(fieldValue, logic, targetField);
      if(this.processEndObj.index == changedField.index){
        // let logic = changedField.logic || {};
        let logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
        const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
        console.log("passed", passed);
        if(!passed){
          this.errorMessage = null;
          changedField.is_message = false;
          changedField.message = "";

          // if (logic.action === "end_process") {
          //   this.processEnd = false;
          // }
          // if (logic.action === "block_submission") {
          //   this.stopnext = false;
          // }
          this.processEnd = false;
          this.stopnext = false;
          this.disbaledBtnLogic = false;
          this.processEndObj = null
        }

     }
    console.log("this.processEndObj", this.processEndObj);
    return;
  }
  const logic = Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  // --- find the field we check the value of ---
  const targetField = fields.find(f => f.name === logic.field_name);
  if (!targetField) return;

  const fieldValue = targetField.elementData?.value;

  console.log("fieldValuefieldValue", fieldValue);
  // const passed = fieldValue || logic.action == "hide_field" || logic.action == "show_field"?this.checkCondition(fieldValue, logic, targetField):false;

  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // logic.action === "show_field";

  console.log("shouldCheck", shouldCheck)
const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;

  console.log("Checking:", targetField.name, "Value:", fieldValue, "Rule:", logic, "Passed:", passed);

  // --- find field to hide/show ---
  let hideShowField: any = null;
  if (logic.hide_show_field && this.studentFormDetail?.type === 'multi_step') {
    const section = this.multiStepForm.find(el => el.name === logic.action_page_type);
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
  } else {
    hideShowField = logic.hide_show_field
      ? fields.find(f => f.name === logic.hide_show_field)
      : null;
  }

  console.log("targetField", passed)

  if (passed) {
    switch (logic.action) {
      case "show_message":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "block_submission":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || "Form submission blocked";
        break;

      case "hide_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        // hideShowField.hidden = true;
        // // hideShowField.elementData.value = null;
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        if (hideShowField) {
          hideShowField.hidden = false;
        }
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || "Process ended";
        break;
    }
  } else {
    // --- Reset states if condition fails ---
    switch (logic.action) {
      case "hide_field":

      
       if (hideShowField) {
        hideShowField.hidden = false;
        if (hideShowField.elementData) {
          // hideShowField.elementData.value = null;
        }
      }
        targetField.is_message = false;
        targetField.message = "";
        this.stopnext = this.stopnext;
        this.processEnd = this.processEnd;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_field":
        if (hideShowField) {
          hideShowField.hidden = true;
          if (hideShowField.elementData) {
            // hideShowField.elementData.value = null;
          }
        }
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "show_message":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.processEnd = this.processEnd;
        this.stopnext = this.stopnext;
        this.disbaledBtnLogic= this.disbaledBtnLogic;
        break;

      case "end_process":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;   // ✅ unlock when condition fails
        break;

      case "block_submission":
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = "";
        this.disbaledBtnLogic = false;
        this.stopnext = false;     // ✅ unlock when condition fails
        break;

      default:
        break;
    }
  }

  this.recalculateEndProcess(fields);
}

private recalculateEndProcess(fields: any[]) {
  let disableFound = false;

  for (const field of fields) {
    const logic = field.logic;
    if (!logic) continue;

    // If already in processEnd/stopnext mode, verify if condition still holds
    // if (this.processEnd || this.stopnext) {
    //   console.log("this.processEndObj", this.processEndObj, "field", field)
    //   if (this.processEndObj?.index === field.index) {
    //     const passed = this.checkCondition(field.elementData?.value, logic, field);
    //     console.log("Re-checking condition for end_process:", passed);

    //     if (!passed) {
    //       // Reset because condition no longer holds
    //       this.errorMessage = null;
    //       field.is_message = false;
    //       field.message = "";

    //       this.processEnd = false;
    //       this.stopnext = false;
    //       this.disbaledBtnLogic = false;
    //       this.processEndObj = null;
    //     }
    //   }
    //   continue; // don’t exit loop, keep checking other fields
    // }

    // Normal case: check condition fresh

    let shouldCheck =
    field.elementData?.value !== undefined &&
    field.elementData?.value !== null &&
    field.elementData?.value !== "" ||
    field.id == "checkbox" || logic.action === "show_field"
    
    const passed = shouldCheck?this.checkCondition(field.elementData?.value, logic, field):false;
    console.log("passed", passed, "field", field, "login", passed && (logic.action === "end_process" || logic.action === "block_submission"))
    if (passed && (logic.action === "end_process" || logic.action === "block_submission")) {
      disableFound = true;
      this.processEndObj = { index: field.index, action: logic.action };
      break;
    }
  }

  // Apply final state if not already reset
  if (!this.processEnd && !this.stopnext) {
    this.disbaledBtnLogic = disableFound;
    this.processEnd = disableFound;
    this.stopnext = disableFound;
  }

  console.log("Recalculated end_process:", {
    disableFound,
    processEnd: this.processEnd,
    stopnext: this.stopnext,
    processEndObj: this.processEndObj
  });
}


private checkCondition(fieldValue: any, rule: any, targetField: any): boolean {

  console.log("fieldValue: any, rule: any, targetField", fieldValue, rule, targetField)
  const value = rule.value;
  const fieldType =
    targetField?.elementData?.type ||
    targetField?.logic?.type ||
    targetField?.id;

  console.log("fieldType", fieldType);

  // if (fieldValue == null || fieldValue === '') return false;

  // --- TEXT FIELD (by length) ---
  if (fieldType === 'single-line' || fieldType === 'multi-line') {
    const length = fieldValue?.toString().replace(/\n/g, '').trim()?.length || null;
    if(length == null){
      return false;
    }
    const ruleNum = Number(value);
    switch (rule.is) {
      case 'eq': return length === ruleNum;
      case 'neq': return length !== ruleNum;
      case 'lt': return length < ruleNum;
      case 'gt': return length > ruleNum;
      case 'lte': return length <= ruleNum;
      case 'gte': return length >= ruleNum;
      default: return false;
    }
  }

  // --- NUMBER FIELD ---
  // if (fieldType === 'number') {
  //   const numVal = Number(fieldValue);
  //   if (isNaN(numVal)) return false;

  //   let mainCheck = true;

  //   // first rule check (eq, gt, lt etc.)
  //   if (rule.and_number !== undefined && rule.and_number !== null && rule.and_number !== '') {
  //     const numRule = Number(rule.and_number);
  //     switch (rule.is) {
  //       case 'eq': mainCheck = numVal === numRule; break;
  //       case 'neq': mainCheck = numVal !== numRule; break;
  //       case 'lt': mainCheck = numVal < numRule; break;
  //       case 'gt': mainCheck = numVal > numRule; break;
  //       case 'lte': mainCheck = numVal <= numRule; break;
  //       case 'gte': mainCheck = numVal >= numRule; break;
  //     }
  //   }

  //   // second rule check (and_number, to_number, number_grather)
  //   let secondCheck = true;
  //   if (rule.number_grather && rule.and_number !== '') {
  //     const andNum = Number(rule.and_number);
  //     const toNum = Number(rule.to_number);
  //     switch (rule.number_grather) {
  //       case 'eq': secondCheck = numVal === andNum; break;
  //       case 'neq': secondCheck = numVal !== andNum; break;
  //       case 'lt': secondCheck = numVal < andNum; break;
  //       case 'gt': secondCheck = numVal > andNum; break;
  //       case 'lte': secondCheck = numVal <= andNum; break;
  //       case 'gte': secondCheck = numVal >= andNum; break;
  //       case 'between': secondCheck = numVal >= andNum && numVal <= toNum; break;
  //     }
  //   }

  //   return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
  // }

  if (fieldType === 'number') {
  const numVal = Number(fieldValue);
  if (isNaN(numVal)) return false;

  let mainCheck = true;

  // First operator check (is)
  if (rule.is && rule.and_number !== '') {
    const numRule = Number(rule.and_number);
    switch (rule.is) {
      case 'eq': mainCheck = numVal === numRule; break;
      case 'neq': mainCheck = numVal !== numRule; break;
      case 'lt': mainCheck = numVal < numRule; break;
      case 'gt': mainCheck = numVal > numRule; break;
      case 'lte': mainCheck = numVal <= numRule; break;
      case 'gte': mainCheck = numVal >= numRule; break;
    }
  }

  // Second operator check (number_grather / between)
  let secondCheck = true;
  if (rule.number_grather) {
    const andNum = Number(rule.and_number);
    const toNum = rule.to_number ? Number(rule.to_number) : null;

    switch (rule.number_grather) {
      case 'eq': secondCheck = numVal === toNum; break;
      case 'neq': secondCheck = numVal !== toNum; break;
      case 'lt': secondCheck = numVal < toNum; break;
      case 'gt': secondCheck = numVal > toNum; break;
      case 'lte': secondCheck = numVal <= toNum; break;
      case 'gte': secondCheck = numVal >= toNum; break;
      case 'between':
        if (toNum !== null) {
          secondCheck = numVal >= andNum && numVal <= toNum;
        } else {
          secondCheck = false; // invalid rule definition
        }
        break;
    }
  }
  console.log("rule.number_grather ? (mainCheck && secondCheck) : mainCheck", rule.number_grather , (mainCheck && secondCheck) , mainCheck, secondCheck)

  return rule.number_grather ? (mainCheck && secondCheck) : mainCheck;
}


  // --- DATE/TIME FIELD ---
  if (fieldType === 'date') {
    const fieldDateObj = new Date(fieldValue);
    const ruleDateObj = new Date(value);

    if (isNaN(fieldDateObj.getTime()) || isNaN(ruleDateObj.getTime())) return false;

    // Zero out the time part
    fieldDateObj.setHours(0, 0, 0, 0);
    ruleDateObj.setHours(0, 0, 0, 0);

    const fieldDate = fieldDateObj.getTime();
    const ruleDate = ruleDateObj.getTime();

    switch (rule.is) {
      case 'eq': return fieldDate === ruleDate;
      case 'neq': return fieldDate !== ruleDate;
      case 'lt': return fieldDate < ruleDate;
      case 'gt': return fieldDate > ruleDate;
      case 'lte': return fieldDate <= ruleDate;
      case 'gte': return fieldDate >= ruleDate;
      default: return false;
    }
  }

  if (fieldType === 'time') {
  // Convert both fieldValue and rule.value (e.g. "4:05 PM") into minutes since midnight
  const parseTime = (timeStr) => {
    if (!timeStr) return NaN;
    const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (!match) return NaN;

    let hours = parseInt(match[1], 10);
    const minutes = parseInt(match[2], 10);
    const period = match[3] ? match[3].toUpperCase() : null;

    if (period === 'PM' && hours < 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes; // total minutes since midnight
  };

  const fieldTime = parseTime(fieldValue);
  const ruleTime = parseTime(value);

  if (isNaN(fieldTime) || isNaN(ruleTime)) return false;

  switch (rule.is) {
    case 'eq': return fieldTime === ruleTime;
    case 'neq': return fieldTime !== ruleTime;
    case 'lt': return fieldTime < ruleTime;
    case 'gt': return fieldTime > ruleTime;
    case 'lte': return fieldTime <= ruleTime;
    case 'gte': return fieldTime >= ruleTime;
    default: return false;
  }
}


  // --- CHECKBOX / RADIO / MULTISELECT ---
//   if (fieldType === 'checkbox' || fieldType === 'radio' || Array.isArray(fieldValue)) {
//     // Collect selected values properly for checkbox
//     let selectedValues: any[] = [];
//     if (fieldType === 'checkbox' && targetField.elementData?.items) {
//       selectedValues = targetField.elementData.items
//         .filter((item: any) => item.selected)
//         .map((item: any) => item.item);
//     } else {
//       selectedValues = Array.isArray(fieldValue) ? fieldValue : [fieldValue];
//     }

//     const ruleValues = Array.isArray(value) ? value : [value];
//     switch (rule.is) {
//       case 'includes': return ruleValues.some(v => selectedValues.includes(v));
//       case 'not_includes': return ruleValues.every(v => !selectedValues.includes(v));
//       default: return false;
//     }
//   }

//   if (fieldType === 'likert-scale' || fieldType === "likert") {
//   const likertItems: string[] = targetField?.elementData?.items?.map((i: any) => i.item) || [];

//   if (!likertItems.length) return false;

//   const fieldIndex = likertItems.indexOf(fieldValue) + 1;
//   let ruleIndex = -1;

//   if (Array.isArray(value) && value.length > 0) {
//     ruleIndex = likertItems.indexOf(value[0]) + 1;
//   } else if (typeof value === "string") {
//     ruleIndex = likertItems.indexOf(value) + 1;
//   }

//   if (fieldIndex <= 0 || ruleIndex <= 0) return false;

//   switch (rule.is) {
//     case 'eq': return fieldIndex === ruleIndex;
//     case 'neq': return fieldIndex !== ruleIndex;
//     case 'lt': return fieldIndex < ruleIndex;
//     case 'gt': return fieldIndex > ruleIndex;
//     case 'lte': return fieldIndex <= ruleIndex;
//     case 'gte': return fieldIndex >= ruleIndex;
//     default: return false;
//   }
// }

 if (fieldType === 'likert-scale' || fieldType === 'likert') {
  // Get selected value(s)
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  const likertOrder = targetField.elementData?.items?.map(it => it.item) || [];

  const selectedRank = likertOrder.indexOf(selectedValues[0]);
  const ruleRank = likertOrder.indexOf(ruleValues[0]);

  console.log('Likert selected:', selectedValues[0], 'rule:', ruleValues[0], 'comparison:', rule.is);

  switch (rule.is) {
    case 'eq':
      return selectedValues[0] === ruleValues[0];

    case 'neq':
      return selectedValues[0] !== ruleValues[0];

    case 'includes':
      return ruleValues.includes(selectedValues[0]);

    case 'not_includes':
      return !ruleValues.includes(selectedValues[0]);

    case 'gte':
      return selectedRank >= ruleRank;

    case 'lte':
      return selectedRank <= ruleRank;

    case 'gt':
      return selectedRank > ruleRank;

    case 'lt':
      return selectedRank < ruleRank;

    default:
      return false;
  }
}


  // --- existing checkbox/radio/array logic ---
// RADIO / CHECKBOX / MULTISELECT (replace your current block with this)
// if (fieldType === 'radio' || fieldType === 'checkbox' || Array.isArray(fieldValue)) {
//   // build selectedValues array:
//   let selectedValues: any[] = [];

//   // checkbox: read items[].selected
//   if (fieldType === 'checkbox' && targetField.elementData?.items) {
//     selectedValues = targetField.elementData.items
//       .filter((it: any) => !!it.selected)
//       .map((it: any) => it.item);
//   }
//   // if fieldValue is already an array (multi-select), use it
//   else if (Array.isArray(fieldValue)) {
//     selectedValues = fieldValue.slice();
//   }
//   // radio / single-select: single value -> array
//   else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
//     selectedValues = [fieldValue];
//   } else {
//     selectedValues = [];
//   }


//   const ruleValues = Array.isArray(value) ? value : [value];
//   console.log("selectedValues", selectedValues, ruleValues)
//   switch (rule.is) {
//     // exact match: selectedValues must contain exactly the same items as ruleValues
//     case 'eq':
//       // both arrays equal (order-agnostic)
//     if (selectedValues.length !== ruleValues.length) return false;
//       return ruleValues.every(rv => selectedValues.includes(rv));

//     case 'neq':
//       if (selectedValues.length !== ruleValues.length) return true;
//       return !ruleValues.every(rv => selectedValues.includes(rv));

//     // any match: true if any rule value is present in selectedValues
//     case 'includes':
//       return ruleValues.some(rv => selectedValues.includes(rv));

//     // none of the rule values are present
//     case 'not_includes':
//       return ruleValues.every(rv => !selectedValues.includes(rv));

//     default:
//       return false;
//   }
// }

if (fieldType === 'radio' || Array.isArray(fieldValue)) {
  let selectedValues: any[] = [];

  if (fieldType === 'checkbox' && targetField.elementData?.items) {
    selectedValues = targetField.elementData.items
      .filter(it => !!it.selected)
      .map(it => it.item);
  } else if (Array.isArray(fieldValue)) {
    selectedValues = fieldValue.slice();
  } else if (fieldValue !== undefined && fieldValue !== null && fieldValue !== '') {
    selectedValues = [fieldValue];
  }

  const ruleValues = Array.isArray(value) ? value : [value];
  console.log("ruleValues", ruleValues, "selectedValues", selectedValues)
  switch (rule.is) {
    case 'eq':
      if (selectedValues.length !== ruleValues.length) return false;
      return ruleValues.every(rv => selectedValues.includes(rv));

    case 'neq':
      if (selectedValues.length !== ruleValues.length) return true;
      return !ruleValues.every(rv => selectedValues.includes(rv));

    case 'includes':
      return selectedValues.length > 0 && ruleValues.some(rv => selectedValues.includes(rv));

    case 'not_includes':
      // treat empty selection as false
      if (!selectedValues.length) return false;
      return !ruleValues.some(rv => selectedValues.includes(rv));

    default:
      return false;
  }
}

// console.log("fieldType",fieldType)

if (fieldType === 'checkbox') {
  const selectedValues: string[] = targetField.elementData?.items
    ?.filter((item: any) => item.selected)
    .map((item: any) => {
      // Adjust here depending on your data structure
      return (item.value || item.item || item.label || '').toString().trim().toLowerCase();
    }) || [];

  const ruleValues: string[] = (Array.isArray(value) ? value : [value])
    .map(v => (v ?? '').toString().trim().toLowerCase());


    console.log('Selected Values:', selectedValues);
    console.log('Rule Values:', ruleValues);

    if(selectedValues.length == 0){
      return false
    }

  switch (rule.is) {
    case 'includes':
      return ruleValues.some(rv => selectedValues.includes(rv));
    case 'not_includes':
      return ruleValues.every(rv => !selectedValues.includes(rv));
    case 'eq':
      return selectedValues.length === ruleValues.length &&
             ruleValues.every(rv => selectedValues.includes(rv));
    case 'neq':
      return !(selectedValues.length === ruleValues.length &&
               ruleValues.every(rv => selectedValues.includes(rv)));
    default:
      return false;
  }
}



if (fieldType === 'dropdown') {
  // actual selected value from dropdown
  const selectedValue = targetField.elementData?.value || '';

  // normalize rule values into array
  const ruleValues = Array.isArray(value) ? value : [value];

  switch (rule.is) {
    case 'eq':
    case 'includes':
      // Match if selected value equals any of the rule values
      return ruleValues.includes(selectedValue);

    case 'neq':
    case 'not_includes':
      // Match if selected value does NOT equal any of the rule values
      return !ruleValues.includes(selectedValue);

    default:
      return false;
  }
}


  // --- DEFAULT STRING/OTHER ---
  switch (rule.is) {
    case 'eq': return fieldValue == value;
    case 'neq': return fieldValue != value;
    default: return false;
  }
}


manageFieldVisibility(changedField: any, fields: any[]) {
  // const logic = changedField.logic || {};
  const logic =  Array.isArray(changedField.logic)
  ? changedField.logic[0] || {}   // if array, get first item
  : changedField.logic || {};
  if (!logic.field_name || !logic.is) return;

  let targetField: any;
  let hideShowField: any = null;

  if (this.studentFormDetail?.type === 'multi_step' && logic.hide_show_field) {
    const section = this.multiStepForm.find(el => el.name === logic.action_page_type);
    targetField = fields.find(f => f.name === logic.field_name);
    if(!targetField?.elementData?.value || targetField?.elementData?.value == "Nah"){
    hideShowField = section?.component?.find(f => f.name === logic.hide_show_field) || null;
    }
  } else {
    targetField = fields.find(f => f.name === logic.field_name);
    if(!targetField?.elementData?.value || targetField?.elementData?.value == "Nah"){
    hideShowField = logic.hide_show_field ? fields.find(f => f.name === logic.hide_show_field) : null;
    }
  }

  if (!targetField) return;

  //   if (this.processEnd || this.stopnext) {
  //     // const passed = this.checkCondition(fieldValue, logic, targetField);
  //     if(this.processEndObj.index == changedField.index){
  //       let logic = changedField.logic || {};
  //       const passed = this.checkCondition(changedField.elementData?.value, logic, changedField);
  //       console.log("passed", passed);
  //       if(!passed){
  //         this.errorMessage = null;
  //         changedField.is_message = false;
  //         changedField.message = "";
  //         this.processEnd = false;
  //         this.stopnext = false;
  //         this.disbaledBtnLogic = false;
  //         this.processEndObj = null
  //       }

  //     }
  //   console.log("this.processEndObj", this.processEndObj);
  //   return;
  // }

  const fieldValue = targetField.elementData?.value;
  console.log("fieldValue", fieldValue)
  console.log("logic", logic);
  let shouldCheck =
  fieldValue !== undefined &&
  fieldValue !== null &&
  fieldValue !== "" &&
  fieldValue !== "Nah" ||
  targetField.id == "checkbox" ; //|| logic.action === "show_field";
  // ||
  // (logic.action === "hide_field" && (logic.is!='lt' || logic.is!='lte'))
  // (logic.action === "show_field" && (logic.is=='lt' || logic.is=='lte'));

if(logic.action === "hide_field"){
  console.log("shouldCheck", shouldCheck, logic.action)
}
  

const passed = shouldCheck ? this.checkCondition(fieldValue, logic, targetField) : false;
  console.log("passed", passed);
  // --- handle hide/show / end_process / block_submission ---
  if (passed) {
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) hideShowField.hidden = true;
        break;

      case 'hide_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        break;

      case 'show_message':
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.errorMessage = logic.message || '';
        break;

      case 'block_submission':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.errorMessage = logic.message || 'Form submission blocked';
        break;

      case 'end_process':
        this.processEndObj = targetField;
        targetField.is_message = !!logic.message;
        targetField.message = logic.message;
        this.disbaledBtnLogic = true;
        this.stopnext = true;
        this.processEnd = true;
        this.errorMessage = logic.message || 'Process ended';
        break;
    }
  } else {
    // --- reset only for actions that are not end_process / block_submission ---
    switch (logic.action) {
      case 'show_field':
        if (hideShowField) {
          hideShowField.hidden = true;
          // hideShowField.elementData.value = null;
        }
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'hide_field':
        if (hideShowField) hideShowField.hidden = false;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'show_message':
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'block_submission':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;

      case 'end_process':
        this.disbaledBtnLogic = false;
        this.stopnext = false;
        this.processEnd = false;
        this.errorMessage = null;
        targetField.is_message = false;
        targetField.message = '';
        break;
    }
  }

  console.log('manageFieldVisibility ->', {
    targetField,
    hideShowField,
    passed,
    action: logic.action
  });
}

 selectedSiteVisit = {
    pictures: []
  };

//   this.selectedSiteVisit = this.selectedSiteVisit || { pictures: [] };
// this.selectedSiteVisit.pictures = this.selectedSiteVisit.pictures || [];

  getUploadedPictures(event: Event) {
    const input = event.target as HTMLInputElement;
  
    if (input?.files?.length) {
      const files = Array.from(input.files); // convert FileList to Array<File>
  
      files.forEach(async (file) => {
        let uploadFile: File | Blob = file;
  
        // 🧩 Convert HEIC -> JPEG before upload
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
          try {
            const convertedBlob: any = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });
  
            // Rebuild as File for FormData
            uploadFile = new File([convertedBlob], file.name.replace(/\.heic$/i, ".jpg"), {
              type: "image/jpeg",
            });
          } catch (err) {
            console.error("HEIC conversion failed:", err);
            return; // skip upload if conversion fails
          }
        }
  
        const formData = new FormData();
        formData.append("media", uploadFile);
  
        this.service.uploadOthersMedia(formData).subscribe({
          next: (resp: any) => {
            
            this.selectedSiteVisit['pictures'].push({
              image: resp,
              uploadedBy: `${this.userDetail?.first_name} ${this.userDetail?.last_name}`,
              visable: true,
            });
            this.cdr.detectChanges();
          },
          error: (err) => console.error("Upload failed:", err),
        });
      });
  
      console.log("selectedSiteVisit?.pictures", this.selectedSiteVisit?.pictures);
      input.value = ""; // clear file input
    }
  }

    removeFile(index) {
        this.service.deleteFileS3({file_url: this.selectedSiteVisit.pictures[index].image.url}).subscribe(res => {
          if (res.status == HttpResponseCode.SUCCESS) {
            this.selectedSiteVisit.pictures.splice(index, 1);
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
  
    viewFile(index, file){
      console.log("index, file", index, file)
      window.open(file.image.url);
    }

  deleteObj:any =null;
 confirmDetete(index: number, file: any) {
  if (!this.deleteObj) {
    this.deleteObj = {};
  }

  this.deleteObj.index = index;
  this.deleteObj.file = file;
  this.confirmationDelete.show();
}
 @ViewChild('confirmationDelete') public confirmationDelete: ModalDirective;





deleteFile(index, form) {
    if (!Array.isArray(form)) {
      console.error("❌ Error: form is not an array!", form);
      return;
    }
    if (index < 0 || index >= form.length) {
      console.error("❌ Error: Invalid index!", index);
      return;
    }

    this.service.deleteFileS3({file_url:form[index].url}).subscribe(res => {
      if (res.status == HttpResponseCode.SUCCESS) {
    
        console.log("🗑️ Deleting file:", form[index]);
        form.splice(index, 1);
        console.log("✅ Updated form:", form);
        this.deleteObj = null;
        this.confirmationDelete.hide();
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

    selectedForm:any;
    async downloadPDF(url: string, filename: any){
      this.selectedForm  = filename;
      if(url){
         try {
          const response = await fetch(url);
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          const blob = await response.blob();
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = filename.form_title+"_"+filename.employer_name;
          link.click();
          window.URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('There was an error downloading the PDF:', error);
          this.downloadFile(url);
        }
      }else{
          const loader = document.getElementById('loader');
          console.log("loader", loader)
          if (loader) loader.style.display = 'none'; // Hide the loader on error


          this.studentFormDetailStatus = this.selectedForm
          this.studentFormDetail = this.selectedForm['form_fields'];
          console.log("this.studentFormDetailthis.studentFormDetail", this.studentFormDetail)
          if (this.studentFormDetail?.type === 'simple') {
            this.singleStepForm = this.studentFormDetail?.fields;
          } else {
            //  this.studentFormDetail.fields = this.studentFormDetail.fields.slice(1);
            this.multiStepForm = this.studentFormDetail?.fields;
          }
          const self = this;
          // setTimeout(() => {
          //   self.initializeSignatures();
          // }, 5000);
          
        
          // this.downloadhcaafForm.show()
          setTimeout(()=>{
             const loader = document.getElementById('loader');
           console.log("loader", loader)
          if (loader) loader.style.display = 'none'; // Hide the loader on error
          }, 500)
      }
     
    }
  
    async viewPDF(url: string): Promise<void> {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const blob = await response.blob();
        const blobURL = window.URL.createObjectURL(blob);
        window.open(blobURL, '_blank');
        window.URL.revokeObjectURL(blobURL);
      } catch (error) {
        console.error('There was an error viewing the PDF:', error);
        this.downloadFile(url);
      }
    }


}

