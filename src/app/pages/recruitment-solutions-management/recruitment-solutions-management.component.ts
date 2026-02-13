import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../topgradservice.service';

@Component({
  selector: 'app-recruitment-solutions-management',
  templateUrl: './recruitment-solutions-management.component.html',
  styleUrls: ['./recruitment-solutions-management.component.scss']
})
export class RecruitmentSolutionsManagementComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  headerform: FormGroup
  HeadingImage: any
  HeadingImage1: any
  HeadingImage2: any
  HeadingImage3: any
  HeadingImage4: any
  HeadingImage5: any
  HeadingImage6: any
  HeadingImage7: any
  HeadingImage8: any
  is_visible: any
  headingImageObj: any = null
  headingImageObj1: any = null

  headerSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(200)]],
    subheading: ['', [Validators.required, Validators.maxLength(200)]],
    Image: ['',],
    is_visible: [''],
    county:['']
  });

  whytopgraduatesSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(5000)]],
    is_visible: ['',],
    county:['']
  });

  agencySection = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    image: ['',],
    is_visible: ['',],
    county:['']
  });

  essentialsSection = this.fb.group({
    description: ['', [Validators.required, Validators.maxLength(10000)]],
    is_visible: ['',],
    county:['']
  });

  recruitment1Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });

  recruitment2Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });

  recruitment3Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });

  recruitment4Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });

  recruitment5Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });

  recruitment6Section = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    Image: ['',],
    is_visible: ['',],
    county:['']
  });

  storiesSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(5000)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    is_visible: ['',],
    county:['']
  });

  knowmoreSection = this.fb.group({
    heading: ['', [Validators.required, Validators.maxLength(500)]],
    description: ['', [Validators.required, Validators.maxLength(5000)]],
    is_visible: ['',],
    county:['']
  });

  testimonialsSection = this.fb.group({
    name1: ['', [Validators.required, Validators.maxLength(50)]],
    description1: ['', [Validators.required, Validators.maxLength(5000)]],
    designation1: ['', [Validators.required, Validators.maxLength(50)]],
    name2: ['', [Validators.required, Validators.maxLength(50)]],
    description2: ['', [Validators.required, Validators.maxLength(5000)]],
    designation2: ['', [Validators.required, Validators.maxLength(50)]],
    is_visible: ['',],
    Image: ['',],
    Image1: ['',],
    county:[''],
    county1:['']
  });

  benefitsSection = this.fb.group({
    'is_visible': [''],
    'benefitsArray': this.fb.array([ ])
  });

  content_id: string;
  HeadingImage11: any;
  selectedfile: any;
  HeadingImage9: any;


