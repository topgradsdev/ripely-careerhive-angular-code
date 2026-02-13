import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';

@Component({
  selector: 'app-video-intro',
  templateUrl: './video-intro.component.html',
  styleUrls: ['./video-intro.component.scss']
})
export class VideoIntroComponent implements OnInit {
  headingImageObj: any;
  HeadingImage1: any;
  HeadingImage2: any;
  selectedfile: any;
  image: any;

  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }
  
  headerSection = this.fb.group({
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  tipsSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(200)]],
    subheading: ['', [Validators.required, Validators.maxLength(200)]],
    is_visible: [''],
    tipsArray: this.fb.array([ ])
  });

  getStartedSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(200)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  ngOnInit(): void {
    this.getcontent();
  }

  get tipsArray(): FormArray {
    return this.tipsSection.get('tipsArray') as FormArray;
  }

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

  fun2(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  getcontent(){
    this.Service.videointrocontent().subscribe(data => {
      console.log("recruitment page content is ====>", data)
      
      this.HeadingImage1 = data.data.section_1.image
      this.HeadingImage2 = data.data.section_3.image
      


      this.headerSection.patchValue({
        Image:data.data.section_1.image,
        is_visible: data.data.section_1.is_visible
      })

      this.getStartedSection.patchValue({
        heading: data.data.section_3.heading,
        Image:data.data.section_3.image,
        is_visible: data.data.section_3.is_visible
      })

      this.tipsSection.patchValue({
        is_visible: data.data.section_2.is_visible,
        heading: data.data.section_2.heading,
        subheading: data.data.section_2.sub_heading,
      })

      data.data.section_2.image_heading.forEach((element) => {
        this.tipsArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          image: [element.image, [Validators.required]],
          county: ['']
        }));

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
      this.headerSection.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage1= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.headerSection.get('county').clearValidators(); // 6. Clear All Validators
      this.headerSection.get('county').updateValueAndValidity();
      console.log("rightextension", this.headerSection);
    } else {
      this.headerSection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.headerSection.get('county').updateValueAndValidity();

      console.log("wrongextension",this.headerSection);
    }
  }

  setHeadingImage1(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.getStartedSection.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage2= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.getStartedSection.get('county').clearValidators(); // 6. Clear All Validators
      this.getStartedSection.get('county').updateValueAndValidity();
      console.log("rightextension", this.getStartedSection);
    } else {
      this.getStartedSection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.getStartedSection.get('county').updateValueAndValidity();

      console.log("wrongextension",this.getStartedSection);
    }
  }

  onTipsChangeImage(e, index) {
    console.log("ind",index);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      this.Service.uploadbenefitmedia(formData).subscribe((resp: any) => {

        console.log("image response ==>", resp);

        this.tipsArray.at(index).patchValue({
          image: resp
        })
        console.log("full form",this.tipsSection)
      })
       this.tipsArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.tipsArray.controls[index].get('county').updateValueAndValidity();
      console.log("rightextension", this.tipsSection);
      console.log("gussa na dila", this.tipsArray);

    } else {
       this.tipsArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.tipsArray.controls[index].get('county').updateValueAndValidity();

      console.log("wrongectension",this.tipsSection);
      console.log("gussa na dila", this.tipsArray);
    }
  }

  postcontent(type){
    let obj: any
    console.log("type==>", type);
    if (type == 'header') {
      if (this.headerSection.valid) {
        const formdata = new FormData()
        if (this.headingImageObj) {
          console.log("yippeeeeeeee", this.headingImageObj);
          
          const section_1 = {
            is_visible: this.headerSection.controls['is_visible'].value
          }
          formdata.append("section_1",  JSON.stringify(section_1))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_1 = {
            is_visible: this.headerSection.controls['is_visible'].value,
            image: this.HeadingImage1
          }
          formdata.append("section_1", JSON.stringify(section_1))
          //formdata.append("image", this.HeadingImage1)
        }
        obj = formdata

      } else {
        this.headerSection.markAllAsTouched()
        return
      }
    }

    if (type == 'tips') {
      console.log("i am invalid");
      console.log(this.tipsSection)
      if (this.tipsSection.valid) {
        console.log("i am valid section");
        if (this.tipsArray.valid) {
          console.log("i am valid array");
          const formdata = new FormData()
          const section_2 = {image_heading:this.tipsSection.get('tipsArray').value,
            is_visible: this.tipsSection.controls['is_visible'].value,
            heading:this.tipsSection.controls['heading'].value,
            sub_heading:this.tipsSection.controls['subheading'].value
          }
          
          formdata.append("section_2", JSON.stringify(section_2))
          obj = formdata
        } else {
          this.tipsArray.markAllAsTouched()
          return
        }
      }
      else {
        this.tipsSection.markAllAsTouched()
        return
      }
    }

    if (type == 'getstart') {
      if (this.getStartedSection.valid) {
        const formdata = new FormData()
        if (this.headingImageObj) {
          console.log("yippeeeeeeee", this.headingImageObj);
          
          const section_3 = {
            is_visible: this.getStartedSection.controls['is_visible'].value,
            heading: this.getStartedSection.controls['heading'].value
          }
          formdata.append("section_3",  JSON.stringify(section_3))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_3 = {
            is_visible: this.getStartedSection.controls['is_visible'].value,
            heading: this.getStartedSection.controls['heading'].value,
            image: this.HeadingImage1
          }
          formdata.append("section_3", JSON.stringify(section_3))
          //formdata.append("image", this.HeadingImage1)
        }
        obj = formdata

      } else {
        this.getStartedSection.markAllAsTouched()
        return
      }
    }
    
    

    this.Service.postVideoIntroContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })
  }


}
