import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../topgradservice.service';

@Component({
  selector: 'app-resume-builder-management',
  templateUrl: './resume-builder-management.component.html',
  styleUrls: ['./resume-builder-management.component.scss']
})
export class ResumeBuilderManagementComponent implements OnInit {
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
  content_id: string;
  selectedfile: any;

  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }
  
  headerSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(5000)]],
    subheading: ['', [Validators.required, Validators.maxLength(200)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  helpSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(5000)]],
    is_visible: [''],
    county:['']
  });
  
  resumetipsSection = this.fb.group({
    is_visible: [''],
    county:[''],
    'tipsArray': this.fb.array([ ])
  });

  stepsSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(5000)]],
    is_visible: [''],
    county:[''],
    'stepsArray': this.fb.array([ ])
  });

  startnowSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(5000)]],
    subheading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });





  ngOnInit(): void {
    this.getcontent();
    console.log("tips formmmmmmmmmmm",this.resumetipsSection)
    console.log("tips formmmmmmmmmmm",this.resumetipsSection)
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



  get tipsArray(): FormArray {
    return this.resumetipsSection.get('tipsArray') as FormArray;
  }

  get stepsArray(): FormArray {
    return this.stepsSection.get('stepsArray') as FormArray;
  }
  
  getcontent(){
    this.Service.resumebuildercontent().subscribe(data => {
      console.log("recruitment page content is ====>", data)
      
      this.HeadingImage1 = data.data.section_1.image
      this.HeadingImage2 = data.data.section_5.image
      


      this.headerSection.patchValue({
        heading: data.data.section_1.heading,
        subheading: data.data.section_1.sub_heading,
        Image:data.data.section_1.image,
        is_visible: data.data.section_1.is_visible
      })

      this.helpSection.patchValue({
        heading: data.data.section_2.heading,
        is_visible: data.data.section_2.is_visible
      })

     

      this.resumetipsSection.patchValue({
        is_visible: data.data.section_3.is_visible,
      })

      data.data.section_3.data.forEach((element) => {
        this.tipsArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          description: [element.description, [Validators.required, Validators.maxLength(5000)]],
          image: [element.image, [Validators.required]],
          county: ['']
        }));

      })
  


      this.stepsSection.patchValue({
        is_visible: data.data.section_4.is_visible,
        heading: data.data.section_4.heading
      })

      data.data.section_4.data.forEach((element) => {
        this.stepsArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          description: [element.description, [Validators.required, Validators.maxLength(5000)]]
        }));

      })

      this.startnowSection.patchValue({
        heading: data.data.section_5.heading,
        subheading: data.data.section_5.sub_heading,
        description: data.data.section_5.description,
        Image:data.data.section_5.image,
        is_visible: data.data.section_5.is_visible
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
      this.startnowSection.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage2= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.startnowSection.get('county').clearValidators(); // 6. Clear All Validators
      this.startnowSection.get('county').updateValueAndValidity();
      console.log("rightextension", this.startnowSection);
    } else {
      this.startnowSection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.startnowSection.get('county').updateValueAndValidity();

      console.log("wrongextension",this.startnowSection);
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
        console.log("full form",this.resumetipsSection)
      })
       this.tipsArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.tipsArray.controls[index].get('county').updateValueAndValidity();
      console.log("rightextension", this.resumetipsSection);
      console.log("gussa na dila", this.tipsArray);

    } else {
       this.tipsArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.tipsArray.controls[index].get('county').updateValueAndValidity();

      console.log("wrongectension",this.resumetipsSection);
      console.log("gussa na dila", this.tipsArray);
    }
  }



  postcontent(type){
    let obj: any
    console.log("type==>", type);
    if (type == 'header') {
      if (this.headerSection.valid) {
        const formdata = new FormData()
        
        this.content_id= "621c4bbd6f7babe92ccc9618"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_1 = {
            heading: this.headerSection.controls['heading'].value,
            sub_heading: this.headerSection.controls['subheading'].value,
            is_visible: this.headerSection.controls['is_visible'].value
          }
          formdata.append("section_1", JSON.stringify(section_1))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_1 = {
            heading: this.headerSection.controls['heading'].value,
            sub_heading: this.headerSection.controls['subheading'].value,
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

    if (type == 'help') {
      if (this.helpSection.valid) {
        const formdata = new FormData()
        const section_2 = {
          heading: this.helpSection.controls['heading'].value,
          is_visible: this.helpSection.controls['is_visible'].value
        }
        formdata.append("section_2", JSON.stringify(section_2))
        this.content_id= "621c4bbd6f7babe92ccc9618"
        formdata.append("content_id", this.content_id)
        obj = formdata

      } else {
        this.helpSection.markAllAsTouched()
        return
      }
    }

    if (type == 'startnow') {
      if (this.startnowSection.valid) {
        const formdata = new FormData()
        
        this.content_id= "621c4bbd6f7babe92ccc9618"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_5 = {
            heading: this.startnowSection.controls['heading'].value,
            sub_heading: this.startnowSection.controls['subheading'].value,
            description: this.startnowSection.controls['description'].value,
            is_visible: this.startnowSection.controls['is_visible'].value
          }
          formdata.append("section_5", JSON.stringify(section_5))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_5 = {
            heading: this.startnowSection.controls['heading'].value,
            sub_heading: this.startnowSection.controls['subheading'].value,
            description: this.startnowSection.controls['description'].value,
            is_visible: this.startnowSection.controls['is_visible'].value,
            image: this.HeadingImage2
          }
          formdata.append("section_5", JSON.stringify(section_5))
          //formdata.append("image", this.HeadingImage2)
        }
        obj = formdata

      } else {
        this.startnowSection.markAllAsTouched()
        return
      }
    }


    if (type == 'tips') {
      if (this.resumetipsSection.valid) {
        if (this.tipsArray.valid) {
          const formdata = new FormData()
          const section_3 = {data:this.resumetipsSection.get('tipsArray').value,
            is_visible: this.resumetipsSection.controls['is_visible'].value
          }
          
          formdata.append("section_3", JSON.stringify(section_3))
          this.content_id= "621c4bbd6f7babe92ccc9618"
          formdata.append("content_id", this.content_id)
          obj = formdata
        } else {
          this.tipsArray.markAllAsTouched()
          return
        }
      }
    }

    if (type == 'steps') {
      if (this.stepsSection.valid) {
        if (this.stepsArray.valid) {
          const formdata = new FormData()
          const section_4 = {data:this.stepsSection.get('stepsArray').value,
            is_visible: this.stepsSection.controls['is_visible'].value,
            heading:this.stepsSection.controls['heading'].value
          }
          
          formdata.append("section_4", JSON.stringify(section_4))
          this.content_id= "621c4bbd6f7babe92ccc9618"
          formdata.append("content_id", this.content_id)
          obj = formdata
        } else {
          this.stepsArray.markAllAsTouched()
          return
        }
      }
    }

    this.Service.postResumeBuilderContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })
  }



}