constructor(private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getcontent();
    console.log("asmaan me jese baadal ho rhe hain",this.benefitsSection);
    
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

  fun6(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun7(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun8(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun9(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun10(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun11(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun12(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun13(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  get benefitsArray(): FormArray {
    return this.benefitsSection.get('benefitsArray') as FormArray;
  }

  getcontent(){
    this.Service.recruitmentcontent().subscribe(data => {
      console.log("recruitment page content is ====>", data)
      this.HeadingImage = data.data.section_1.image
      this.HeadingImage1 = data.data.section_6.image
      this.HeadingImage2 = data.data.section_7.image
      this.HeadingImage3 = data.data.section_8.image
      this.HeadingImage4 = data.data.section_9.image
      this.HeadingImage5 = data.data.section_10.image
      this.HeadingImage6 = data.data.section_11.image
      this.HeadingImage7 = data.data.section_12.image1
      this.HeadingImage8 = data.data.section_12.image2
      this.HeadingImage9 = data.data.section_3.image


      this.headerSection.patchValue({
        heading: data.data.section_1.heading,
        subheading: data.data.section_1.description,
        Image:data.data.section_1.image,
        is_visible: data.data.section_1.is_visible
      })

      this.whytopgraduatesSection.patchValue({
        heading: data.data.section_2.heading,
        is_visible: data.data.section_2.is_visible
      })

      this.agencySection.patchValue({
        description: data.data.section_3.heading,
        image:data.data.section_3.image,
        is_visible: data.data.section_3.is_visible
      })

      this.essentialsSection.patchValue({
        description: data.data.section_5.description,
        is_visible: data.data.section_5.is_visible
      })

      this.recruitment1Section.patchValue({
        heading: data.data.section_6.heading,
        description: data.data.section_6.description,
        Image:data.data.section_6.image,
        is_visible: data.data.section_6.is_visible
      })

      this.recruitment2Section.patchValue({
        heading: data.data.section_7.heading,
        description: data.data.section_7.description,
        Image:data.data.section_7.image,
        is_visible: data.data.section_7.is_visible
      })

      this.recruitment3Section.patchValue({
        heading: data.data.section_8.heading,
        description: data.data.section_8.description,
        Image:data.data.section_8.image,
        is_visible: data.data.section_8.is_visible
      })

      this.recruitment4Section.patchValue({
        heading: data.data.section_9.heading,
        description: data.data.section_9.description,
        Image:data.data.section_9.image,
        is_visible: data.data.section_9.is_visible
      })

      this.recruitment5Section.patchValue({
        heading: data.data.section_10.heading,
        description: data.data.section_10.description,
        Image:data.data.section_10.image,
        is_visible: data.data.section_10.is_visible
      })

      this.recruitment6Section.patchValue({
        heading: data.data.section_11.heading,
        description: data.data.section_11.description,
        Image:data.data.section_11.image,
        is_visible: data.data.section_11.is_visible
      })

      this.testimonialsSection.patchValue({
        name1: data.data.section_12.heading1,
        description1: data.data.section_12.description1,
        designation1: data.data.section_12.degiganation1,
        Image1:data.data.section_12.image1,
        name2: data.data.section_12.heading2,
        description2: data.data.section_12.description2,
        designation2: data.data.section_12.degiganation2,
        Image2:data.data.section_12.image2,
        is_visible: data.data.section_12.is_visible
      })

      this.storiesSection.patchValue({
        heading: data.data.section_13.heading,
        description: data.data.section_13.description,
        is_visible: data.data.section_13.is_visible
      })

      this.knowmoreSection.patchValue({
        heading: data.data.section_14.heading,
        description: data.data.section_14.description,
        is_visible: data.data.section_14.is_visible
      })
      
      this.benefitsSection.patchValue({
        is_visible: data.data.section_4.is_visible
      })

      data.data.section_4.data.forEach((element) => {
        this.benefitsArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          description: [element.description, [Validators.required, Validators.maxLength(5000)]],
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

  setHeadingImage1(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.recruitment1Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage1 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.recruitment1Section.get('county').clearValidators(); // 6. Clear All Validators
      this.recruitment1Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.recruitment1Section);
    } else {
      this.recruitment1Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.recruitment1Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.recruitment1Section);
    }
  }

  setHeadingImage2(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.recruitment2Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage2 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.recruitment2Section.get('county').clearValidators(); // 6. Clear All Validators
      this.recruitment2Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.recruitment2Section);
    } else {
      this.recruitment2Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.recruitment2Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.recruitment2Section);
    }
  }


  setHeadingImage3(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.recruitment3Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage3 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.recruitment3Section.get('county').clearValidators(); // 6. Clear All Validators
      this.recruitment3Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.recruitment3Section);
    } else {
      this.recruitment3Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.recruitment3Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.recruitment3Section);
    }
  }

  setHeadingImage4(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.recruitment4Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage4 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.recruitment4Section.get('county').clearValidators(); // 6. Clear All Validators
      this.recruitment4Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.recruitment4Section);
    } else {
      this.recruitment4Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.recruitment4Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.recruitment4Section);
    }
  }

  setHeadingImage5(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.recruitment5Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage5 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.recruitment5Section.get('county').clearValidators(); // 6. Clear All Validators
      this.recruitment5Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.recruitment5Section);
    } else {
      this.recruitment5Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.recruitment5Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.recruitment5Section);
    }
  }

  setHeadingImage6(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.recruitment6Section.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage6 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.recruitment6Section.get('county').clearValidators(); // 6. Clear All Validators
      this.recruitment6Section.get('county').updateValueAndValidity();
      console.log("rightextension", this.recruitment6Section);
    } else {
      this.recruitment6Section.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.recruitment6Section.get('county').updateValueAndValidity();

      console.log("wrongextension",this.recruitment6Section);
    }
  }


  setHeadingImage7(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.testimonialsSection.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage7 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.testimonialsSection.get('county').clearValidators(); // 6. Clear All Validators
      this.testimonialsSection.get('county').updateValueAndValidity();
      console.log("rightextension", this.testimonialsSection);
    } else {
      this.testimonialsSection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.testimonialsSection.get('county').updateValueAndValidity();

      console.log("wrongextension",this.testimonialsSection);
    }
  }


  setHeadingImage8(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj1 = event.target.files[0]
      this.testimonialsSection.patchValue({
        Image1: this.headingImageObj1,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage8 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj1);
      this.testimonialsSection.get('county1').clearValidators(); // 6. Clear All Validators
      this.testimonialsSection.get('county1').updateValueAndValidity();
      console.log("rightextension", this.testimonialsSection);
    } else {
      this.testimonialsSection.get('county1').setValidators([Validators.required]); // 5.Set Required Validator
      this.testimonialsSection.get('county1').updateValueAndValidity();

      console.log("wrongextension",this.testimonialsSection);
    }
  }

  setHeadingImage9(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.agencySection.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage9 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.agencySection.get('county').clearValidators(); // 6. Clear All Validators
      this.agencySection.get('county').updateValueAndValidity();
      console.log("rightextension", this.agencySection);
    } else {
      this.agencySection.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.agencySection.get('county').updateValueAndValidity();

      console.log("wrongextension",this.agencySection);
    }
  }

  onBenefitChangeImage(e, index) {
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

        this.benefitsArray.at(index).patchValue({
          image: resp
        })
        console.log("full form",this.benefitsSection)
      })
       this.benefitsArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.benefitsArray.controls[index].get('county').updateValueAndValidity();
      console.log("rightextension", this.benefitsSection);
      console.log("gussa na dila", this.benefitsArray);

    } else {
       this.benefitsArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.benefitsArray.controls[index].get('county').updateValueAndValidity();

      console.log("wrongectension",this.benefitsSection);
      console.log("gussa na dila", this.benefitsArray);
    }
  }





  postcontent(type){
    let obj: any
    console.log("type==>", type);
    if (type == 'header') {
      if (this.headerSection.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_1 = {
            heading: this.headerSection.controls['heading'].value,
            description: this.headerSection.controls['subheading'].value,
            is_visible: this.headerSection.controls['is_visible'].value
          }
          formdata.append("section_1", JSON.stringify(section_1))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_1 = {
            heading: this.headerSection.controls['heading'].value,
            description: this.headerSection.controls['subheading'].value,
            is_visible: this.headerSection.controls['is_visible'].value,
            image: this.headerSection.controls['Image'].value,
          }
          formdata.append("section_1", JSON.stringify(section_1))
          //formdata.append("image", this.HeadingImage)
        }
        obj = formdata

      } else {
        this.headerSection.markAllAsTouched()
        return
      }
    }


    if (type == 'whygraduates') {
      if (this.whytopgraduatesSection.valid) {
        const formdata = new FormData()
        const section_2 = {
          heading: this.whytopgraduatesSection.controls['heading'].value,
          is_visible: this.whytopgraduatesSection.controls['is_visible'].value
        }
        formdata.append("section_2", JSON.stringify(section_2))
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        
        obj = formdata

      } else {
        this.whytopgraduatesSection.markAllAsTouched()
        return
      }
    }

    if (type == 'agency') {
      if (this.agencySection.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_3 = {
            heading: this.agencySection.controls['description'].value,
            is_visible: this.agencySection.controls['is_visible'].value
          }
          formdata.append("section_3", JSON.stringify(section_3))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_3 = {
            heading: this.agencySection.controls['description'].value,
            is_visible: this.agencySection.controls['is_visible'].value,
            image:this.agencySection.controls['image'].value
          }
          formdata.append("section_3", JSON.stringify(section_3))
          //formdata.append("image", this.HeadingImage9)
        }
        obj = formdata

      } else {
        this.agencySection.markAllAsTouched()
        return
      }
    }

    if (type == 'essentials') {
      if (this.essentialsSection.valid) {
        const formdata = new FormData()
        const section_5 = {
          description: this.essentialsSection.controls['description'].value,
          is_visible: this.essentialsSection.controls['is_visible'].value
        }
        formdata.append("section_5", JSON.stringify(section_5))
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        obj = formdata

      } else {
        this.essentialsSection.markAllAsTouched()
        return
      }
    }

    if (type == 'recruitment1') {
      if (this.recruitment1Section.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_6 = {
            heading: this.recruitment1Section.controls['heading'].value,
            description: this.recruitment1Section.controls['description'].value,
            is_visible: this.recruitment1Section.controls['is_visible'].value
          }
          formdata.append("section_6", JSON.stringify(section_6))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_6 = {
            heading: this.recruitment1Section.controls['heading'].value,
            description: this.recruitment1Section.controls['description'].value,
            is_visible: this.recruitment1Section.controls['is_visible'].value,
            image: this.recruitment1Section.controls['Image'].value
          }
          formdata.append("section_6", JSON.stringify(section_6))
          //formdata.append("image", this.HeadingImage1)
        }
        obj = formdata

      } else {
        this.recruitment1Section.markAllAsTouched()
        return
      }
    }


    if (type == 'recruitment2') {
      if (this.recruitment2Section.valid) {
        const formdata = new FormData()
       
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_7 = {
            heading: this.recruitment2Section.controls['heading'].value,
            description: this.recruitment2Section.controls['description'].value,
            is_visible: this.recruitment2Section.controls['is_visible'].value
          }
          formdata.append("section_7", JSON.stringify(section_7))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_7 = {
            heading: this.recruitment2Section.controls['heading'].value,
            description: this.recruitment2Section.controls['description'].value,
            is_visible: this.recruitment2Section.controls['is_visible'].value,
            image: this.recruitment2Section.controls['Image'].value
          }
          formdata.append("section_7", JSON.stringify(section_7))
          //formdata.append("image", this.HeadingImage2)
        }
        obj = formdata

      } else {
        this.recruitment2Section.markAllAsTouched()
        return
      }
    }

    if (type == 'recruitment3') {
      if (this.recruitment3Section.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_8 = {
            heading: this.recruitment3Section.controls['heading'].value,
            description: this.recruitment3Section.controls['description'].value,
            is_visible: this.recruitment3Section.controls['is_visible'].value
          }
          formdata.append("section_8", JSON.stringify(section_8))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_8 = {
            heading: this.recruitment3Section.controls['heading'].value,
            description: this.recruitment3Section.controls['description'].value,
            is_visible: this.recruitment3Section.controls['is_visible'].value,
            image: this.recruitment3Section.controls['Image'].value
          }
          formdata.append("section_8", JSON.stringify(section_8))
          //formdata.append("image", this.HeadingImage3)
        }
        obj = formdata

      } else {
        this.recruitment3Section.markAllAsTouched()
        return
      }
    }

    if (type == 'recruitment4') {
      if (this.recruitment4Section.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_9 = {
            heading: this.recruitment4Section.controls['heading'].value,
            description: this.recruitment4Section.controls['description'].value,
            is_visible: this.recruitment4Section.controls['is_visible'].value
          }
          formdata.append("section_9", JSON.stringify(section_9))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_9 = {
            heading: this.recruitment4Section.controls['heading'].value,
            description: this.recruitment4Section.controls['description'].value,
            is_visible: this.recruitment4Section.controls['is_visible'].value,
            image: this.recruitment4Section.controls['Image'].value
          }
          formdata.append("section_9", JSON.stringify(section_9))
          //formdata.append("image", this.HeadingImage4)
        }
        obj = formdata

      } else {
        this.recruitment4Section.markAllAsTouched()
        return
      }
    }

    if (type == 'recruitment5') {
      if (this.recruitment5Section.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_10 = {
            heading: this.recruitment5Section.controls['heading'].value,
            description: this.recruitment5Section.controls['description'].value,
            is_visible: this.recruitment5Section.controls['is_visible'].value
          }
          formdata.append("section_10", JSON.stringify(section_10))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_10 = {
            heading: this.recruitment5Section.controls['heading'].value,
            description: this.recruitment5Section.controls['description'].value,
            is_visible: this.recruitment5Section.controls['is_visible'].value,
            image: this.recruitment5Section.controls['Image'].value
          }
          formdata.append("section_10", JSON.stringify(section_10))
          //formdata.append("image", this.HeadingImage5)
        }
        obj = formdata

      } else {
        this.recruitment5Section.markAllAsTouched()
        return
      }
    }


    if (type == 'recruitment6') {
      if (this.recruitment6Section.valid) {
        const formdata = new FormData()
        
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          const section_11 = {
            heading: this.recruitment6Section.controls['heading'].value,
            description: this.recruitment6Section.controls['description'].value,
            is_visible: this.recruitment6Section.controls['is_visible'].value
          }
          formdata.append("section_11", JSON.stringify(section_11))
          formdata.append("image", this.headingImageObj)
        }
        else{
          const section_11 = {
            heading: this.recruitment6Section.controls['heading'].value,
            description: this.recruitment6Section.controls['description'].value,
            is_visible: this.recruitment6Section.controls['is_visible'].value,
            image: this.recruitment6Section.controls['Image'].value
          }
          formdata.append("section_11", JSON.stringify(section_11))
          //formdata.append("image", this.HeadingImage6)
        }
        obj = formdata

      } else {
        this.recruitment6Section.markAllAsTouched()
        return
      }
    }

    if (type == 'testimonials') {
      if (this.testimonialsSection.valid) {
        console.log("both testimonials", this.testimonialsSection);
        
        const formdata = new FormData()
        const section_12 = {
          heading1: this.testimonialsSection.controls['name1'].value,
          description1: this.testimonialsSection.controls['description1'].value,
          degiganation1: this.testimonialsSection.controls['designation1'].value,
          heading2: this.testimonialsSection.controls['name2'].value,
          description2: this.testimonialsSection.controls['description2'].value,
          degiganation2: this.testimonialsSection.controls['designation2'].value,
          is_visible: this.testimonialsSection.controls['is_visible'].value,
          image1: this.HeadingImage7,
          image2: this.HeadingImage8
        }
        formdata.append("section_12", JSON.stringify(section_12))
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        if (this.headingImageObj) {
          formdata.append("image1", this.headingImageObj)
        }
        
        if (this.headingImageObj1) {
          formdata.append("image2", this.headingImageObj1)
        }
        
        obj = formdata

      } else {
        this.testimonialsSection.markAllAsTouched()
        return
      }
    }

    if (type == 'stories') {
      if (this.storiesSection.valid) {
        const formdata = new FormData()
        const section_13 = {
          heading: this.storiesSection.controls['heading'].value,
          description: this.storiesSection.controls['description'].value,
          is_visible: this.storiesSection.controls['is_visible'].value
        }
        formdata.append("section_13", JSON.stringify(section_13))
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        obj = formdata

      } else {
        this.storiesSection.markAllAsTouched()
        return
      }
    }

    if (type == 'knowmore') {
      if (this.knowmoreSection.valid) {
        const formdata = new FormData()
        const section_14 = {
          heading: this.knowmoreSection.controls['heading'].value,
          description: this.knowmoreSection.controls['description'].value,
          is_visible: this.knowmoreSection.controls['is_visible'].value
        }
        formdata.append("section_14", JSON.stringify(section_14))
        this.content_id= "6214a49299814ab6e4f4338e"
        formdata.append("content_id", this.content_id)
        obj = formdata

      } else {
        this.knowmoreSection.markAllAsTouched()
        return
      }
    }


    if (type == 'benefits') {
      if (this.benefitsSection.valid) {
        if (this.benefitsArray.valid) {
          const formdata = new FormData()
          const section_4 = {data:this.benefitsSection.get('benefitsArray').value,
            is_visible: this.benefitsSection.controls['is_visible'].value
          }
          
          formdata.append("section_4", JSON.stringify(section_4))
          this.content_id= "6214a49299814ab6e4f4338e"
          formdata.append("content_id", this.content_id)
          obj = formdata
        } else {
          this.benefitsArray.markAllAsTouched()
          return
        }
      }
    }


    this.Service.postRecruitmentContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })

  }
  



}
