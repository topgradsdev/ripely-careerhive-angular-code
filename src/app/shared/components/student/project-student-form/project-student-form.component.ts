import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { FormControl } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { HttpResponseCode } from '../../../enum';
import { Location } from '@angular/common';
import { FileIconService } from '../../../file-icon.service';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-project-student-form',
  templateUrl: './project-student-form.component.html',
  styleUrls: ['./project-student-form.component.scss']
})
export class ProjectStudentFormComponent implements OnInit {
  userDetail = null;
  taskDetail = null;
  studentFormDetail = null;
  singleStepForm = null;
  multiStepForm = null;
  elementsForm = null;
  taskId = null;
  signaturePads: SignaturePad[] = [];

  @ViewChild('canvas') canvas: ElementRef;
  signaturesArray: any = [1, 2, 3, 4, 5];

  constructor(private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,  private location: Location, private fileIconService: FileIconService) { }

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }

  goBack() {
    this.location.back();
  }
  selectedTab:any = '';
  placement_id:any = '';
  params:any = {};
    isLast:any;
  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userSDetail"));
    this.activatedRoute.queryParams.subscribe(params => {
      this.params = params;
      if (params.taskId) {
        this.placement_id = params.placement_id;
        this.taskId = params.taskId;
        this.isLast = params.isLast;
        this.getTaskDetail(params.taskId);
      }
    });
  }
  showDownload:boolean = false;

    currentUserType = 'student';


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



  getTaskDetail(taskId) {
    const payload = {
      placement_id: this.placement_id,
      student_id: this.userDetail?._id,
      task_id: taskId
    }
    this.service.getTaskDetail(payload).subscribe(async response => {
      this.taskDetail = response.result;
      // if (this.taskDetail?.status === "active" && this.taskDetail?.task_status === "completed") {
      //   console.log("if")
      //   this.getSubmittedTask();
      //   this.showDownload = true;
      // } if (this.taskDetail?.status === "active" && this.taskDetail?.task_status === "pending") {
      //   console.log("if5")
      //   this.getSubmittedTask();
      //   this.showDownload = false;
      // }else  if (this.taskDetail?.task_status === "completed" || (this.taskDetail?.task_status === "pending" && this.taskDetail?.status === 'declined')) {
      //   console.log("if7")
      //   this.getSubmittedTask();
      //   this.showDownload = false;
      // }
      // else if (this.taskDetail?.student_status === "completed") {
      //   console.log("if 2")
      //   this.getSubmittedTask();
      //   this.showDownload = true;
      // }else if (this.taskDetail?.employee_status === "completed") {
      //   console.log("if 3")
      //   this.getSubmittedTask();
      //   this.showDownload = true;
      // } else {
      //   console.log("if 4")
      //   this.showDownload = false;
      //   this.getStudentTaskForm(this.taskDetail?.select_form);
      // }
      if (this.taskDetail?.form_status === "save") {
        this.getSubmittedTask();
        this.showDownload = true;
      } else if (
        (this.taskDetail?.status === "active" && this.taskDetail?.task_status === "completed") ||
        this.taskDetail?.student_status === "completed" ||
        this.taskDetail?.employee_status === "completed"
      ) {
        console.log("if: Completed task");
        this.getSubmittedTask();
        this.showDownload = true;
      } else if (
        (this.taskDetail?.status === "active" && this.taskDetail?.task_status === "pending") ||
        (this.taskDetail?.task_status === "pending" && this.taskDetail?.status === "declined")
      ) {
        console.log("if5 / if7: Pending or Declined Task");
        this.getSubmittedTask();
        this.showDownload = false;
      } else if (this.taskDetail?.status === "declined") {
        this.getSubmittedTask();
        this.showDownload = true;
      } else {
        console.log("if 4: Default Case");
        this.showDownload = false;
        this.getStudentTaskForm(this.taskDetail?.select_form);
      }
      
    });
  }

  async getStudentTaskForm(formId) {
    this.service.getStudentFormById({ _id: formId,student_id: this.userDetail?._id, company_id: this.taskDetail?.companyDetails?._id,  vacancy_type:'project', placement_id: this?.placement_id,}).subscribe(response => {
      console.log("response", response);
      this.studentFormDetail = response.data[0];
      if (this.studentFormDetail?.type === 'simple') {
        this.singleStepForm = this.studentFormDetail?.widgets?.values;
        this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));

      } else if (this.studentFormDetail?.type === 'multi_step') {
        this.multiStepForm = this.studentFormDetail?.widgets?.values;
        this.multiStepForm.forEach(el=>{
           el.component.forEach(field => this.manageFieldVisibility(field, el.component));
        })
       
      }


      console.log("  this.studentFormDetail", this.studentFormDetail)
    });
  }

  ngAfterViewInit(): void {
    const self = this;
    setTimeout(() => {
      self.initializeSignatures();
    }, 5000);
    setTimeout(()=>{
      this.activatedRoute.queryParams.subscribe(params => {
        console.log(params);
        if (params?.stage) {
          this.selectedTab = params.stage;
          
        }else {
         
        }
      });
    })
  }

  initializeSignatures() {
    this.signaturesArray.forEach((signatureData, index) => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${index}`) as HTMLCanvasElement;
      if (canvas) {
        const signaturePad = new SignaturePad(canvas);
        this.signaturePads.push(signaturePad);
      }
    });
  }

  cancelSignature(i, item) {
    this.signaturePads[i].clear();
    item.signature = {};
    setTimeout(() => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${i}`) as HTMLCanvasElement;
      if (canvas) {
        this.signaturePads[i] = new SignaturePad(canvas);
      }
    }, 1000);
  }
