import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  HeadingImage: any
  headingImageObj: any = null
  textFieldsArray=[]

  headerSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });
  Champions = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    heading1: ['', [Validators.required, Validators.maxLength(50)]],
    is_visible: ['',]
  });
  ourVision = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(500)]],
    heading: ['', [Validators.required, Validators.maxLength(100)]],
    is_visible: ['',]
  });
  ourMission = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(500)]],
    heading: ['', [Validators.required, Validators.maxLength(100)]],
    is_visible: ['',]

  });
  jobOpenings = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(500)]],
    heading: ['', [Validators.required, Validators.maxLength(100)]],
    is_visible: ['',]
  });

  TopGraduates = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(100)]],
    is_visible: ['',],
    Fields:  this.fb.array([])
   

  });
  uintArray: any;




  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }



  ngOnInit(): void {
    this.getAboutUsData()
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

  fun3(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun4(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun5(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  get Fields(): FormArray {
    return this.TopGraduates.get('Fields') as FormArray;
  }


  getAboutUsData() {
    this.Service.getAboutUsData().subscribe((resp: any) => {

     
      console.log("getAboutUsData Resp ==>", resp.data);
      this.HeadingImage = resp.data.section_1.image
      
      this.headerSection.patchValue({
        heading: resp.data.section_1.heading,
        description: resp.data.section_1.description,
        Image: resp.data.section_1.image,
        is_visible: resp.data.section_1.is_visible,


      })
      this.Champions.patchValue({
        heading: resp.data.section_2.heading_1,
        heading1: resp.data.section_2.heading_2,
        is_visible: resp.data.section_2.is_visible

      })
      this.ourVision.patchValue({
        heading: resp.data.section_3.heading,
        description: resp.data.section_3.description,
        is_visible: resp.data.section_3.is_visible

      })
      this.ourMission.patchValue({
        heading: resp.data.section_4.heading,
        description: resp.data.section_4.description,
        is_visible: resp.data.section_4.is_visible

      })
      this.jobOpenings.patchValue({
        heading: resp.data.section_5.heading,
        description: resp.data.section_5.description,
        is_visible: resp.data.section_5.is_visible

      })
      this.TopGraduates.patchValue({
        heading: resp.data.section_6.heading,
        is_visible: resp.data.section_5.is_visible

      })
      resp.data.section_6.text.forEach(element => {
        this.Fields.push(this.fb.control(element,[Validators.required, Validators.maxLength(100)]))
       
        
      });




    })

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
        this.HeadingImage = event.target.result;
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
  postAboutUsdata(type) {
    let obj: any
    console.log("type==>",type);
    
    if (type == 'headerSection') {
      console.log(this.headerSection);
      if (this.headerSection.valid) {
        console.log(this.headerSection);
        
        const formdata = new FormData()

        if (this.headingImageObj) {
          const section_1 = {
            heading: this.headerSection.controls['heading'].value,
            description: this.headerSection.controls['description'].value,
            is_visible: this.headerSection.controls['is_visible'].value,
          }
          
          formdata.append("section_1", JSON.stringify(section_1))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_1 = {
            heading: this.headerSection.controls['heading'].value,
            description: this.headerSection.controls['description'].value,
            is_visible: this.headerSection.controls['is_visible'].value,
            image:this.headerSection.controls['Image'].value
          }
          
          formdata.append("section_1", JSON.stringify(section_1))
          // formdata.append("image", this.HeadingImage)
        }
        obj = formdata
        //console.log("our binary image is ======>",obj,this.uintArray[i]);
        

      } else {
        this.headerSection.markAllAsTouched()
        return 
      }
    }
    if (type == "Champions") {
      if (this.Champions.valid) {
        const formdata = new FormData()
        const section_2 = {
          heading: this.Champions.controls['heading'].value,
          heading1: this.Champions.controls['heading1'].value,
          is_visible: this.Champions.controls['is_visible'].value
        }
        console.log("stringifyyyyyyy",section_2);
        
        const formData=new FormData()
        formData.append('section_2',JSON.stringify(section_2))
        obj = formData
    }else{
      this.Champions.markAllAsTouched()
      return 
    }
  }
    if (type == "ourVision") {
      if (this.ourVision.valid) {
        const formdata = new FormData()
        const section_3 = {
          heading: this.ourVision.controls['heading'].value,
          description: this.ourVision.controls['description'].value,
          is_visible: this.ourVision.controls['is_visible'].value
        }
        const formData=new FormData()
        formData.append('section_3',JSON.stringify(section_3))
        obj = formData
    }else{
      this.ourVision.markAllAsTouched()
      return 
    }
    }
    if (type == "ourMission") {
      if (this.ourMission.valid) {
        const formdata = new FormData()
        const section_4 = {
          heading: this.ourMission.controls['heading'].value,
          description: this.ourMission.controls['description'].value,
          is_visible: this.ourMission.controls['is_visible'].value
        }
        const formData=new FormData()
        formData.append('section_4',JSON.stringify(section_4))
        obj = formData
    }else{
      this.ourMission.markAllAsTouched()
      return 
    }

    }
    if (type == "jobOpenings") {
      if (this.jobOpenings.valid) {
        const formdata = new FormData()
        const section_5 = {
          heading: this.jobOpenings.controls['heading'].value,
          description: this.jobOpenings.controls['description'].value,
          is_visible: this.jobOpenings.controls['is_visible'].value
        }
        const formData=new FormData()
        formData.append('section_5',JSON.stringify(section_5))
        obj = formData
    }else{
      this.jobOpenings.markAllAsTouched()
      return 
    }
    }
    if (type == "TopGraduates") {
      if (this.TopGraduates.valid) {
        const formdata = new FormData()
        const section_6 = {
          heading: this.TopGraduates.controls['heading'].value,
          text:this.TopGraduates.controls['Fields'].value,
          is_visible: this.TopGraduates.controls['is_visible'].value
        }
        const formData=new FormData()
        formData.append('section_6',JSON.stringify(section_6))
        obj = formData
    }else{
      this.TopGraduates.markAllAsTouched()
      return 
    }
    }
    this.Service.postAboutUsdata(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })



  }


}
