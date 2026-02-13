import { Component, OnInit, ViewChild } from '@angular/core';
import { SafeHtml } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileIconService } from 'src/app/shared/file-icon.service';

@Component({
  selector: 'app-view-student-details',
  templateUrl: './view-student-details.component.html',
  styleUrls: ['./view-student-details.component.scss']
})
export class ViewStudentDetailsComponent implements OnInit {
  preference : boolean;
  studentProfile:any;
  constructor(private fileIconService: FileIconService) { }
  preferenceEdit(){
    this.preference = !this.preference
  }
  getSafeSvg(documentName: string): SafeHtml {
    return this.fileIconService.getFileIcon(documentName);
  }
  ngOnInit(): void {
  }

      // getVideoUrl(data){
      //   if(data && data.video_url){
      //      // YouTube: https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID
      //       const youtubeMatch = data.video_url.match(
      //         /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/
      //       );
      //       if (youtubeMatch) {
      //         return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${youtubeMatch[1]}`);
      //       }
  
      //       // Vimeo: https://vimeo.com/VIDEO_ID or https://player.vimeo.com/video/VIDEO_ID
      //       const vimeoMatch = data.video_url.match(
      //         /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/
      //       );
      //       if (vimeoMatch) {
      //         return this.sanitizer.bypassSecurityTrustResourceUrl(`https://player.vimeo.com/video/${vimeoMatch[1]}`);
      //       }
      //   }else{
      //       return null;
      //   }
  
      // }
  
    // @ViewChild('previewVideoInterview') public previewVideoInterview: ModalDirective;
     
  
    //   interviewList:any = [];
    //   selectedInterview:any = null;
    //   async getInterviewVideo(){
    //     this.service.getVideoInterview({student_id:this.studentProfile.student_id}).subscribe(async(res: any) => {
    //       if(res.status==200){
    //         this.interviewList = res.data;
    //       }else{
    //         this.service.showMessage({
    //           message: res.msg ? res.msg : 'Something went Wrong'
    //         });
    //         this.interviewList = [];
    //       }
    //     }, err => {
    //       this.service.showMessage({
    //         message: err.error.errors ? err.error.errors.msg : 'Something went Wrong'
    //       });
    //     })
    //     // await this.getStudentProfileById(this.documentpage);
    //     this.isEditContact = false;
    //     this.isthreeInfo=false;
    //     this.isEditAdminInfo=false;
    //   }
    //   updateChart() {
    //     this.radarChartData.datasets[0].data = this.ratings.map(r => r.value);
    //     this.radarChartData = { ...this.radarChartData }; // trigger change detection
    //     // this.chart?.update(); 
    //   }
    //    ratings = [
    //     { label: 'Communication & Coherence',name: 'Communication', value: 0 },
    //     { label: 'Critical Thinking',name: 'Critical Thinking', value: 0 },
    //     { label: 'Skills',name: 'Skills', value: 0 },
    //     { label: 'Teamwork & Collaboration', name: 'Teamwork', value: 0 },
    //     { label: 'Relevance & Content', name: 'Relevance', value: 0 },
    //   ];
    
    //    // Chart labels
    //   public radarChartLabels: string[] = this.ratings.map(r => r.name);
  
    
    //   // Radar chart data
    //   public radarChartData: ChartData<'radar'> = {
    //     labels: this.radarChartLabels,
    //     datasets: [
    //       {
    //         data: this.ratings.map(r => r.value),
    //         label: 'Ratings',
    //         fill: true,
    //         backgroundColor: 'rgba(63,81,181,0.2)',  // transparent blue
    //         borderColor: '#3f51b5',                  // blue border
    //         pointBackgroundColor: '#3f51b5',
    //         pointBorderColor: '#fff',
    //         pointHoverBackgroundColor: '#fff',
    //         pointHoverBorderColor: '#3f51b5'
    //       }
    //     ]
    //   };
    
    //   public radarChartType: ChartType = 'radar';
    
    //   public radarChartOptions: ChartConfiguration['options'] = {
    //     responsive: true,
    //     scales: {
    //       r: {
    //         ticks: {
    //           display: false // hide numbers (0,1,2,3,4,5)
    //         },
    //         angleLines: { color: '#e5e5e5' },
    //         grid: { color: '#f2f2f2' },
    //         pointLabels: { 
    //           color: '#333',
    //           font: { size: 12 }
    //         },
    //         suggestedMin: 0,
    //         suggestedMax: 5
    //       }
    //     },
    //     plugins: {
    //       legend: { display: false }
    //     }
    //   };
  
    //   updateRecords(data){
    //     this.ratings = data?.ratings?data?.ratings:this.ratings;
    //     console.log("this.ratings", this.ratings);
    //     this.selectedInterview = data;
    //     this.updateChart();
    //     this.previewVideoInterview.show();
    //   }

}
