import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.scss']
})
export class AddArticleComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  HeadingImage1: any;
  headingImageObj: any;
  HeadingImage2: any;
  type_article:any= '';
  category_type: any;
  image_url: any;



  constructor(private _location: Location,private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }
  
  addArticleform = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(200)]],
    // order: ['', [Validators.required, Validators.max(10), Validators.min(1)]],
    // type: ['', [Validators.required, Validators.maxLength(50)]],
    category: ['', [Validators.required, Validators.maxLength(50)]],
    description: ['', [Validators.required]],
    postedby: ['', [Validators.required, Validators.maxLength(50)]],
    // postdescription: ['', [Validators.required]],
    Image: ['',],
    // is_visible: [''],
    publication_date:['',[Validators.required]],
    county:['']
  });


  ngOnInit(): void {
    this.type_article= " ";
  }

  article(event){
    console.log(event.target.value);
    this.type_article = event.target.value;
    console.log("type============>",this.type_article);
    
  }

  category(event){
    console.log(event.target.value);
    this.category_type = event.target.value;
    console.log("type============>",this.category_type);
    
  }

  // setHeadingImage(event) {
  //   console.log(event.target.files[0]);
  //   const file = event.target.files[0];
  //   const fileType = file.type.split("/")[0];
  //   console.log(fileType);
  //   if (fileType == "image") {
  //     this.headingImageObj = event.target.files[0]
  //     const formData = new FormData();
  //     formData.append('image', this.headingImageObj);
  //     this.Service.uploadbenefitmedia(formData).subscribe((resp: any) => {

  //       console.log("image response ==>", resp);

  //       this.addArticleform.patchValue({
  //         Image: resp,
  //       })
  //     })
  //     let reader = new FileReader();
  //     reader.onload = (event: any) => {
        
  //       this.HeadingImage1= event.target.result;
  //     };
  //     reader.readAsDataURL(this.headingImageObj);
  //     this.addArticleform.get('county').clearValidators(); // 6. Clear All Validators
  //     this.addArticleform.get('county').updateValueAndValidity();
  //     console.log("rightextension", this.addArticleform);
  //   } else {
  //     this.addArticleform.get('county').setValidators([Validators.required]); // 5.Set Required Validator
  //     this.addArticleform.get('county').updateValueAndValidity();

  //     console.log("wrongextension",this.addArticleform);
  //   }
  // }

  setHeadingImage1(event) {
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
        this.image_url =  resp;

        this.addArticleform.patchValue({
          Image: resp,
        })
      })
      
      let reader = new FileReader();
      reader.onload = (event: any) => {
        
        this.HeadingImage2= event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.addArticleform.get('county').clearValidators(); // 6. Clear All Validators
      this.addArticleform.get('county').updateValueAndValidity();
      console.log("rightextension", this.addArticleform);
    } else {
      this.addArticleform.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.addArticleform.get('county').updateValueAndValidity();

      console.log("wrongextension",this.addArticleform);
    }
  }


  postcontent(){
    let obj: any
      if (this.addArticleform.valid) {
        console.log("hmara form", this.addArticleform);
        
        const formdata = new FormData()
          console.log("yippeeeeeeee", this.headingImageObj);
          // formdata.append("article_type",  this.addArticleform.controls['type'].value)
          // formdata.append("order",  this.addArticleform.controls['order'].value)
          formdata.append("category",  this.addArticleform.controls['category'].value)
          formdata.append("article_title",  this.addArticleform.controls['title'].value)
          formdata.append("article_description", this.addArticleform.controls['description'].value)
          formdata.append("posted_by", this.addArticleform.controls['postedby'].value)
          formdata.append("date",this.addArticleform.controls['publication_date'].value);
          formdata.append("article_type",'article');
          formdata.append("media",this.image_url);
        
          // formdata.append("posted_description", this.addArticleform.controls['postdescription'].value)
        //   if(this.addArticleform.controls['type'].value=='small_article'){
        //      const medias:any= [
        //       {
        //           "for":"main",
        //           "url":this.addArticleform.controls['Image'].value
        //       }
        //   ]
        //   const newmedia= JSON.stringify(medias)
        //   console.log("newmedia==========>>>",newmedia);
          
        //   formdata.append("medias",JSON.stringify(medias))
        //   }

        //   if(this.addArticleform.controls['type'].value=='large_article'){
        //     const medias:any= [
        //      {
        //          for:"article_image",
        //          url:this.addArticleform.controls['Image'].value
        //      }
        //  ]
        //  const newmedia= JSON.stringify(medias)
        //  console.log("newmedia==========>>>",newmedia);
         
        //  formdata.append("medias",JSON.stringify(medias))
        //  }
          
        obj = formdata
        console.log("object out", obj)
      } else {
        this.addArticleform.markAllAsTouched()
        return
      }
    
      console.log("objjjjjjjj===========>",obj);
      
   
    this.Service.addArticleContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
            this.router.navigate(['/career-article'])
    })
  }

  back(){
    this._location.back();
  }

}
