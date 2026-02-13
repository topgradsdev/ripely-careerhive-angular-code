import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../../topgradservice.service';



@Component({
  selector: 'app-edit-graduate-how-it-works',
  templateUrl: './edit-graduate-how-it-works.component.html',
  styleUrls: ['./edit-graduate-how-it-works.component.scss']
})
export class EditGraduateHowItWorksComponent implements OnInit {
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
  headingImageObj: any;
  HeadingImage1: any;
  HeadingImage2: any;
  HeadingImage3: any;
  HeadingImage3_1: any;
  HeadingImage4: any;
  selectedfile: any;
  sectionA: any;
  id: any;
  HeadingImage6: any = [];
  dropImages: any = [];
  previousImage:any=[];
  files: any = [];
  section_9: any;
  section_11: any;
  content_id: string;
  imageFile: any=[];



  constructor(private _snackBar: MatSnackBar, private fb: FormBuilder, private route: ActivatedRoute,
    private Service: TopgradserviceService, private router: Router) {

    this.section_form1 = this.fb.group({
      title: ["", Validators.required],
      Image: ['',],
      is_visible: [''],
      county: ['']
    });

    this.section_form2 = this.fb.group({
      heading1: ["", Validators.required],
      description1: ["", Validators.required],
      Image: ['',],
      is_visible: [''],
      county: ['']
    });

    this.section_form3 = this.fb.group({
      heading2: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form4 = this.fb.group({
      'is_visible': [''],
      'graduateArray1': this.fb.array([])
    });

    this.section_form5 = this.fb.group({
      heading3: ["", Validators.required],
      description2: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form6 = this.fb.group({
      listing1: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form7 = this.fb.group({
      heading4: ["", Validators.required],
      description3: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form8 = this.fb.group({
      heading5: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form9 = this.fb.group({
      'images': ['', [Validators.required]],
      'is_visible': [''],
      'county': [''],
    });

    this.section_form10 = this.fb.group({
      heading6: ["", Validators.required],
      description4: ["", Validators.required],
      is_visible: [''],
    })


    this.section_form11 = this.fb.group({
      'is_visible': [''],
      'graduateArray': this.fb.array([])
    });

    this.section_form12 = this.fb.group({
      heading7: ["", Validators.required],
      description5: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form13 = this.fb.group({
      listing2: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form14 = this.fb.group({
      heading8: ["", Validators.required],
      description6: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form15 = this.fb.group({
      heading9: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form16 = this.fb.group({
      heading10: ["", Validators.required],
      description7: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form17 = this.fb.group({
      heading11: ["", Validators.required],
      description8: ["", Validators.required],
      is_visible: [''],
    })

    this.section_form18 = this.fb.group({
      Image: ['',],
      county: [''],
      is_visible: [''],

    })
  }

  ngOnInit(): void {
    this.getContent();
  }
  get graduateArray(): FormArray {
    return this.section_form11.get('graduateArray') as FormArray;
  }
  get graduateArray1(): FormArray {
    return this.section_form4.get('graduateArray1') as FormArray;
  }


  setHeadingImage1(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
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


  sectionsImg(e, index) {
    console.log("index", index);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      this.Service.uploadEditGraduateHowItsWorks(formData).subscribe((res: any) => {
        console.log("image response ==>", res);
        console.log("graduate array",this.graduateArray1);
        
        this.graduateArray1.at(index).patchValue({
          image: res
        })
      })
      this.graduateArray1.controls[index].get('county').clearValidators();
      this.graduateArray1.controls[index].get('county').updateValueAndValidity();
    } else {
      this.graduateArray1.controls[index].get('county').setValidators([Validators.required]);
      this.graduateArray1.controls[index].get('county').updateValueAndValidity();
    }
  }

  graduateHeadingImg(e, index) {
    console.log("index", index);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('image', this.selectedfile);
      this.Service.uploadEditGraduateHowItsWorks(formData).subscribe((res: any) => {
        console.log("image response ==>", res);
        this.graduateArray.at(index).patchValue({
          image: res
        })
      })
      this.graduateArray.controls[index].get('county').clearValidators();
      this.graduateArray.controls[index].get('county').updateValueAndValidity();
    } else {
      this.graduateArray.controls[index].get('county').setValidators([Validators.required]);
      this.graduateArray.controls[index].get('county').updateValueAndValidity();
    }
  }

  setHeadingImage4(event) {
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    console.log('sdsafdff', this.section_form18)
    if (fileType == "image") {
      // console.log("in");
      this.headingImageObj = event.target.files[0]
      this.section_form18.patchValue({
        Image: this.headingImageObj,
      })
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.HeadingImage4 = event.target.result;
      };
      reader.readAsDataURL(this.headingImageObj);
      this.section_form18.get('county')?.clearValidators();
      this.section_form18.get('county')?.updateValueAndValidity();
      console.log("rightextension", this.section_form18);
    }
    else {
      this.section_form18.get('county')?.setValidators([Validators.required]);
      this.section_form18.get('county')?.updateValueAndValidity();
      console.log("wrongextension", this.section_form18);
    }
  }
   
 


  editgraduateHowItWorks9() {
    console.log("shdshhd", this.section_form9);
    console.log("files===>",this.files);
    

    let obj: any
    if (this.section_form9.valid) {
      const section_9 = {
        images: this.dropImages,
        is_visible: this.section_form9.controls['is_visible'].value
      }
      
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_9", JSON.stringify(section_9))
   
      obj = formdata
    } else {
      this.section_form9.markAllAsTouched()
    }
    console.log("uhuhuhuh", this.section_form9);
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res)
      this.ngOnInit();
      this.section_form9.reset();
      this.files = []
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  // section_form9Image(e) {
  //   const file = e.target.files;
  //   const fileType = file.type.split("/");
  //   console.log(fileType);
  //   if (fileType == "image") {
  //     this.selectedfile = e.target.files;
  //     const formdata = new FormData();
  //     formdata.append('images', this.selectedfile);
  //     this.Service.uploadEditGraduateHowItsWorks(formdata).subscribe((res: any) => {
  //       console.log("upload files111 ==>", res);
  //       this.section_form9.controls['images'].setValue(res.file_name)
  //     })
  //   }
  // }

  onSelect(e) {
    this.files.push(...e.addedFiles)

    const formdata = new FormData()
    for(let i=0; i<this.files.length; i++){
      formdata.append('image',(this.files[i]));
    }
    // formdata.append("image", this.selectedfile);
    this.Service.uploadEditGraduateHowItsWorks(formdata).subscribe((res: any) => {
      console.log("upload image==>>>>", res)
      this.section_form9.controls['images'].setValue(res)
      this.dropImages=res
      console.log("drop imagesssssssss===>>>", this.dropImages);
    })
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
    this.dropImages.splice(this.dropImages.indexOf(item),1)
    this.Service.editGraduateHowItWorksDelete(obj).subscribe(res=>{
      console.log("Delete Response==========",res);
      this.ngOnInit()
      console.log("reminder images====>>>",this.dropImages)

    })
  }

  getContent() {
    var obj = {
      content_id: "621350cc3352bd34948f0634"
    }
    this.Service.getGraduateHowItWorks(obj).subscribe(data => {
      console.log("Response==========", data);
      this.HeadingImage1 = data?.data.section_1.image,
        this.HeadingImage2 = data?.data.section_2.image,
        this.HeadingImage3 = data?.data.section_4.image,
        this.HeadingImage4 = data?.data.section_18.image,
        this.HeadingImage6 = data.data.section_9.images,
        this.dropImages = this.HeadingImage6
        console.log("heading Image 6==>>",this.HeadingImage6);
        console.log("drop wala image===>>>",this.dropImages);
        
        // console.log("drop images===>>>",this.dropImages);

      

      this.section_form1.patchValue({
        title: data?.data.section_1.heading,
        is_visible: data?.data.section_1.is_visible
      }),
        this.section_form2.patchValue({
          is_visible: data?.data.section_2.is_visible,
          heading1: data?.data.section_2.heading,
          description1: data?.data.section_2.description,
        }),
        this.section_form3.patchValue({
          is_visible: data?.data.section_3.is_visible,
          heading2: data?.data.section_3.heading,
        }),

        this.section_form4.patchValue({
          is_visible: data.data.section_4.is_visible,
        })
      data.data.section_4.data.forEach((element) => {
        this.graduateArray1?.push(this.fb.group({
          name:[element.name],
          image: [element.image, [Validators.required]],
          county: ['']
        }));

      })
      this.section_form5.patchValue({
        is_visible: data?.data.section_5.is_visible,
        heading3: data?.data.section_5.heading,
        description2: data?.data.section_5.description,
      }),
        this.section_form6.patchValue({
          is_visible: data?.data.section_6.is_visible,
          listing1: data?.data.section_2.heading,
        }),
        this.section_form7.patchValue({
          is_visible: data?.data.section_7.is_visible,
          heading4: data?.data.section_7.heading,
          description3: data?.data.section_7.description,
        }),
        this.section_form8.patchValue({
          is_visible: data?.data.section_8.is_visible,
          heading5: data?.data.section_8.heading,
        }),
        this.section_form9.patchValue({
          is_visible: data?.data.section_9.is_visible,
          images: data.data.section_9.images,
        }),
        this.section_form10.patchValue({
          is_visible: data?.data.section_10.is_visible,
          heading6: data?.data.section_10.heading,
          description4: data?.data.section_10.description,
        }),
        this.section_form11.patchValue({
          is_visible: data.data.section_11.is_visible,
        })
      data.data.section_11.data.forEach((element) => {
        this.graduateArray.push(this.fb.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          image: [element.image, [Validators.required]],
          county: ['']
        }));
      })

      this.section_form12.patchValue({
        is_visible: data?.data.section_12.is_visible,
        heading7: data?.data.section_12.heading,
        description5: data?.data.section_12.description,
      }),
        this.section_form13.patchValue({
          is_visible: data?.data.section_13.is_visible,
          listing2: data?.data.section_2.heading,
        }),
        this.section_form14.patchValue({
          is_visible: data?.data.section_14.is_visible,
          heading8: data?.data.section_14.heading,
          description6: data?.data.section_14.description,
        }),
        this.section_form15.patchValue({
          is_visible: data?.data.section_15.is_visible,
          heading9: data?.data.section_15.heading,
        }),
        this.section_form16.patchValue({
          is_visible: data?.data.section_16.is_visible,
          heading10: data?.data.section_16.heading,
          description7: data?.data.section_16.description,
        }),
        this.section_form17.patchValue({
          is_visible: data?.data.section_17.is_visible,
          heading11: data?.data.section_17.heading,
          description8: data?.data.section_17.description,
        }),
        this.section_form18.patchValue({
          is_visible: data?.data.section_18.is_visible,
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


  // openSnackBar() {
  //   this.id = this.id
  // }

  // Edit Graduate How It Works============

  editgraduateHowItWorks1(id) {
    let obj: any
    
    if (this.section_form1.valid) {
      console.log(this.section_form1);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "heading": this.section_form1.controls.title.value,
          "is_visible": true,
        }
        formdata.append("section_1", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "heading": this.section_form1.controls.title.value,
          "image":this.HeadingImage1,
          "is_visible": true,
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
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks2(id) {
    let obj: any
    
    if (this.section_form1.valid) {
      console.log(this.section_form2);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "heading": this.section_form2.controls.heading1.value,
          "description": this.section_form2.controls.description1.value,
          "is_visible": true,
        }
        formdata.append("section_2", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "heading": this.section_form2.controls.heading1.value,
          "description": this.section_form2.controls.description1.value,
          "is_visible": true,
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
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks3(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form3.controls.heading2.value,
      "is_visible": true,
    }
    if (this.section_form3.valid) {
      console.log(this.section_form3);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_3", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form3.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks5(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form5.controls.heading3.value,
      "description": this.section_form5.controls.description2.value,
      "is_visible": true,
    }
    if (this.section_form5.valid) {
      console.log(this.section_form5);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_5", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form5.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks6(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form6.controls.listing1.value,
      "is_visible": true,
    }
    if (this.section_form6.valid) {
      console.log(this.section_form6);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_6", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form6.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks7(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form7.controls.heading4.value,
      "description": this.section_form7.controls.description3.value,
      "is_visible": true,
    }
    if (this.section_form7.valid) {
      console.log(this.section_form7);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_7", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form7.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks8(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form8.controls.heading5.value,
      "is_visible": true,
    }
    if (this.section_form8.valid) {
      console.log(this.section_form8);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_8", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form8.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }


  editgraduateHowItWorks10(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form10.controls.heading6.value,
      "description": this.section_form10.controls.description4.value,
      "is_visible": true,
    }
    if (this.section_form10.valid) {
      console.log(this.section_form10);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_10", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form10.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editGraduateHowItWorks(type) {
    let obj: any

    if (type == 'section') {
      if (this.section_form4.valid) {
        if (this.graduateArray) {
          const formdata = new FormData()
          const section_4 = {
            data: this.section_form4.get('graduateArray1').value,
            is_visible: this.section_form4.controls['is_visible'].value,
          }
          formdata.append('section_4', JSON.stringify(section_4))
          this.content_id = "621350cc3352bd34948f0634"
          formdata.append("content_id", this.content_id)
          obj = formdata
        }
        else {
          this.graduateArray.markAllAsTouched()
        }
      }
    }


    if (type == 'anime') {
      if (this.section_form11.valid) {
        if (this.graduateArray) {
          const formdata = new FormData()
          const section_11 = {
            data: this.section_form11.get('graduateArray').value,
            is_visible: this.section_form11.controls['is_visible'].value
          }
          formdata.append('section_11', JSON.stringify(section_11))
          this.content_id = "621350cc3352bd34948f0634"
          formdata.append("content_id", this.content_id)
          obj = formdata
        }
        else {
          this.graduateArray.markAllAsTouched()
        }
      }
    }

    this.Service.editGraduateHowItWorks(obj).subscribe((res) => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Submitted Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks12(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form12.controls.heading7.value,
      "description": this.section_form12.controls.description5.value,
      "is_visible": true,
    }
    if (this.section_form12.valid) {
      console.log(this.section_form12);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_12", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form12.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks13(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form13.controls.listing2.value,
      "is_visible": true,
    }
    if (this.section_form13.valid) {
      console.log(this.section_form13);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_13", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form13.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks14(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form14.controls.heading8.value,
      "description": this.section_form14.controls.description6.value,
      "is_visible": true,
    }
    if (this.section_form14.valid) {
      console.log(this.section_form14);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_14", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form14.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks15(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form15.controls.heading9.value,
      "is_visible": true,
    }
    if (this.section_form15.valid) {
      console.log(this.section_form15);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_15", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form15.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks16(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form16.controls.heading10.value,
      "description": this.section_form16.controls.description7.value,
      "is_visible": true,
    }
    if (this.section_form16.valid) {
      console.log(this.section_form16);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_16", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form16.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks17(id) {
    let obj: any
    this.sectionA = {
      "heading": this.section_form17.controls.heading11.value,
      "description": this.section_form17.controls.description8.value,
      "is_visible": true,
    }
    if (this.section_form17.valid) {
      console.log(this.section_form17);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      formdata.append("section_17", JSON.stringify(this.sectionA))
      if (this.headingImageObj) {
        formdata.append("image", this.headingImageObj)
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form17.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }

  editgraduateHowItWorks18(id) {
    let obj: any
    if (this.section_form18.valid) {
      console.log(this.section_form18);
      const formdata = new FormData()
      formdata.append("content_id", "621350cc3352bd34948f0634")
      
      if (this.headingImageObj) {
        this.sectionA = {
          "is_visible": true,
        }
        formdata.append("section_18", JSON.stringify(this.sectionA))
        formdata.append("image", this.headingImageObj)
      }
      else{
        this.sectionA = {
          "is_visible": true,
          "image":this.HeadingImage4,
        }
        formdata.append("section_18", JSON.stringify(this.sectionA))
      }
      console.log("edittttttttttt=========>", formdata);
      obj = formdata
    }
    else {
      this.section_form18.markAllAsTouched()
      return
    }
    this.Service.editGraduateHowItWorks(obj).subscribe(res => {
      console.log("Response==========", res);
      this.Service.showMessage({ message: "Edit Successfully" })
      this.router.navigate(['/editGraduateHowItWorks'])
    })
  }



}
