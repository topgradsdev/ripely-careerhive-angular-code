import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../../topgradservice.service';

@Component({
  selector: 'app-edit-employer-how-it-works',
  templateUrl: './edit-employer-how-it-works.component.html',
  styleUrls: ['./edit-employer-how-it-works.component.scss']
})
export class EditEmployerHowItWorksComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  section_form1: FormGroup;
  section_form2: FormGroup;
  section_form3: FormGroup;
  section_form4: FormGroup;
  section_form5: FormGroup;
  section_form6: FormGroup;
  section_form7: FormGroup;
  section_form8: FormGroup;
  section_form9: FormGroup;
  section_form10: FormGroup;
  section_form11: FormGroup;
  section_form12: FormGroup;
  section_form13: FormGroup;
  section_form14: FormGroup;
  section_form15: FormGroup;
  section_form16: FormGroup;
  section_form17: FormGroup;
  section_form18: FormGroup;
  section_form19: FormGroup;
  headingImageObj: any;
  HeadingImage1: any;
  HeadingImage2: any;
  HeadingImage3: any;
  HeadingImage4: any;
  HeadingImage6: any;
  HeadingImage7: any;
  HeadingImage19: any;
  section_form20: any;
  fileToUpload: any;
  imageUrl: any;
  editheadingform: any;
  section_1: any;
  data
  user: any;
  title: string;
  section_form21: any;
  id: any;
  selected_file: File;
  sectionA:any;
  HeadingImage8:any=[];
  selectedfile: any;
  images:any=[];
  previousImage:any=[];
  section_16: any;
  image: any=[];
  files: File[] = [];
  sanitizeFile: SafeResourceUrl[];
  Section16Images: any = [];
  content_id: any;
  employer_primary_id: string;



  constructor(private _snackBar: MatSnackBar, private fb: FormBuilder, private route: ActivatedRoute,
    private Service: TopgradserviceService, private router: Router, private sanitizer: DomSanitizer) {
    this.section_form1 = this.fb.group({
      title: ['', Validators.required],
      Image: [''],
      county: [''],
      is_visible:[''],
    });

    this.section_form2 = this.fb.group({
      heading: ['', Validators.required],
      description: ['', Validators.required],
      Image: ['',],
      county: [''],
      is_visible:[''],
    })

    this.section_form3 = this.fb.group({
      heading2: ['', Validators.required],
      is_visible:[''],
    })

    this.section_form4 = this.fb.group({
      Image: [''],
      county: [''],
      is_visible:[''],
    });

    this.section_form5 = this.fb.group({
      heading3: ['', Validators.required],
      description1: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form6 = this.fb.group({
      heading4: ['', Validators.required],
      description2: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form7 = this.fb.group({
      listing: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form8 = this.fb.group({
      heading5: ['', Validators.required],
      description3: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form9 = this.fb.group({
      heading6: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form10 = this.fb.group({
      heading7: ['', Validators.required],
      description4: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form11 = this.fb.group({
      Image: [''],
      county: [''],
      is_visible:[''],
    });

    this.section_form12 = this.fb.group({
      listing2: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form13 = this.fb.group({
      heading8: ['', Validators.required],
      description5: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form14 = this.fb.group({
      'is_visible': [''],
      'emparray': this.fb.array([ ])
    });

    this.section_form15 = this.fb.group({
      heading12: ['', Validators.required],
      is_visible:[''],
      
    });

    this.section_form16 = this.fb.group({
     Image:[''],
     county:[''],
     is_visible:[''],
    });

    this.section_form17 = this.fb.group({
      heading13: ['', Validators.required],
      description9: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form18 = this.fb.group({
      heading14: ['', Validators.required],
      description10: ['', Validators.required],
      is_visible:[''],
    });

    this.section_form19 = this.fb.group({
     titleMsg: ['', Validators.required],
     msgInfo: ['', Validators.required],
     Image: [''],
     county: [''],
     is_visible:[''],
    });

    this.section_form20 = this.fb.group({
      heading15: ['', Validators.required],
      description11: ['', Validators.required],
      is_visible:[''],
    });
    this.section_form21 = this.fb.group({
      title111: ['', Validators.required],
      S_heading: ['', Validators.required],
      description12: ['', Validators.required],
      Image: ['',],
      county: [''],
      is_visible:[''],
    });
  }

  ngOnInit(): void {
    this.getContent()
  }

  get emparray(): FormArray {
    return this.section_form14.get('emparray') as FormArray;
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

  fun14(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun15(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun16(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun17(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun18(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }

  fun19(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }


  fun20(e:any){
    console.log("hfjsdfjsdhfjkds",e);
    this._snackBar.open("Visibility changed successfully","close",{
      duration: 2000
    });
    
  }



  setHeadingImage1(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.selected_file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form1)
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.section_form1.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage1 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form1.get('county')?.clearValidators();
      this.section_form1.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form1);
    }
    else {
      this.section_form1.get('county')?.setValidators([Validators.required]);
      this.section_form1.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form1);
    }
  }




  setHeadingImage2(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.selected_file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form2)
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.section_form2.patchValue({
        Image: this.headingImageObj,

      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage2 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form2.get('county')?.clearValidators();
      this.section_form2.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form2);
    }
    else {
      this.section_form2.get('county')?.setValidators([Validators.required]);
      this.section_form2.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form2);
    }
  }



  setHeadingImage3(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.selected_file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form4)
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.section_form4.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage3 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form4.get('county')?.clearValidators();
      this.section_form4.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form4);
    }
    else {
      this.section_form4.get('county')?.setValidators([Validators.required]);
      this.section_form4.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form4);
    }
  }

  setHeadingImage4(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.selected_file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form11)
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.section_form11.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage4 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form11.get('county')?.clearValidators();
      this.section_form11.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form11);
    }
    else {
      this.section_form11.get('county')?.setValidators([Validators.required]);
      this.section_form11.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form11);
    }
  }

  empHeadingImg(e, index) {
    console.log("index", index);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      this.Service.uploadEditGraduateHowItsWorks(formData).subscribe((res: any) => {
        console.log("image response ==>", res);
        this.emparray.at(index).patchValue({
          image: res
        })
      })
      this.emparray.controls[index].get('county').clearValidators();
      this.emparray.controls[index].get('county').updateValueAndValidity();
    } else {
      this.emparray.controls[index].get('county').setValidators([Validators.required]);
      this.emparray.controls[index].get('county').updateValueAndValidity();
    }
  
  }

 

  setHeadingImage6(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.selected_file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form19)
    if (fileType == "image") {  this.sectionA = {
    }
      this.headingImageObj = event.target.files[0]
      this.section_form19.patchValue({
        Image: this.headingImageObj,

      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage6 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form19.get('county')?.clearValidators();
      this.section_form19.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form19);
    }
    else {
      this.section_form19.get('county')?.setValidators([Validators.required]);
      this.section_form19.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form10);
    }
  }

  setHeadingImage7(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    this.selected_file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form21)
    if (fileType == "image") {
      this.headingImageObj = event.target.files[0]
      this.section_form21.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage7 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form21.get('county')?.clearValidators();
      this.section_form21.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form21);
    }
    else {
      this.section_form21.get('county')?.setValidators([Validators.required]);
      this.section_form21.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form21);
    }
  }



  
  getContent() {
    var obj = {
      content_id: "62131e0b9a4fb6871a828022"
    }
    this.Service.getEmpHowItWorks(obj).subscribe(data => {
      console.log("Response==========", data);
      this.HeadingImage1= data?.data.section_1.image,
      this.HeadingImage2= data?.data.section_2.image,
      this.HeadingImage3= data?.data.section_4.image,
      this.HeadingImage4= data?.data.section_11.image,
      this.HeadingImage6= data?.data.section_19.image,
      this.HeadingImage7= data?.data.section_21.image,
      this.HeadingImage8= data.data.section_16.images,
      this.Section16Images = this.HeadingImage8,
      console.log("section_16==>>>>",this.section_16);
      
      
      this.section_form1.patchValue({
        title: data?.data.section_1.heading,
        is_visible:data?.data.section_1.is_visible
      }),
        this.section_form2.patchValue({
          heading: data?.data.section_2.heading,
          description: data?.data.section_2.description,
          is_visible:data?.data.section_2.is_visible
        }),
        this.section_form3.patchValue({
          heading2: data?.data.section_3.heading,
          is_visible:data?.data.section_3.is_visible
        }),

        this.section_form4.patchValue({
          Image:data?.data.section_4.image,
          is_visible:data?.data.section_4.is_visible
        }),
        this.section_form5.patchValue({
          heading3: data?.data.section_5.heading,
          description1: data?.data.section_5.description,
          is_visible:data?.data.section_5.is_visible
        }),
        this.section_form6.patchValue({
          heading4: data?.data.section_6.heading,
          description2: data?.data.section_6.description,
          is_visible:data?.data.section_6.is_visible
        }),
        this.section_form7.patchValue({
          listing: data?.data.section_7.heading,
          is_visible:data?.data.section_7.is_visible
        }),
        this.section_form8.patchValue({
          heading5: data?.data.section_8.heading,
          description3: data?.data.section_8.description,
          is_visible:data?.data.section_8.is_visible
        }),
        this.section_form9.patchValue({
          heading6: data?.data.section_9.heading,
          is_visible:data?.data.section_9.is_visible
          
        }),
        this.section_form10.patchValue({
          heading7: data?.data.section_10.heading,
          description4: data?.data.section_10.description,
          is_visible:data?.data.section_10.is_visible
        }),
        this.section_form11.patchValue({
          is_visible:data?.data.section_11.is_visible
        }),
        this.section_form12.patchValue({
          listing2: data?.data.section_12.heading,
          is_visible:data?.data.section_12.is_visible
        }),
        this.section_form13.patchValue({
          heading8: data?.data.section_13.heading,
          description5: data?.data.section_13.description,
          is_visible:data?.data.section_13.is_visible
        }),
        this.section_form14.patchValue({
          is_visible: data.data.section_14.is_visible,
        })
      data.data.section_14.data.forEach((element) => {
        this.emparray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          description: [element.description, [Validators.required, Validators.maxLength(500)]],
          image: [element.image, [Validators.required]],
          county: ['']
        }));
      })

        this.section_form15.patchValue({
          heading12: data?.data.section_15.heading,
          is_visible:data?.data.section_15.is_visible
        }),

        this.section_form16.patchValue({
          is_visible:data?.data.section_16.is_visible,
        }),

        this.section_form17.patchValue({
          heading13: data?.data.section_17.heading,
          description9: data?.data.section_17.description,
          is_visible:data?.data.section_17.is_visible

        }),
        this.section_form18.patchValue({
          heading14: data?.data.section_18.heading,
          description10: data?.data.section_18.description,
          is_visible:data?.data.section_18.is_visible
        
        }),
        this.section_form19.patchValue({
          Image: data?.data.section_19.image,
          titleMsg: data?.data.section_19.heading,
          msgInfo: data?.data.section_19.heading,
          is_visible:data?.data.section_19.is_visible
        }),
        this.section_form20.patchValue({
          heading15: data?.data.section_20.heading,
          description11: data?.data.section_20.description,
          is_visible:data?.data.section_20.is_visible
         
        })
      this.section_form21.patchValue({
        Image: data?.data.section_21.image,
        title111: data?.data.section_21.heading,
        S_heading: data?.data.section_21.sub_heading,
        description12: data?.data.section_21.description,
        is_visible:data?.data.section_21.is_visible
      })
    }, err => {
      console.log(err.status)
      if (err.status >= 404) {
        console.log('Some error occured')
      }
      else {
        console.log('Internet Connection Error')
      }

    })
  }




  onSelect(e) {
    console.log("e-----", e);
    let obj: any;
    this.files.push(...e.addedFiles)
  }


  onRemove(e) {
    console.log(e);
    const formdata = new FormData()
    this.files.splice(this.files.indexOf(e), 1); 
   
  }

   onRemove1(item){
    var obj={
      url: item
    }
    console.log("delete====>",obj);
    this.Section16Images.splice(this.Section16Images.indexOf(item),1)
    this.Service.editEmpHowItWorksDelete(obj).subscribe(res=>{
      console.log("Delete Response==========",res);
      this.ngOnInit()

    })
  }
  

  openSnackBar() {
    this.id = this.id
  }
  editEmpHowItWorks1(id) {
    let obj: any
    if (this.section_form1.valid) {
      console.log(this.section_form1);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "heading": this.section_form1.controls.title.value,
           "is_visible": this.section_form1.controls.is_visible.value,
        }
        formdata.append("section_1", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "heading": this.section_form1.controls.title.value,
          "is_visible": this.section_form1.controls.is_visible.value,
          "image":this.HeadingImage1,
        }
        formdata.append("section_1", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
      else {
        this.section_form1.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

 
  editEmpHowItWorks2(id) {
    let obj: any
    if (this.section_form2.valid) {
      console.log(this.section_form2);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "heading": this.section_form2.controls.heading.value,
            "description": this.section_form2.controls.description.value,
            "is_visible": this.section_form2.controls.is_visible.value,
        }
        formdata.append("section_2", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "heading": this.section_form2.controls.heading.value,
          "description": this.section_form2.controls.description.value,
          "is_visible": this.section_form2.controls.is_visible.value,
          "image":this.HeadingImage2,
        }
        formdata.append("section_2", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
      else {
        this.section_form2.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }
  editEmpHowItWorks3(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form3.controls.heading2.value,
      "is_visible": this.section_form3.controls.is_visible.value,
    }
    if (this.section_form3.valid) {
      console.log(this.section_form3);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_3", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("editttttttttttttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form1.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }


  editEmpHowItWorks4(id) {
    let obj: any
    if (this.section_form4.valid) {
      console.log(this.section_form4);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "is_visible": this.section_form4.controls.is_visible.value,
        }
        formdata.append("section_4", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "is_visible": this.section_form4.controls.is_visible.value,
          "image":this.HeadingImage3,
        }
        formdata.append("section_2", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
      else {
        this.section_form4.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks5(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form5.controls.heading3.value,
      "description": this.section_form5.controls.description1.value,
      "is_visible": this.section_form5.controls.is_visible.value,
    }
    if (this.section_form5.valid) {
      console.log(this.section_form5);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_5", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("editttttttttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form5.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks6(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form6.controls.heading4.value,
      "description": this.section_form6.controls.description2.value,
      "is_visible": this.section_form6.controls.is_visible.value,
    }
    if (this.section_form6.valid) {
      console.log(this.section_form6);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_6", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form6.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }
  

  editEmpHowItWorks7(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form7.controls.listing.value,
      "is_visible": this.section_form7.controls.is_visible.value,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_7", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form7.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks8(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form8.controls.heading5.value,
      "description": this.section_form8.controls.description3.value,
      "is_visible": this.section_form8.controls.is_visible.value,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_8", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form8.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks9(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form9.controls.heading6.value,
      "is_visible": this.section_form9.controls.is_visible.value,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_9", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("ediitttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form9.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks10(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form10.controls.heading7.value,
      "description": this.section_form10.controls.description4.value,
      "is_visible": this.section_form10.controls.is_visible.value,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_10", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("ediittttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form10.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks11(id) {
    let obj: any
    if (this.section_form11.valid) {
      console.log(this.section_form11);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "is_visible": this.section_form11.controls.is_visible.value,
        }
        formdata.append("section_11", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "is_visible": this.section_form11.controls.is_visible.value,
          "image":this.HeadingImage4,
        }
        formdata.append("section_11", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
      else {
        this.section_form11.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks12(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form12.controls.listing2.value,
      "is_visible": this.section_form12.controls.is_visible.value,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_12", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form12.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks13(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form13.controls.heading8.value,
      "description": this.section_form13.controls.description5.value,
      "is_visible": this.section_form13.controls.is_visible.value,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_13", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttt=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form13.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }


  editEmployerHowItWorks() {
    let obj: any
      if (this.section_form14.valid) {
        if (this.emparray) {
          const formdata = new FormData()
          const section_11 = {
            data: this.section_form14.get('emparray').value,
            is_visible: this.section_form14.controls['is_visible'].value
          }
          formdata.append('section_14', JSON.stringify(section_11))
          this.content_id = "62131e0b9a4fb6871a828022"
          formdata.append("content_id", this.content_id)
          obj = formdata
        }
        else {
          this.emparray.markAllAsTouched()
        }
    }
    this.Service.editEmpHowItWorks(obj).subscribe((res) => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Submitted Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks15(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form15.controls.heading12.value,
      "is_visible":  this.section_form15.controls.is_visible.value,
    }  
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_15", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("AddingFaq=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form15.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }


  editEmpHowItWorks16(id) {
    let obj: any
      
    if (this.section_form16.valid) {
      console.log(this.section_form16);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_16", "true")
      formdata.append("previousImage",JSON.stringify(this.HeadingImage8))
      console.log("consolelog===",this.HeadingImage8);

      for(let i=0; i<this.files.length; i++){
            formdata.append('image',(this.files[i]));
          }
      console.log("editttt=====>", formdata);
      obj=formdata
    }
      else {
        this.section_form16.markAllAsTouched()
        return
      }
    console.log("uhuhuhuh", this.section_form16);
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res)
      this.Service.showMessage({ message: "Edit Successfully" })
      this.ngOnInit();
      this.section_form16.reset();
      this.files = []
      this.router.navigate(['/editEmployerHowItWorks'])
    })   
   
  }

  editEmpHowItWorks17(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form17.controls.heading13.value,
      "description": this.section_form17.controls.description9.value,
      "is_visible": this.section_form17.controls.is_visible.value,
    }
    if (this.section_form17.valid) {
      console.log(this.section_form17);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_17", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("AddingFaq=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form17.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks18(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form18.controls.heading14.value,
      "description": this.section_form18.controls.description10.value,
      "is_visible": this.section_form18.controls.is_visible.value,
    }
    if (this.section_form18.valid) {
      console.log(this.section_form18);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_18", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("AddingFaq=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form18.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks19(id) {
    let obj: any
    if (this.section_form19.valid) {
      console.log(this.section_form19);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "heading": this.section_form19.controls.titleMsg.value,
            "description": this.section_form19.controls.msgInfo.value,
            "is_visible": this.section_form19.controls.is_visible.value,
        }
        formdata.append("section_19", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "heading": this.section_form19.controls.titleMsg.value,
          "description": this.section_form19.controls.msgInfo.value,
          "is_visible": true,
          "image":this.HeadingImage6,
        }
        formdata.append("section_19", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
      else {
        this.section_form19.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks20(id) {
    let obj: any
    this.sectionA={
      "heading": this.section_form20.controls.heading15.value,
      "description": this.section_form20.controls.description11.value,
      "is_visible": this.section_form20.controls.is_visible.value,
    }
    if (this.section_form20.valid) {
      console.log(this.section_form20);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      formdata.append("section_20", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("AddingFaq=========>", formdata);
      obj=formdata
    }
      else {
        this.section_form20.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }

  editEmpHowItWorks21(id) {

    let obj: any
    if (this.section_form21.valid) {
      console.log(this.section_form21);
      const formdata = new FormData()
      formdata.append("content_id", "62131e0b9a4fb6871a828022")
      
      if (this.headingImageObj) {
        this.sectionA = {
            "heading": this.section_form21.controls.title111.value,
            "sub_heading": this.section_form21.controls.S_heading.value,
            "description": this.section_form21.controls.description12.value,
            "is_visible": this.section_form21.controls.is_visible.value,
        }
        formdata.append("section_21", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "heading": this.section_form21.controls.title111.value,
          "sub_heading": this.section_form21.controls.S_heading.value,
          "description": this.section_form21.controls.description12.value,
          "is_visible": this.section_form21.controls.is_visible.value,
          "image":this.HeadingImage7,
        }
        formdata.append("section_21", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
      else {
        this.section_form21.markAllAsTouched()
        return
      }
    this.Service.editEmpHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editEmployerHowItWorks'])
    })
  }


}


