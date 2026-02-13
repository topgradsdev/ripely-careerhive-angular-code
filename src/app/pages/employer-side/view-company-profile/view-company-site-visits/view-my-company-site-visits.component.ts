import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Lightbox } from 'ngx-lightbox';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { NgxPermissionsService } from 'ngx-permissions';
import { HttpResponseCode } from 'src/app/shared/enum';
import { TopgradserviceService } from 'src/app/topgradservice.service';
import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-view-my-company-site-visits',
  templateUrl: './view-my-company-site-visits.component.html',
  styleUrls: ['./view-my-company-site-visits.component.scss']
})
export class ViewMyCompanySiteVisitsComponent implements OnInit {
  
     @ViewChild('addhcaafModal1') addhcaafModal1: ModalDirective;
        @ViewChild('alreadyHcaafPendingModel') alreadyHcaafPendingModel: ModalDirective;
        @ViewChild('submithcaafModal1') submithcaafModal1: ModalDirective;
        @ViewChild('viewSubmithcaafModal') viewSubmithcaafModal: ModalDirective;
      
        @ViewChild('removeCompanyFlagModel') removeCompanyFlagModel: ModalDirective;
        @ViewChild('closeAddCompanyFlagModal') closeAddCompanyFlagModal;
    @Input() employerProfile: any = {
      site_visits:[]
    };
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
      private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef, private lightbox: Lightbox
    ) { }
    userDetail:any;
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
    
    createSiteVisit() {
      const obj = this.siteVisitForm.value;
      obj.site_visit_id = new Date().getTime();
      obj.index = this.employerProfile.site_visits.length + 1;
      obj.pictures = [];
     let userDetail:any = JSON.parse(localStorage.getItem('userDetail'));
      obj.notes = [{title:obj.notes, created_by_name:userDetail?.first_name+' '+userDetail?.last_name, created_by:userDetail?.first_name?._id, created_at:new Date().toISOString(), updated_at:new Date().toISOString()}];
      this.employerProfile.site_visits.push(this.siteVisitForm.value)
      const payload = {
        site_visits: this.employerProfile?.site_visits,
        _id: this.employerProfile._id
      }
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
          } else if (this.studentFormDetail?.type === 'multi_step') {
            this.multiStepForm = this.studentFormDetail?.fields;
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
        submitForm() {
          if (this.studentFormDetail?.type === 'simple') {
            this.submitWorkflowttachment(this.singleStepForm);
          } else if (this.studentFormDetail?.type === 'multi_step') {
            this.submitWorkflowttachment(this.multiStepForm);
          }
        }
  
  
          @ViewChild('submithcaafModal') public submithcaafModal: ModalDirective;
      openModel(data) {
        console.log("data",data);
        this.getStudentTaskForm(data._id);
        // this.studentFormDetail = data;
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
      submitWorkflowttachment(fields) {
    
      
        const payload = {
          "company_id": this.userDetail?._id,
          "hcaaf_form_id": this.hcaafPending[this.hcaafPending.length-1].hcaaf_form_id,
          "employer_hcaaf_id": this.hcaafPending[this.hcaafPending.length-1]._id,
          "task_status": "completed",
          "employee_status": "completed",
          "staff_status": "pending",
          "form_title": this.hcaafPending[this.hcaafPending.length-1].form_title,
          "submitted_by": this.userDetail?.role,
          //  "employer_hcaaf_id": "66bc4d107bf036f45a939171",
    
          form_fields: { fields, type: this.studentFormDetail?.type },
          employer_name: this.userDetail?.company_name
        }
        this.service.submitHcaafForm(payload).subscribe(res => {
          this.service.showMessage({
            message: "Agreement Forms submitted successfully"
          });
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
      } else {
        this.multiStepForm = this.studentFormDetail?.fields;
      }
    }

    onNextOrSubmit(fields, stepper: MatStepper, type) {
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
        stepper.next();
        return;
      }
    
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
    
      if (isInvalid) {
        this.formSubmitted = true;
        return false;
      } else {
        this.formSubmitted = false;
        if (type === "submit") {
          this.submitForm();
          this.submitdisabled = true;
        } else {
          stepper.next();
        }
      }
    }
    
  }
  