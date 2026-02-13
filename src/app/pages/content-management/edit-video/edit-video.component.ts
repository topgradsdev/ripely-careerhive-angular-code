import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';


@Component({
  selector: 'app-edit-video',
  templateUrl: './edit-video.component.html',
  styleUrls: ['./edit-video.component.scss']
})
export class EditVideoComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  type_article: any;
  selectedfile2: any;
  import: boolean = false;
  youtubeUrl: any = false;
  youtubevideo: boolean = false;
  videoURL: any;
  videoURL2: any;
  uploadVideo: boolean = false;
  editVideoform: FormGroup
  mediaa:any
  video:any
  videoMedia:any

  constructor(
    private _location: Location,
    private sanitizer: DomSanitizer,
    private Service: TopgradserviceService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute) {
    this.editVideoform = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(200)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required]],
      postedby: ['', [Validators.required, Validators.maxLength(50)]],
      publication_date: ['', [Validators.required]],
      video: [''],
      importUrl: [''],
      is_visible: [''],
      county: [''],
      county1: ['']
    });
  }

  ngOnInit(): void {
    this.type_article = " ";
    this.getcontent()
  }
  getcontent() {
    var obj = {
      article_id: this.route.snapshot.paramMap.get('id')
    }
    this.Service.getArticleContent(obj).subscribe((resp) => {
      this.video = resp.data.medias?.find(x => x.for == 'video');
      this.mediaa = resp.data.media
      console.log("this.mediaa>>>>>", this.mediaa);
      this.editVideoform.patchValue({
        category: resp.data.category,
        order: resp.data.order,
        title: resp.data.article_title,
        type: resp.data.article_type,
        description: resp.data.article_description,
        postedby: resp.data.posted_by,
        postdescription: resp.data.posted_description,
        publication_date: resp.data.date
      })

      if (resp.data.article_type == "small_video_article") {
        this.type_article = "small_video_article"
      }
      else if (resp.data.article_type == "large_video_article") {
        this.type_article = "large_video_article"

        if (this.video?.url.includes("youtube")) {
          this.editVideoform.patchValue({
            importUrl: this.video?.url
          })
        }
        else {

          this.editVideoform.patchValue({
            Video: this.video?.url
          })
        }
      }

    })
  }



  
  onVideoChange(e,videoMedia) {
    this.videoMedia=videoMedia
    this.uploadVideo = true;
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "video") {
      this.selectedfile2 = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile2);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {
        this.videoURL = resp.file_name;
        this.editVideoform.patchValue({
          video: this.sanitizer.bypassSecurityTrustResourceUrl(resp.file_name)
        })
      })
      this.editVideoform.get('county1').clearValidators(); // 6. Clear All Validators
      this.editVideoform.get('county1').updateValueAndValidity();
    }
    else {
      this.editVideoform.get('county1').setValidators([Validators.required]); // 5.Set Required Validator
      this.editVideoform.get('county1').updateValueAndValidity();
    }
  }

  postcontent() {
    let obj: any
    if (this.editVideoform.valid) {
      const formdata = new FormData()
      formdata.append("article_id", this.route.snapshot.paramMap.get('id'))
      formdata.append("category", this.editVideoform.controls['category'].value)
      formdata.append("article_title", this.editVideoform.controls['title'].value)
      formdata.append("article_description", this.editVideoform.controls['description'].value)
      formdata.append("posted_by", this.editVideoform.controls['postedby'].value)
      formdata.append("date", this.editVideoform.controls['publication_date'].value)
      formdata.append("media", this.videoURL?this.videoURL:this.mediaa)
      formdata.append("article_type", 'video')
      obj = formdata
    } else {
      this.editVideoform.markAllAsTouched()
      return
    }
    this.Service.editArticleContent(obj).subscribe((resp) => {
      this.Service.showMessage({ message: "Submitted Successfully" })
      this.router.navigate(['/career-videos'])

    })
  }

  back() {
    this._location.back();
  }

  onImportUrl() {
    this.import = true;

  }

  importVideo() {
    this.youtubeUrl = this.editVideoform.controls.importUrl.value
    if (this.youtubeUrl.includes("youtube")) {
      this.youtubevideo = true;
      const videoId = this.getId(this.youtubeUrl);
      const vid = "https://www.youtube.com/embed/" + videoId
      this.videoURL = vid;
      this.videoURL2 = this.sanitizer.bypassSecurityTrustResourceUrl(vid);
      this.editVideoform.patchValue({
        video: this.videoURL2
      })
    }
  }

  getId(url: any) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11)
      ? match[2]
      : null;
  }



}
