import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';

@Component({
  selector: 'app-add-video',
  templateUrl: './add-video.component.html',
  styleUrls: ['./add-video.component.scss']
})
export class AddVideoComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  type_article: any;
  headingImageObj: any;
  HeadingImage1: any;
  selectedfile2: any;
  import: boolean = false;
  youtubeUrl: any = false;
  youtubevideo: boolean = false;
  videoURL: any;
  videoURL2: any;
  uploadVideo: boolean = false;

  constructor(private _location: Location, private sanitizer: DomSanitizer, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }

  addVideoform = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    // order: ['', [Validators.required, Validators.max(10), Validators.min(1)]],
    // type: ['', [Validators.required, Validators.maxLength(50)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required]],
    postedby: ['', [Validators.required, Validators.maxLength(50)]],
    // postdescription: ['', [Validators.required]],
    Image: ['',],
    publication_date: ['', [Validators.required]],
    video: [''],
    importUrl: [''],
    is_visible: [''],
    county: [''],
    county1: ['']
  });

  ngOnInit(): void {
    this.type_article = " ";
  }

  video(event) {
    console.log(event.target.value);
    this.type_article = event.target.value;
    console.log("type============>", this.type_article);

  }

  setHeadingImage(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      const formData = new FormData();
      formData.append('image', this.headingImageObj);
      this.Service.uploadbenefitmedia(formData).subscribe((resp: any) => {

        console.log("image response ==>", resp);

        this.addVideoform.patchValue({
          Image: resp,
        })
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {

        this.HeadingImage1 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.addVideoform.get('county').clearValidators(); // 6. Clear All Validators
      this.addVideoform.get('county').updateValueAndValidity();
      console.log("rightextension", this.addVideoform);
    } else {
      this.addVideoform.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.addVideoform.get('county').updateValueAndValidity();

      console.log("wrongextension", this.addVideoform);
    }
  }

  onVideoChange(e) {
    console.log(e);
    this.uploadVideo = true;
    console.log(e.target.files[0].name);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log("videotype", fileType);
    if (fileType == "video") {
      this.selectedfile2 = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile2);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {

        console.log("video response ==>", resp);
// this.sanitizer.bypassSecurityTrustResourceUrl(
        this.videoURL = resp.file_name;
        this.addVideoform.patchValue({
          video: resp.file_name
        })
      })
      this.addVideoform.get('county1').clearValidators(); // 6. Clear All Validators
      this.addVideoform.get('county1').updateValueAndValidity();
      console.log("rightextension", this.addVideoform);
    }
    else {
      this.addVideoform.get('county1').setValidators([Validators.required]); // 5.Set Required Validator
      this.addVideoform.get('county1').updateValueAndValidity();

      console.log("wrongextension", this.addVideoform);
    }
  }

  postcontent() {
    let obj: any
    if (this.addVideoform.valid) {
      console.log("hmara form", this.addVideoform);

      const formdata = new FormData()
      console.log("yippeeeeeeee", this.headingImageObj);
      // formdata.append("article_type",  this.addVideoform.controls['type'].value)
      // formdata.append("order",  this.addVideoform.controls['order'].value)
      formdata.append("category", this.addVideoform.controls['category'].value)
      formdata.append("article_title", this.addVideoform.controls['title'].value)
      formdata.append("article_description", this.addVideoform.controls['description'].value)
      formdata.append("posted_by", this.addVideoform.controls['postedby'].value)
      formdata.append("date", this.addVideoform.controls['publication_date'].value)
      formdata.append("media", this.videoURL)
      formdata.append("article_type", 'video')
      // formdata.append("posted_description", this.addVideoform.controls['postdescription'].value)
      // if(this.addVideoform.controls['type'].value=='small_video_article'){
      //    const medias:any= [
      //     {
      //         "for":"main",
      //         "url":this.addVideoform.controls['Image'].value
      //     }
      // ]
      // const newmedia= JSON.stringify(medias)
      // console.log("newmedia==========>>>",newmedia);

      // formdata.append("medias",JSON.stringify(medias))
      // }

      // if(this.addVideoform.controls['type'].value=='large_video_article'){
      //   console.log("i am here false this.videoURL ----->>",this.videoURL);
      //   const medias:any= [
      //    {
      //        for:"main",
      //        url:this.addVideoform.controls['Image'].value
      //    },
      //    {
      //     for:"video",
      //     url:this.addVideoform.controls['video'].value.changingThisBreaksApplicationSecurity
      //    }
      //   ]
      //   const newmedia= JSON.stringify(medias)
      //   console.log("newmedia==========>>>",newmedia);

      //   formdata.append("medias",JSON.stringify(medias))
      // }





      obj = formdata
      console.log("formdata detail", formdata);

    } else {
      this.addVideoform.markAllAsTouched()
      return
    }

    console.log("objjjjjjjj===========>", obj);


    this.Service.addArticleContent(obj).subscribe((resp) => {

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

    console.log("import video youtube video value=======>>", this.import);
    this.youtubeUrl = this.addVideoform.controls.importUrl.value
    if (this.youtubeUrl.includes("youtube")) {
      this.youtubevideo = true;
      console.log(this.youtubeUrl.includes("youtube"));
      console.log("import youtube,,,, youtube video value=======>>", this.youtubevideo);
      const videoId = this.getId(this.youtubeUrl);
      console.log("youtube video id======>>>", videoId);
      const vid = "https://www.youtube.com/embed/" + videoId
      this.videoURL = vid;
      console.log("youtube url ", this.videoURL)
      this.videoURL2 = this.sanitizer.bypassSecurityTrustResourceUrl(vid);
      this.addVideoform.patchValue({
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
