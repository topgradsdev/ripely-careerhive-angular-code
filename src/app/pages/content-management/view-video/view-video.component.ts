import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { PlyrComponent } from 'ngx-plyr';
import {Location} from '@angular/common';


@Component({
  selector: 'app-view-video',
  templateUrl: './view-video.component.html',
  styleUrls: ['./view-video.component.scss']
})
export class ViewVideoComponent implements OnInit {

  @ViewChild(PlyrComponent)
plyr: PlyrComponent;
  

  articledetail: any;
  video: any;
  video_url: string = "";
  main_image: any;
  image_url: any;
  postedBy: any;
  firstChar: any;
  secondChar: any;
  video1:any 
  flag: boolean=true;
  player: Plyr;
  // plyr: PlyrComponent;
  author: any = {}
  videoSources: { src: string; type: string; }[];
  constructor(private _location: Location,private route:ActivatedRoute, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) {
    
   }

  ngOnInit(): void {
    this.getcontent();
  //   document.getElementById('playVid').onclick = function () {
  //     document.getElementById('video').play();
  // };
  }

  // videoSources: Plyr.Source[] = [
  //   {
  //     src: this.video_url,
  //     type: 'video/mp4'
  //   },
  // ];

  played(event: Plyr.PlyrEvent) {
    console.log('played', event);
  }

  play(): void {
    this.player.play(); // or this.plyr.player.play()
  }

  stop(): void {
    this.player.stop(); // or this.plyr.player.play()
  }

  

  
  play1(){
    this.video1= document.getElementById('video');
    console.log("VIDEOOOOOOOOOOOOOOOOO",this.video1);
    if(this.flag==true){
      console.log("11111111111",this.flag);
      
      this.video1.play();
      this.flag=false
      console.log("2222222222",this.flag);

    }
    else if(this.flag==false){
      console.log("33333333",this.flag);

      this.video1.pause();
      this.flag=true
      console.log("4444444444",this.flag);

    }
  
  }


   getcontent(){
    var obj={
      article_id:this.route.snapshot.paramMap.get('id')
    }

    this.Service.getArticleContent(obj).subscribe((resp) => {
      console.log("object============>",obj);
      
      console.log("response============>",resp);
      this.articledetail=resp.data;
      console.log("articledetail============>",this.articledetail);
      
      this.video=this.articledetail.medias.find(x => x.for == 'video');
      
      this.video_url=this.video?.url
      console.log("shubham============>",this.video_url);
      this.videoSources = [
        {
          src: this.video_url,
          type: 'video/mp4'
        },
      ];

      this.main_image=this.articledetail.medias.find(x => x.for == 'main');
      console.log("============>",this.main_image);
      this.image_url=this.main_image?.url

      var postedBy=resp.data.posted_by;
      console.log("=====================",this.hasWhiteSpace(postedBy))
      if(!this.hasWhiteSpace(postedBy)){
       
        this.firstChar  = postedBy.charAt(0);
        console.log("firstchar==========>",this.firstChar);
        this.secondChar  = postedBy.charAt(1);
        console.log("secondChar==========>",this.secondChar);
      }
      console.log("posteBy========>", postedBy);
      var splitted = postedBy.split(" ", 1); 
      console.log("var splitted========>",splitted);
      var splitted = postedBy.split(" ", 2); 
      console.log("var splitted========>",splitted);
      this.firstChar  = splitted[0].charAt(0);
      console.log("firstchar==========>",this.firstChar);
      this.secondChar  = splitted[1].charAt(0);
      console.log("secondChar==========>",this.secondChar);


     
      
      
      
    })
  }
   hasWhiteSpace(postedBy) {
        console.log("whitespeace");
        
        return postedBy.indexOf(' ') >= 0;
      }

  // or get it from plyrInit event
  
 
  
   back(){
    this._location.back();
   }


}
