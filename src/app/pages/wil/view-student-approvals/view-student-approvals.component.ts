import { Component, OnInit, ViewChild } from '@angular/core';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-student-approvals',
  templateUrl: './view-student-approvals.component.html',
  styleUrls: ['./view-student-approvals.component.scss']
})
export class ViewStudentApprovalsComponent implements OnInit {
  showComments: boolean;
  @ViewChild('previewVideoInterview') public previewVideoInterview: ModalDirective;

  constructor(private service: TopgradserviceService,
    private activatedRoute: ActivatedRoute, private fb: FormBuilder, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    // this.formValidation();
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.id) {
        this.getStudentsApproval(params.id);
      }
    });
  }

  comment() {
    this.showComments = !this.showComments;
  }


  studentsApprovalTaskapprove: any = [];
  studentsApprovalTaskdeclined: any = [];
  studentsApprovalTasktodo: any = [];
  getStudentsApproval(id) {
    // this.studentsApprovalTaskapprove = [{
    //   "_id": "66b3048b43409864d436cd2b",
    //   "placement_id": "66a0ac873a01aca81bcccefe",
    //   "task_status": "completed",
    //   "form_fields": {
    //     "fields": [
    //       {
    //         "color": "#FFD569",
    //         "component": [
    //           {
    //             "elementData": {
    //               "title": "Student Name",
    //               "type": "single-line",
    //               "description": "",
    //               "value": "Pooja",
    //               "min": "",
    //               "max": null,
    //               "required": false
    //             },
    //             "id": "single",
    //             "index": 1,
    //             "name": "Student Name",
    //             "isElementWidthFull": true
    //           },
    //           {
    //             "elementData": {
    //               "title": "Signature",
    //               "type": "signature",
    //               "description": "",
    //               "value": "",
    //               "newItem": "",
    //               "items": [
    //                 {
    //                   "item": "Student",
    //                   "signature": {
    //                     "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/image/17230081345755499045207.blob",
    //                     "name": "blob",
    //                     "size": "5 KB",
    //                     "mimetype": "image/svg+xml",
    //                     "date": "2024-08-07T05:22:15.433Z"
    //                   },
    //                   "date": "2024-07-31T18:30:00.000Z",
    //                   "name": "Pooja"
    //                 }
    //               ],
    //               "required": false
    //             },
    //             "id": "signature",
    //             "index": 2,
    //             "name": "Signature",
    //             "isElementWidthFull": true
    //           }
    //         ],
    //         "index": 1,
    //         "name": "Step 1",
    //         "_id": "66b303fe43409864d436cc39"
    //       }
    //     ],
    //     "type": "multi_step"
    //   },
    //   "form_id": "66b3043543409864d436cc42",
    //   "task_type": "form",
    //   "is_approve": true,
    //   "status": "to_do",
    //   "updated_at": "1723008139453",
    //   "placementGroup": "Publication Group Pooja",
    //   "FirstName": "Pihu",
    //   "LastName": "Chauhan",
    //   "StudentCode": "PY123456",
    //   "student_id": "66a34093f220d2ed39501aa1",
    //   "resume_level": "A",
    //   "staff_status": "pending",
    //   "form_title": "New Form",
    //   "task_name": "Sign Test Form"
    // },
    // {
    //   "_id": "66b30a323780e261f6c02b51",
    //   "placement_id": "66a0ac873a01aca81bcccefe",
    //   "task_status": "completed",
    //   "attachments": {
    //     "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/other/17230095829224643546830.pdf",
    //     "name": "dummy-pdf_2.pdf",
    //     "size": "7 KB",
    //     "mimetype": "application/pdf",
    //     "date": "2024-08-07T05:46:23.969Z"
    //   },
    //   "document_types": "Resume",
    //   "task_type": "attachments",
    //   "is_approve": true,
    //   "status": "to_do",
    //   "updated_at": "1723009586102",
    //   "placementGroup": "Publication Group Pooja",
    //   "FirstName": "Pihu",
    //   "LastName": "Chauhan",
    //   "StudentCode": "PY123456",
    //   "student_id": "66a34093f220d2ed39501aa1",
    //   "resume_level": "A",
    //   "staff_status": "pending",
    //   "form_title": "",
    //   "task_name": "Submit Resume"
    // }];
    // this.studentsApprovalTaskdeclined = [{
    //   "_id": "66b3048b43409864d436cd2b",
    //   "placement_id": "66a0ac873a01aca81bcccefe",
    //   "task_status": "completed",
    //   "form_fields": {
    //     "fields": [
    //       {
    //         "color": "#FFD569",
    //         "component": [
    //           {
    //             "elementData": {
    //               "title": "Student Name",
    //               "type": "single-line",
    //               "description": "",
    //               "value": "Pooja",
    //               "min": "",
    //               "max": null,
    //               "required": false
    //             },
    //             "id": "single",
    //             "index": 1,
    //             "name": "Student Name",
    //             "isElementWidthFull": true
    //           },
    //           {
    //             "elementData": {
    //               "title": "Signature",
    //               "type": "signature",
    //               "description": "",
    //               "value": "",
    //               "newItem": "",
    //               "items": [
    //                 {
    //                   "item": "Student",
    //                   "signature": {
    //                     "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/image/17230081345755499045207.blob",
    //                     "name": "blob",
    //                     "size": "5 KB",
    //                     "mimetype": "image/svg+xml",
    //                     "date": "2024-08-07T05:22:15.433Z"
    //                   },
    //                   "date": "2024-07-31T18:30:00.000Z",
    //                   "name": "Pooja"
    //                 }
    //               ],
    //               "required": false
    //             },
    //             "id": "signature",
    //             "index": 2,
    //             "name": "Signature",
    //             "isElementWidthFull": true
    //           }
    //         ],
    //         "index": 1,
    //         "name": "Step 1",
    //         "_id": "66b303fe43409864d436cc39"
    //       }
    //     ],
    //     "type": "multi_step"
    //   },
    //   "form_id": "66b3043543409864d436cc42",
    //   "task_type": "form",
    //   "is_approve": true,
    //   "status": "to_do",
    //   "updated_at": "1723008139453",
    //   "placementGroup": "Publication Group Pooja",
    //   "FirstName": "Pihu",
    //   "LastName": "Chauhan",
    //   "StudentCode": "PY123456",
    //   "student_id": "66a34093f220d2ed39501aa1",
    //   "resume_level": "A",
    //   "staff_status": "pending",
    //   "form_title": "New Form",
    //   "task_name": "Sign Test Form"
    // },
    // {
    //   "_id": "66b30a323780e261f6c02b51",
    //   "placement_id": "66a0ac873a01aca81bcccefe",
    //   "task_status": "completed",
    //   "attachments": {
    //     "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/other/17230095829224643546830.pdf",
    //     "name": "dummy-pdf_2.pdf",
    //     "size": "7 KB",
    //     "mimetype": "application/pdf",
    //     "date": "2024-08-07T05:46:23.969Z"
    //   },
    //   "document_types": "Resume",
    //   "task_type": "attachments",
    //   "is_approve": true,
    //   "status": "to_do",
    //   "updated_at": "1723009586102",
    //   "placementGroup": "Publication Group Pooja",
    //   "FirstName": "Pihu",
    //   "LastName": "Chauhan",
    //   "StudentCode": "PY123456",
    //   "student_id": "66a34093f220d2ed39501aa1",
    //   "resume_level": "A",
    //   "staff_status": "pending",
    //   "form_title": "",
    //   "task_name": "Submit Resume"
    // }];
    // this.studentsApprovalTasktodo = [{
    //   "_id": "66b3048b43409864d436cd2b",
    //   "placement_id": "66a0ac873a01aca81bcccefe",
    //   "task_status": "completed",
    //   "form_fields": {
    //     "fields": [
    //       {
    //         "color": "#FFD569",
    //         "component": [
    //           {
    //             "elementData": {
    //               "title": "Student Name",
    //               "type": "single-line",
    //               "description": "",
    //               "value": "Pooja",
    //               "min": "",
    //               "max": null,
    //               "required": false
    //             },
    //             "id": "single",
    //             "index": 1,
    //             "name": "Student Name",
    //             "isElementWidthFull": true
    //           },
    //           {
    //             "elementData": {
    //               "title": "Signature",
    //               "type": "signature",
    //               "description": "",
    //               "value": "",
    //               "newItem": "",
    //               "items": [
    //                 {
    //                   "item": "Student",
    //                   "signature": {
    //                     "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/image/17230081345755499045207.blob",
    //                     "name": "blob",
    //                     "size": "5 KB",
    //                     "mimetype": "image/svg+xml",
    //                     "date": "2024-08-07T05:22:15.433Z"
    //                   },
    //                   "date": "2024-07-31T18:30:00.000Z",
    //                   "name": "Pooja"
    //                 }
    //               ],
    //               "required": false
    //             },
    //             "id": "signature",
    //             "index": 2,
    //             "name": "Signature",
    //             "isElementWidthFull": true
    //           }
    //         ],
    //         "index": 1,
    //         "name": "Step 1",
    //         "_id": "66b303fe43409864d436cc39"
    //       }
    //     ],
    //     "type": "multi_step"
    //   },
    //   "form_id": "66b3043543409864d436cc42",
    //   "task_type": "form",
    //   "is_approve": true,
    //   "status": "to_do",
    //   "updated_at": "1723008139453",
    //   "placementGroup": "Publication Group Pooja",
    //   "FirstName": "Pihu",
    //   "LastName": "Chauhan",
    //   "StudentCode": "PY123456",
    //   "student_id": "66a34093f220d2ed39501aa1",
    //   "resume_level": "A",
    //   "staff_status": "pending",
    //   "form_title": "New Form",
    //   "task_name": "Sign Test Form"
    // },
    // {
    //   "_id": "66b30a323780e261f6c02b51",
    //   "placement_id": "66a0ac873a01aca81bcccefe",
    //   "task_status": "completed",
    //   "attachments": {
    //     "url": "https://s3.ap-southeast-2.amazonaws.com/uploadtest.careerhive.com.au/public/other/17230095829224643546830.pdf",
    //     "name": "dummy-pdf_2.pdf",
    //     "size": "7 KB",
    //     "mimetype": "application/pdf",
    //     "date": "2024-08-07T05:46:23.969Z"
    //   },
    //   "document_types": "Resume",
    //   "task_type": "attachments",
    //   "is_approve": true,
    //   "status": "to_do",
    //   "updated_at": "1723009586102",
    //   "placementGroup": "Publication Group Pooja",
    //   "FirstName": "Pihu",
    //   "LastName": "Chauhan",
    //   "StudentCode": "PY123456",
    //   "student_id": "66a34093f220d2ed39501aa1",
    //   "resume_level": "A",
    //   "staff_status": "pending",
    //   "form_title": "",
    //   "task_name": "Submit Resume"
    // }];
    let payload = {
      "is_approve": true,
      "student_id": id
    }
    this.service.getStudentsApprovalTask(payload).subscribe((response: any) => {
      console.log("response", response);
      this.studentsApprovalTaskapprove = response.approve ? response.approve : [];
      this.studentsApprovalTaskdeclined = response.declined ? response.declined : [];
      this.studentsApprovalTasktodo = response.to_do ? response.to_do : [];
    });
  }

  selectedTask = null;
  comment1 = "";

  getSelectedTask(task) {
    console.log("tasktasktask", task);
    this.selectedTask = task;
    this.comment1 = "";
    this.selectedTask.selected = true;
    this.getSelectedRecords();
  }

  getSelectedTaskVideo(task) {
    console.log("tasktasktask", task);
    this.selectedTask = task;
    this.selectedTask.selected = true;
    this.getSelectedRecords();
    this.updateRecords();
    this.previewVideoInterview.show();
  }
  getSelectedRecords() {
    // let filteresSelectedTask = [];
    // if (this.selectedIndex === 2) {
    //   const filterTodoTask = this.taskList.to_do.filter(task => task.selected);
    //   const filterApproveTask = this.taskList.approve.filter(task => task.selected);
    //   const filterDeclinedTask = this.taskList.declined.filter(task => task.selected);
    //   filteresSelectedTask = [...filterTodoTask, ...filterApproveTask, ...filterDeclinedTask];
    // } else {
    //   const filterAssignedTask = this.taskList.assigned_tasks.filter(task => task.selected);
    //   const filterInProgressTask = this.taskList.in_progress_tasks.filter(task => task.selected);
    //   const filterCompletedTask = this.taskList.completed_tasks.filter(task => task.selected);
    //   filteresSelectedTask = [...filterAssignedTask, ...filterInProgressTask, ...filterCompletedTask];
    //   //Check if all task selected;
    //   if (this.taskList.assigned_tasks.length) {
    //     this.assignedAllSelected = filterAssignedTask.length == this.taskList.assigned_tasks.length ? true : false;
    //   }
    //   if (this.taskList.in_progress_tasks.length) {
    //     this.inProgressAllTasks = filterInProgressTask.length == this.taskList.in_progress_tasks.length ? true : false;
    //   }
    //   if (this.taskList.assigned_tasks.length) {
    //     this.completedTasks = filterCompletedTask.length == this.taskList.assigned_tasks.length ? true : false;
    //   }
    // }
    // this.selectedRecords = filteresSelectedTask;
  }

  signaturePads: SignaturePad[] = [];
  signaturesArray: any = [1, 2, 3, 4, 5];
  initializeSign(): void {
    const self = this;
    setTimeout(() => {
      this.signaturePads = [];
      self.initializeSignatures();
    }, 5000);

  }

  initializeSignatures() {
    this.signaturesArray.forEach((signatureData, index) => {
      const canvas: HTMLCanvasElement = document.getElementById(`signaturePad-${index}`) as HTMLCanvasElement;
      if (canvas) {
        const signaturePad = new SignaturePad(canvas);
        this.signaturePads.push(signaturePad);
      } else {
        this.signaturePads.push(undefined);
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
  getFile(i, item) {
    const dataURL = this.signaturePads[i].toDataURL('image/svg+xml');
    const file = this.dataURLToBlob(dataURL);
    const formData = new FormData();
    formData.append('media', file);
    this.service.uploadMedia(formData).subscribe((resp: any) => {
      item.signature = resp;
      this.selectedTask.form_fields.fields[i].signature = resp;
    });
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

  submitForm() {
    this.submitWorkflowttachment(this.selectedTask?.form_fields?.fields);
  }

  submitWorkflowttachment(fields) {
    const payload = {
      placement_id: this.selectedTask?.placement_id,
      student_id: this.selectedTask?.student_id,
      task_id: this.selectedTask?._id,
      staff_status: "completed",
      form_fields: { fields, type: this.selectedTask?.form_fields?.type },
      form_id: this.selectedTask?.form_id
    }
    this.service.submitStaffWorkFlowForm(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
      // this.getAllTasks(true);
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  checkIsFormValid(formFields) {
    if (formFields && formFields.length > 0) {
      return formFields.some(form => (form.id !== 'signature' && form.id !== 'checkbox' && form.elementData?.required && !form.elementData?.value) ||
        (form.id === 'signature' && form.elementData.items.some(item => (item.item === 'Staff') && (!item?.signature || Object.keys(item.signature).length === 0))) ||
        (form.id === 'checkbox' && !form.elementData.items.some(item => item.selected)));
    } else {
      return true;
    }
  }

  download(url: string) {
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
      this.download(url);
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
      this.download(url);
    }
  }

  checkDropDownFieldPermission(permissions) {
    if (this.selectedTask?.staff_status !== 'completed') {
      if (permissions?.staff.write && permissions?.staff.read) {
        return false;
      } else if (!permissions?.staff.write && permissions?.staff.read) {
        return true;
      } else {
        return true;
      }
    }
  }



 ratings = [
    { label: 'Communication & Coherence',name: 'Communication', value: 0 },
    { label: 'Critical Thinking',name: 'Critical Thinking', value: 0 },
    { label: 'Skills',name: 'Skills', value: 0 },
    { label: 'Teamwork & Collaboration', name: 'Teamwork', value: 0 },
    { label: 'Relevance & Content', name: 'Relevance', value: 0 },
  ];

   // Chart labels
  public radarChartLabels: string[] = this.ratings.map(r => r.name);

//   public radarChartOptions: ChartOptions<'radar'> = {
//   responsive: true,
//   scales: {
//     r: {
//       ticks: {
//         display: false // hide numbers (0,1,2,3,4,5)
//       },
//       pointLabels: {
//         display: true // keep axis labels
//       }
//     }
//   }
// };

  // Radar chart data
  public radarChartData: ChartData<'radar'> = {
    labels: this.radarChartLabels,
    datasets: [
      {
        data: this.ratings.map(r => r.value),
        label: 'Ratings',
        fill: true,
        backgroundColor: 'rgba(63,81,181,0.2)',  // transparent blue
        borderColor: '#3f51b5',                  // blue border
        pointBackgroundColor: '#3f51b5',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#3f51b5'
      }
    ]
  };

  public radarChartType: ChartType = 'radar';

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      r: {
        ticks: {
          display: false // hide numbers (0,1,2,3,4,5)
        },
        angleLines: { color: '#e5e5e5' },
        grid: { color: '#f2f2f2' },
        pointLabels: { 
          color: '#333',
          font: { size: 12 }
        },
        suggestedMin: 0,
        suggestedMax: 5
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // Color logic based on value
  getColor(value: number): string {
    if (value === 1) return '#E57373';   // red
    if (value === 2) return '#FBC02D';   // yellow
    if (value > 2) return '#3F51B5';     // blue
    return '#E57373'; // grey for 0
  }

  // Update chart when sliders move
  updateChart() {
    this.radarChartData.datasets[0].data = this.ratings.map(r => r.value);
    this.radarChartData = { ...this.radarChartData }; // trigger change detection
    this.is_rating = false;
      this.calculateOverallRating();
  }
  is_rating:boolean = false;
  async updateRecords(){
    this.ratings = this.selectedTask.ratings?this.selectedTask.ratings:this.ratings;
    // this.comment = this.selectedTask?.feedback?this.selectedTask?.feedback:'';
    this.updateChart();
     this.is_rating = false;
     if(this.selectedTask.video_url){
      this.safeVideoUrl =await this.getVideoUrl(this.selectedTask);
     }
   
    this.previewVideoInterview.show()
  }

  overallRating = 0;

 getVideoUrl(data):SafeResourceUrl | null {
      if(data && data.video_url){
         // YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
          const youtubeMatch = data.video_url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
          );
          if (youtubeMatch) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
          }

          // Vimeo: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
          const vimeoMatch = data.video_url.match(
            /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
          );
          if (vimeoMatch) {
            return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
          }
      }else{
          return null;
      }

    }


calculateOverallRating() {
  if (!this.ratings || this.ratings.length === 0) {
    this.overallRating = 0;
    return;
  }

  const total = this.ratings.reduce((sum, item) => sum + (item.value || 0), 0);
  this.overallRating = +(total / this.ratings.length).toFixed(1);
}


  checApproveTaskIsResume() {
    if (this.selectedTask?.document_types === 'Resume') {
      // this.displayResumeLevel();
    } else {
      // this.approveSingleTask('approve');
    }
  }

safeVideoUrl:any = '';
  async submitVideoInterview() {
      console.log(this.ratings,"ratings");
      const hasNonZero = this.ratings.some(r => r.value !== 0);
      if (hasNonZero) {
        await this.submitWorkflowttachment(this.selectedTask?.form_fields?.fields);
        await this.checApproveTaskIsResume();
        this.previewVideoInterview.hide();
      } else {
        this.is_rating = true;
        console.log("❌ All ratings are 0");
      }
    return false;
  }

}


