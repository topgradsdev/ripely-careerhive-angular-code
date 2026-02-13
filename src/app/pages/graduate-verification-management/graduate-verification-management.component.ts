import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../topgradservice.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-graduate-verification-management',
  templateUrl: './graduate-verification-management.component.html',
  styleUrls: ['./graduate-verification-management.component.scss']
})
export class GraduateVerificationManagementComponent implements OnInit {
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
  selectedfile: any;

  constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) {}

  headerSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    subheading: ['', [Validators.required, Validators.maxLength(200)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  getverifiedSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    is_visible: [''],
    county:['']
  });

  

  verificationSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(500)]],
    price: ['', [Validators.required, Validators.maxLength(500),Validators.pattern("^[0-9]*$")]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });
  
  WhyVerifiedSection = this.fb.group({
    'is_visible': [''],
    'verificatonArray': this.fb.array([ ])
  });

  FAQSection = this.fb.group({
    'is_visible': [''],
    'FaqArray': this.fb.array([ ])
  });

  stepSection = this.fb.group({
    'is_visible': [''],
    'stepsArray': this.fb.array([ ])
  });



  ngOnInit(): void {
    this.getcontent();
    
  }

  fun(e:any){
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun1(e:any){
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun2(e:any){
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun3(e:any){
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun4(e:any){
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun5(e:any){
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  get verificatonArray(): FormArray {
    return this.WhyVerifiedSection.get('verificatonArray') as FormArray;
  }

  get FaqArray(): FormArray {
    return this.FAQSection.get('FaqArray') as FormArray;
  }

  get stepsArray(): FormArray {
    return this.stepSection.get('stepsArray') as FormArray;
  }

  getcontent(){
    this.Service.graduateVerificationcontent().subscribe(data => {
      this.HeadingImage1 = data.data.section_1.image
      this.HeadingImage2 = data.data.section_5.image
      


      this.headerSection.patchValue({
        heading: data.data.section_1.heading,
        subheading: data.data.section_1.sub_heading,
        Image:data.data.section_1.image,
        is_visible: data.data.section_1.is_visible
      })

      this.WhyVerifiedSection.patchValue({
        is_visible: data.data.section_2.is_visible
      })

      data.data.section_2.data.forEach((element) => {
        this.verificatonArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          description: [element.description, [Validators.required, Validators.maxLength(500)]],
          image: [element.image, [Validators.required]],
          county: ['']
        }));
      })

      this.getverifiedSection.patchValue({
        heading: data.data.section_3.heading,
        is_visible: data.data.section_3.is_visible
      })

      this.stepSection.patchValue({
        is_visible: data.data.section_4.is_visible
      })

      data.data.section_4.data.forEach((element) => {
        this.stepsArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          description: [element.description, [Validators.required, Validators.maxLength(500)]],
          image: [element.image, [Validators.required]],
          is_visible: [element.is_visible],
          endoresement_primary_id: [element._id],
          county: ['']
        }));
      })


      this.verificationSection.patchValue({
        heading: data.data.section_5.heading,
        description: data.data.section_5.description,
        price: data.data.section_5.price,
        Image:data.data.section_5.image,
        is_visible: data.data.section_5.is_visible
      })

      this.FAQSection.patchValue({
        is_visible: data.data.section_6.is_visible
      })

      data.data.section_6.question_answers.forEach((element) => {
        this.FaqArray.push(this.fb.group({
          question: [element.question, [Validators.required, Validators.maxLength(100)]],
          answer: [element.answer, [Validators.required, Validators.maxLength(500)]]
        }));
      })

    });
  }

  onVerificationChangeImage(e, index) {
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      this.Service.uploadbenefitmedia(formData).subscribe((resp: any) => {
        this.verificatonArray.at(index).patchValue({
          image: resp
        })
      })
       this.verificatonArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.verificatonArray.controls[index].get('county').updateValueAndValidity();

    } else {
       this.verificatonArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.verificatonArray.controls[index].get('county').updateValueAndValidity();
    }
  }


  onStepsChangeImage(e, index) {
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      this.Service.uploadbenefitmedia(formData).subscribe((resp: any) => {
        this.stepsArray.at(index).patchValue({
          image: resp
        })
      })
       this.stepsArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.stepsArray.controls[index].get('county').updateValueAndValidity();

    } else {
       this.stepsArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.stepsArray.controls[index].get('county').updateValueAndValidity();
    }
  }


  setHeadingImage(event) {
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
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
    } else {
      this.headerSection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.headerSection.get('county').updateValueAndValidity();
    }
  }

  setHeadingImage1(event) {
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.verificationSection.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage2= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.verificationSection.get('county').clearValidators(); // 6. Clear All Validators
      this.verificationSection.get('county').updateValueAndValidity();
    } else {
      this.verificationSection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.verificationSection.get('county').updateValueAndValidity();
    }
  }


  postcontent(type, id?){
    let obj: any
    if (type == 'header') {
      if (this.headerSection.valid) {
        const formdata = new FormData()
        
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
            image:this.HeadingImage1
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

    if (type == 'howVerified') {
      if (this.getverifiedSection.valid) {
        const formdata = new FormData()
        const section_3 = {
          heading: this.getverifiedSection.controls['heading'].value,
          is_visible: this.getverifiedSection.controls['is_visible'].value
        }
        formdata.append("section_3", JSON.stringify(section_3))
        obj = formdata

      } else {
        this.getverifiedSection.markAllAsTouched()
        return
      }
    }

    if (type == 'getverified') {
      if (this.verificationSection.valid) {
        const formdata = new FormData()
        
        if (this.headingImageObj) {
          const section_5 = {
            heading: this.verificationSection.controls['heading'].value,
            description: this.verificationSection.controls['description'].value,
            price: this.verificationSection.controls['price'].value,
            is_visible: this.verificationSection.controls['is_visible'].value
          }
          formdata.append("section_5", JSON.stringify(section_5))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_5 = {
            heading: this.verificationSection.controls['heading'].value,
            description: this.verificationSection.controls['description'].value,
            price: this.verificationSection.controls['price'].value,
            is_visible: this.verificationSection.controls['is_visible'].value,
            image:this.HeadingImage2
          }
          formdata.append("section_5", JSON.stringify(section_5))
          formdata.append("image", this.HeadingImage2)
        }
        obj = formdata

      } else {
        this.verificationSection.markAllAsTouched()
        return
      }
    }

    if (type == 'icons') {
      if (this.WhyVerifiedSection.valid) {
        if (this.verificatonArray.valid) {
          const formdata = new FormData()
          const section_2 = {data:this.WhyVerifiedSection.get('verificatonArray').value,
            is_visible: this.WhyVerifiedSection.controls['is_visible'].value
          }
          
          formdata.append("section_2", JSON.stringify(section_2))
          obj = formdata
        } else {
          this.verificatonArray.markAllAsTouched()
          return
        }
      }
    }

    


    if (type == 'faq') {
      if (this.FAQSection.valid) {
        if (this.FaqArray.valid) {
          const formdata = new FormData()
          const section_6 = {question_answers:this.FAQSection.get('FaqArray').value,
            is_visible: this.FAQSection.controls['is_visible'].value
          }
          
          formdata.append("section_6", JSON.stringify(section_6))
          obj = formdata
        } else {
          this.FaqArray.markAllAsTouched()
          return
        }
      }
    }

    this.Service.postGraduateVerificationContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })
  }

  poststepsArray(id){
    let obj: any
      if (this.stepSection.valid) {
        if (this.stepsArray.valid) {
          const formdata = new FormData()
          let ind = this.stepsArray.value.findIndex(val => val.endoresement_primary_id == id);
          formdata.append("heading",this.stepSection.get('stepsArray').value[ind].heading)
          formdata.append("description",this.stepSection.get('stepsArray').value[ind].description)
          formdata.append("image",this.stepSection.get('stepsArray').value[ind].image)
          formdata.append("endoresement_primary_id",this.stepSection.get('stepsArray').value[ind].endoresement_primary_id)
          formdata.append("is_visible",this.stepSection.get('stepsArray').value[ind].is_visible)
          obj = formdata
        } else {
          this.stepsArray.markAllAsTouched()
          return
        }
      }
      console.log("obj>>>>>>",obj);
      
      this.Service.poststepsArrayContent(obj).subscribe((resp) => {
        console.log("post steps array>>>",resp);
        

        this.Service.showMessage({ message: "Submitted Successfully" })
      })
    
  }




}