uploadFile(event, field) {
    const files: FileList = event.target.files;

    if (files[0].size > field?.elementData?.size * 1048576) {
      this.service.showMessage({
        message: 'Please select file less than ' + field?.elementData?.size + ' MB'
      });
      return;
    }

    Array.from(files).forEach(file => {
      const formData = new FormData();
      formData.append('media', file);
      this.service.uploadOthersMedia(formData).subscribe((resp: any) => {
        field.elementData.value = field.elementData.value?.length > 0 ? field.elementData.value : [];
        field.elementData.value.push(resp);
      });
    });

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

  getFile(i, item) {
    // this.signaturePads.forEach((signaturePad, i) => {
    const dataURL = this.signaturePads[i].toDataURL('image/svg+xml');
    const file = this.dataURLToBlob(dataURL);
    const formData = new FormData();
    formData.append('media', file);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      item.signature = resp;
      // if (this.studentFormDetail?.type === 'simple') {
      //   this.singleStepForm.forEach(form => {
      //     if (form.id === 'signature') {
      //       form.elementData.value = !form.elementData.value ? [] : form.elementData.value;
      //       form.elementData.value.push(resp);
      //     }
      //   })
      // } else if (this.studentFormDetail?.type === 'multi_step') {
      //   this.multiStepForm.forEach(form => {
      //     form.component.forEach(comp => {
      //       if (comp.id === 'signature') {
      //         comp.elementData.value = !comp.elementData.value ? [] : comp.elementData.value;
      //         comp.elementData.value.push(resp);
      //       }
      //     })
      //   })
      // }
      // if (i === this.signaturePads.length - 1) {
      //   // callback();
      // }
    });
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

  submitdisabled :boolean = false;
  submitForm(status = '') {
    if (this.studentFormDetail?.type === 'simple') {
      // if (this.signaturePads.length > 0) {
      //   this.getFile(() => {
      //     this.submitWorkflowttachment(this.singleStepForm);
      //   });
      // } else {
      this.submitWorkflowttachment(this.singleStepForm, status);
      // }
    } else if (this.studentFormDetail?.type === 'multi_step') {
      // if (this.signaturePads.length > 0) {
      //   this.getFile(() => {
      //     this.submitWorkflowttachment(this.multiStepForm);
      //   });
      // } else {
      this.submitWorkflowttachment(this.multiStepForm, status);
      // }
    }
  }

  submitWorkflowttachment(fields, status) {
    // this.goBack();
  
    const payload = {
      placement_id: this?.placement_id,
      student_id: this.userDetail?._id,
      task_id: this.taskId,
      task_status:status=='save'?'pending': "completed",
      employee_status:  this.taskDetail?.employee_status=="completed"? this.taskDetail?.employee_status: "pending",
      type: 'student',
      form_fields: { fields, type: this.studentFormDetail?.type },
      vacancy_id: this.params?.vacancy_id,
      company_id: this.params?.company_id,
      form_id: this.studentFormDetail?._id?this.studentFormDetail?._id:this.taskDetail?.select_form,
      is_last:this.isLast==1?1:0,
      form_status:status?status:'submit',
      student_name: this.userDetail?.first_name + ' ' + this.userDetail?.last_name,
      student_status:status=='save'?'pending':'completed',
      vacancy_type:"project"
    }
    // if(this.isLast==1){
    //   this.submitLastPendingForm({
    //     placement_id: this.userDetail?.placement_id,
    //     student_id: this.userDetail?._id,
    //     task_id: this.taskId,
    //     task_status: "completed",
    //     employee_status: "pending",
    //     type: 'student',
    //     form_fields: { fields, type: this.studentFormDetail?.type },
    //     vacancy_id: this.userDetail?.company_allocation[0]?.vacancy_id,
    //     company_id: this.userDetail?.company_allocation[0]?.company_id,
    //     form_id: this.studentFormDetail?.form_id? this.studentFormDetail?.form_id:this.taskDetail?.select_form,
    //     is_last:this.isLast==1?1:0,
    //     student_name: this.userDetail?.first_name + ' ' + this.userDetail?.last_name
    //   });
    // }
    this.service.submitWorkFlowForm(payload).subscribe(res => {
      // if(this.isLast==1){
       
      // }else{
        this.submitdisabled = false;
       if(status=='save'){
         this.service.showMessage({
          message: "Task saved successfully"
        });
        }else{
          this.service.showMessage({
          message: "Task submitted successfully"
        });
        }
        // this.router.navigate(['/student/my-placements']);
        if(this.selectedTab.includes("ongoing")){
          this.router.navigate(['/student/my-project/details'],  { queryParams: {stage: 'ongoing', placement_id: this?.placement_id, student_id: this.userDetail?._id, vacancy_id: this.params?.vacancy_id, id:this.params?.id , type:'ongoing'}  });
        }else if(this.selectedTab.includes("pre-placement")){
          this.router.navigate(['/student/my-project/details'],  { queryParams: {stage: 'pre-placement', placement_id: this?.placement_id, student_id: this.userDetail?._id, vacancy_id: this.params?.vacancy_id, id:this.params?.id, type:'pre-placement'}  });
        }else if(this.selectedTab.includes("post-placement")){
          this.router.navigate(['/student/my-project/details'],  { queryParams: {stage: 'post-placement', placement_id: this?.placement_id, student_id: this.userDetail?._id, vacancy_id: this.params?.vacancy_id, id:this.params?.id, type:'post-placement'}  });
        }else if(this.selectedTab.includes("completed")){
          this.router.navigate(['/student/my-project/details'],  { queryParams: {stage: 'completed', placement_id: this?.placement_id, student_id: this.userDetail?._id, vacancy_id: this.params?.vacancy_id, id:this.params?.id, type:'completed'}  });
        }
      // }
      
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  gotBack(){
    this.location.back();
  }

  submitLastPendingForm(body) {
    const payload =body
    this.service.submitLastPendingForm(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
      this.router.navigate(['/student/my-placements']);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }


  getSubmittedTask() {
    const payload = {
      placement_id: this.placement_id,
      student_id: this.userDetail?._id,
      task_id: this.taskId,
      company_id: this.params?.company_id,

    }
    this.service.getSubmittedWorkFlowTask(payload).subscribe((response: any) => {
      if (response.result) {
        this.studentFormDetail = { 
          type: response.result?.form_fields?.type,
          student_name: response.result?.student_name,
          employer_name: response.result?.employer_name,
          staff_name: response.result?.staff_name,
          student_submitted_at: response.result?.student_submitted_at,
          employer_submitted_at:response.result?.employer_submitted_at,
          staff_submitted_at: response.result?.staff_submitted_at
        }
        if (this.studentFormDetail?.type === 'simple') {
          response.result?.form_fields?.fields.map(e=>{
            if(e.id=="single" || e.id=="multi"){
              // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
              console.log(" e.elementData.value",  e.elementData.value);
              e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
                ? e.elementData.value.replace(/�/g, '') 
                : e.elementData.value;
       
            }
            if(e.id=="yes_no"){
              if(e.elementData.value==true){
                e.elementData.value = 'Yes';
              }else{
                e.elementData.value = 'No';
              }
          }
      })
          this.singleStepForm = response.result?.form_fields?.fields;
          this.singleStepForm.forEach(field => this.manageFieldVisibility(field, this.singleStepForm));
        } else if (this.studentFormDetail?.type === 'multi_step') {
          response.result?.form_fields?.fields.map(el=>{
            el.component.map(e=>{
              if(e.id=="single" || e.id=="multi"){
                console.log(" e.elementData.value",  e.elementData.value);
                // e.elementData.value =  e.elementData.value.replaceAll(/�/g, '');
                e.elementData.value = typeof e.elementData.value === 'string'  &&  e.elementData.value
                ? e.elementData.value.replace(/�/g, '') 
                : e.elementData.value;
              
       
              }
              if(e.id=="yes_no"){
                if(e.elementData.value==true){
                  e.elementData.value = 'Yes';
                }else{
                  e.elementData.value = 'No';
                }
            }
            })
          })

          this.multiStepForm = response.result?.form_fields?.fields;
          this.multiStepForm.forEach(el=>{
            el.component.forEach(field => this.manageFieldVisibility(field, el.component));
          })
        
        }
      }
    });
  }

  // checkIsFormValid(formFields) {
  //   if (formFields && formFields.length > 0) {
  //     return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
  //       (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Student') && (!item?.signature || Object.keys(item.signature).length === 0))) ||
  //       (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected)));
  //   } else {
  //     return true;
  //   }
  // }



  checkIsFormValid(formFields) {


    if (formFields && formFields.length > 0) {

      

      return formFields.some(form => {
        // First, check if permission exists and has the necessary properties
      return  (form.elementData?.permissions?.student?.read == true && form.elementData?.permissions?.student?.write == true && form.elementData?.required) &&
        
        // Then, apply the rest of the logic
        (
            (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
            (form.id === 'signature' && form.elementData.items.some(item => item.item === 'Employer' && (!item?.signature || Object.keys(item.signature).length === 0))) ||
            (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected))
        )}
      );

      // return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
      //   (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Employer') && (!item?.signature || Object.keys(item.signature).length === 0))) ||
      //   (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected)));
    
    } else {
      return true;
    }
  }
  downloadFile(url: string) {
    window.open(url);
  }

  async downloadPDF(url: string, filename: string): Promise<void> {
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

  today: any = null;

  checkDatachange(data) {
    // console.log("dtaat", data);
  }
  checkDataValidation(data) {
    if (data.title === "Internship End Date") {
      return true;
    } else {
      if (data.value) {
        this.today = new Date(new Date(data.value).setDate(new Date(data.value).getDate() - 1));
      }
      return false;
    }
  }

  checkFieldPermission(permissions) {
    // if (this.taskDetail?.task_status !== 'completed') {
      if (permissions?.student.write && permissions?.student.read) {
        return 'editable';
      } else if (!permissions?.student.write && permissions?.student.read) {
        return 'readOnly';
      } else {
        return 'hidden';
      }
    // }
  }

  checkDropDownFieldPermission(permissions) {
    if (this.studentFormDetail?.staff_status !== 'completed') {
      if (permissions?.student.write && permissions?.student.read) {
        return false;
      } else if (!permissions?.student.write && permissions?.student.read) {
        return true;
      } else {
        return true;
      }
    }
  }


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


    formSubmitted:boolean = false
  onNextOrSubmit(data, stepper: MatStepper, type) {
  console.log("data", data);

   let fields = data?.component?data?.component:data;

   console.log("fields", fields);
      // Determine access level helper
      const getAccessLevel = (permissions) => {
        if (permissions?.student?.write && permissions?.student?.read) {
          return 'editable';
        } else if (!permissions?.student?.write && permissions?.student?.read) {
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

  onCheckboxChange(field) {
  // When user changes a checkbox, re-check validity
  if (field.elementData?.type === 'checkbox') {
    const hasSelected = this.isAnyItemSelected(field.elementData?.items);
    // console.log("hasSelected", hasSelected);
    // If at least one selected, clear error state for this field
    // if (hasSelected) {
    //   field.elementData.value = null;
    // }
     field.elementData.value = hasSelected ? true : null;
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
}
