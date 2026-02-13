import { Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../../topgradservice.service';
import { FormControl } from '@angular/forms';
import SignaturePad from 'signature_pad';
import { HttpResponseCode } from '../../../enum';
import { Location } from '@angular/common';
import { FileIconService } from '../../../file-icon.service';
import { MatStepper } from '@angular/material/stepper';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-student-video',
  templateUrl: './student-video.component.html',
  styleUrls: ['./student-video.component.scss']
})
export class StudentVideoComponent implements OnInit {
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
    private router: Router,  private location: Location, private fileIconService:FileIconService, private sanitizer: DomSanitizer) { }

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }

  goBack() {
    this.location.back();
  }
  selectedTab:any = '';

  isLast:any;
  ngOnInit(): void {
    this.userDetail = JSON.parse(localStorage.getItem("userSDetail"));
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.taskId) {
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
      placement_id: this.userDetail?.placement_id,
      student_id: this.userDetail?._id,
      task_id: taskId
    }
    this.service.getTaskDetail(payload).subscribe(async response => {
      this.taskDetail = response.result;
      this.taskDetail['safeVideoUrl']=  this.taskDetail.video_url
          ? this.getVideoUrl(this.taskDetail.video_url):''
    });
  }

   getVideoUrl(data: { video_url: string } | string | null): SafeResourceUrl | null {
        if (!data) return null;
  
        // Handle string input
        const url = typeof data === 'string' ? data : data.video_url;
        if (!url) return null;
  
        // YouTube URLs
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
        if (youtubeMatch) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
        }
  
        // Vimeo URLs
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/); // normal Vimeo page
        const vimeoPlayerMatch = url.match(/player\.vimeo\.com\/video\/(\d+)/); // already player URL
        const vimeoId = vimeoMatch ? vimeoMatch[1] : vimeoPlayerMatch ? vimeoPlayerMatch[1] : null;
  
        if (vimeoId) {
          return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoId}`);
        }
  
        // Unsupported URL
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
      }
  

  submitWorkflowVideo(task) {

    if(task.task_status === 'completed' || task.student_status === 'completed' || task.task_status === 'lock'){
      if(this.selectedTab.includes("ongoing")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'ongoing'}  });
      }else if(this.selectedTab.includes("pre-placement")){
        console.log("come here")
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'pre-placement'}  });
      }else if(this.selectedTab.includes("post-placement")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'post-placement'}  });
      }else if(this.selectedTab.includes("completed")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'completed'}  });
      }else{
         this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'pre-placement'}  });
      }
      return false;
    }
    const payload = {
      placement_id: this.userDetail?.placement_id,
      student_id: this.userDetail?._id,
      task_id: task._id,
      task_status: "completed",
      employee_status: "pending",
      type: 'student',
      attachments: task.file,
      video_url: task.video_url,
      document_types: task?.document_types,
      vacancy_id: this.userDetail?.vacancy_id,
      company_id: this.userDetail?.company_id,
      student_name: this.userDetail?.first_name + ' ' + this.userDetail?.last_name
    }
    this.service.submitWorkFlowVideo(payload).subscribe(res => {
      this.service.showMessage({
        message: "Task submitted successfully"
      });
      if(this.selectedTab.includes("ongoing")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'ongoing'}  });
      }else if(this.selectedTab.includes("pre-placement")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'pre-placement'}  });
      }else if(this.selectedTab.includes("post-placement")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'post-placement'}  });
      }else if(this.selectedTab.includes("completed")){
        this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'completed'}  });
      }else{
         this.router.navigate(['/student/my-placements'],  { queryParams: {stage: 'pre-placement'}  });
      }
      // this.getWorkFlowTask();
    }, err => {
      this.service.showMessage({
        message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
      });
    })
  }

  isYoutubeOrVimeoUrl(url: string): boolean {
    if (!url) return false;

    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+$/;
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(vimeo\.com\/\d+|player\.vimeo\.com\/video\/\d+)$/;

    return youtubeRegex.test(url) || vimeoRegex.test(url);
  }
  
  
}