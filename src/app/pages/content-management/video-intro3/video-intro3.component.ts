import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';

@Component({
  selector: 'app-video-intro3',
  templateUrl: './video-intro3.component.html',
  styleUrls: ['./video-intro3.component.scss']
})
export class VideoIntro3Component implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  headingImageObj: any;
  HeadingImage1: any;
  HeadingImage2: any;

  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getcontent();
  }
  
  step1Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  step2Section = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  fun(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun1(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  getcontent(){
    this.Service.videointrocontent().subscribe(data => {
      console.log("recruitment page content is ====>", data)
      
      this.HeadingImage1 = data.data.section_9.image
      this.HeadingImage2 = data.data.section_10.image
      


      this.step1Section.patchValue({
        heading: data.data.section_9.heading,
        description: data.data.section_9.description,
        Image:data.data.section_9.image,
        is_visible: data.data.section_9.is_visible
      })

      this.step2Section.patchValue({
        description: data.data.section_10.description,
        Image:data.data.section_10.image,
        is_visible: data.data.section_10.is_visible
      })

      
    });
  }

  setHeadingImage(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.step1Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage1= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.step1Section.get('county').clearValidators(); // 6. Clear All Validators
      this.step1Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.step1Section);
    } else {
      this.step1Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.step1Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.step1Section);
    }
  }

  setHeadingImage1(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.step2Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage2= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.step2Section.get('county').clearValidators(); // 6. Clear All Validators
      this.step2Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.step2Section);
    } else {
      this.step2Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.step2Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.step2Section);
    }
  }


  postcontent(type){
    let obj: any
    console.log("type==>", type);
    if (type == 'step1') {
      console.log("i am step1 in", this.step1Section);
      
      if (this.step1Section.valid) {
        console.log("i am valid step 1", this.step1Section);
        
        const formdata = new FormData()
        if (this.headingImageObj) {
          console.log("yippeeeeeeee", this.headingImageObj);
          
          const section_9 = {
            is_visible: this.step1Section.controls['is_visible'].value,
            heading: this.step1Section.controls['heading'].value,
            description: this.step1Section.controls['description'].value
          }
          formdata.append("section_9",  JSON.stringify(section_9))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_9 = {
            is_visible: this.step1Section.controls['is_visible'].value,
            heading: this.step1Section.controls['heading'].value,
            description: this.step1Section.controls['description'].value,
            image: this.HeadingImage1
          }
          formdata.append("section_9", JSON.stringify(section_9))
          //formdata.append("image", this.HeadingImage1)
        }
        obj = formdata

      } else {
        this.step1Section.markAllAsTouched()
        return
      }
    }
    
    if (type == 'step2') {
      console.log("i am step1 in", this.step2Section);
      
      if (this.step2Section.valid) {
        console.log("i am valid step 1", this.step2Section);
        
        const formdata = new FormData()
        if (this.headingImageObj) {
          console.log("yippeeeeeeee", this.headingImageObj);
          
          const section_10 = {
            is_visible: this.step2Section.controls['is_visible'].value,
            description: this.step2Section.controls['description'].value
          }
          formdata.append("section_10",  JSON.stringify(section_10))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_10 = {
            is_visible: this.step2Section.controls['is_visible'].value,
            description: this.step2Section.controls['description'].value,
            image: this.HeadingImage2
          }
          formdata.append("section_10", JSON.stringify(section_10))
          //formdata.append("image", this.HeadingImage1)
        }
        obj = formdata

      } else {
        this.step2Section.markAllAsTouched()
        return
      }
    }
    

    this.Service.postVideoIntroContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })
  }


}
