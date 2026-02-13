import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TopgradserviceService } from '../../topgradservice.service';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-homepage-management',
  templateUrl: './homepage-management.component.html',
  styleUrls: ['./homepage-management.component.scss']
})
export class HomepageManagementComponent implements OnInit {
  modules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],        
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],                                   
      ['link']   
    ]
  };
  headerform: FormGroup
  storyform: FormGroup
  curatedform: FormGroup;
  successform: FormGroup;
  employerform: FormGroup;
  graduateform: FormGroup;
  newRegister: FormGroup;
  Companies: FormGroup;
  mainBenefitsForBoth: FormGroup;
  selectedfile: File;
  selectedfile1: File;
  selectedfile2: File;
  selectedfile3: File;
  files = []
  file: File;
  filename: any;
  title1: any;
  description: any;
  video1: any;
  logos = []
  logosUrl = []
  data: any;
  ext: any;


  constructor(private sanitizer: DomSanitizer, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private _formBuilder: FormBuilder, private router: Router) {
    this.headerform = this._formBuilder.group({
      'title': ['', [Validators.required, Validators.maxLength(2000)]],
      'image': ['', [Validators.required]],
      'is_visible': [''],
      'county': [''],
    })

    this.curatedform = this._formBuilder.group({
      'heading': ['', [Validators.required]],
      'is_visible': ['']
    })

    this.storyform = this._formBuilder.group({
      'title1': ['', [Validators.required, Validators.maxLength(50)]],
      'description': ['', [Validators.required]],
      'name': ['', [Validators.required, Validators.maxLength(50)]],
      'designation': ['', [Validators.required, Validators.maxLength(50)]],
      'video': ['', [Validators.required]],
      'is_visible': [''],
      'county': [''],
    })
    this.successform = this._formBuilder.group({
      'heading': ['', [Validators.required, Validators.maxLength(50)]],
      'video': ['', [Validators.required]],
      'discriptionArray': this._formBuilder.array([]),
      'is_visible': [''],
      'county': [''],
    })

    this.mainBenefitsForBoth = this._formBuilder.group({
      'heading': ['', [Validators.required, Validators.maxLength(50)]],
      'is_visible': [''],
      'employerTab': this._formBuilder.group({
        'is_visible': [''],
       
        'employerArray': this._formBuilder.array([ ])
      }),
      'graduateTab': this._formBuilder.group({
        'is_visible': [''],
        
        'graduateArray': this._formBuilder.array([])
      })
    })


    this.newRegister = this._formBuilder.group({
      'text': ['', [Validators.required, Validators.maxLength(50)]],
      'heading': ['', [Validators.required, Validators.maxLength(50)]],
      'description': ['', [Validators.required, Validators.maxLength(500)]],
      'image': ['', [Validators.required]],
      'is_visible': [''],
      'county': [''],
    })

    this.Companies = this._formBuilder.group({
      'heading': ['', [Validators.required, Validators.maxLength(100)]],
      'image': ['', [Validators.required]],
      'is_visible': [''],
      'county': [''],
    })

  }

  ngOnInit(): void {


    this.homepagecontent();
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

  get employerArray(): FormArray {
    return this.mainBenefitsForBoth.controls['employerTab'].get('employerArray') as FormArray;
  }
  get graduateArray(): FormArray {
    return this.mainBenefitsForBoth.controls['graduateTab'].get('graduateArray') as FormArray;
  }
  get discriptionArray(): FormArray {
    return this.successform.get('discriptionArray') as FormArray;
  }


  onStoryFormimageChange(e) {
    console.log(e);
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

        this.storyform.patchValue({
          video: this.sanitizer.bypassSecurityTrustResourceUrl(resp.file_name)
        })
      })
      this.storyform.get('county').clearValidators(); // 6. Clear All Validators
      this.storyform.get('county').updateValueAndValidity();
      console.log("rightextension", this.storyform);
    }
    else {
      this.storyform.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.storyform.get('county').updateValueAndValidity();

      console.log("wrongextension", this.storyform);
    }
  }

  onHeaderFormChange(e) {
    console.log(e);
    console.log(e.target.files[0].name);
    console.log(e.target.files[0].type);
    var ext = e.target.files[0].type;
    console.log("extensions", ext);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0]
    if (fileType == "image") {
      console.log("filetype", fileType);
      this.file = e.target.files[0]
      const formData = new FormData();
      formData.append('media', this.file);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {
        this.headerform.patchValue({
          image: resp.file_name
        })
        console.log("uploaded image==>", this.headerform.controls['image'].value);

      })
      this.headerform.get('county').clearValidators(); // 6. Clear All Validators
      this.headerform.get('county').updateValueAndValidity();
      console.log("rightextension", this.headerform);
    } else {
      this.headerform.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.headerform.get('county').updateValueAndValidity();

      console.log(this.headerform);
    }
  }


  onSelectLogo(e) {
    console.log("event",e);
    
    console.log("logos response ==>", e.addedFiles[0]);
    this.selectedfile = e.addedFiles[0];
    console.log("addedfiles",this.selectedfile);
    this.logos.push(e.addedFiles[0])

    const formData = new FormData();
    formData.append('media', this.selectedfile);
    this.Service.uploadmedia1(formData).subscribe((resp: any) => {

      console.log("video response ==>", resp);

      this.logosUrl.push(resp.file_name)
    })
  }
  setHeadingImage(e) {
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0]
    if (fileType == "image") {
      this.selectedfile2 = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile2);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {

        console.log("video response ==>", resp);

        this.newRegister.controls['image'].setValue(resp.file_name)
      })
      this.newRegister.get('county').clearValidators(); // 6. Clear All Validators
      this.newRegister.get('county').updateValueAndValidity();
      console.log("rightextension", this.newRegister);
    } else {
      this.newRegister.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.newRegister.get('county').updateValueAndValidity();

      console.log(this.newRegister);
    }
  }
  onEmployerChangeImage(e, index) {
    console.log("ind",index);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {

        console.log("video response ==>", resp);

        this.employerArray.at(index).patchValue({
          image: resp.file_name
        })
      })
       this.employerArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.employerArray.controls[index].get('county').updateValueAndValidity();
      console.log("rightextension", this.mainBenefitsForBoth);
      console.log("gussa na dila", this.employerArray);

    } else {
       this.employerArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.employerArray.controls[index].get('county').updateValueAndValidity();

      console.log("wrongectension",this.mainBenefitsForBoth);
      console.log("gussa na dila", this.employerArray);
    }
  }
  onGraduatesChange(e, index) {
    console.log("ind",index);
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {

        console.log("video response ==>", resp);

        this.graduateArray.at(index).patchValue({
          image: resp.file_name
        })
      })
      this.graduateArray.controls[index].get('county').clearValidators(); // 6. Clear All Validators
       this.graduateArray.controls[index].get('county').updateValueAndValidity();
      console.log("rightextension", this.mainBenefitsForBoth);
      console.log("gussa na dila", this.graduateArray);

    } else {
       this.graduateArray.controls[index].get('county').setValidators([Validators.required]); // 5.Set Required Validator
       this.graduateArray.controls[index].get('county').updateValueAndValidity();

      console.log("wrongectension",this.mainBenefitsForBoth);
      console.log("gussa na dila", this.graduateArray);
    }
  }
  onSelectVideo(e) {
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log("videotype", fileType);
    if (fileType == "video") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {

        console.log("video response ==>", resp);

        this.successform.patchValue({
          video: this.sanitizer.bypassSecurityTrustResourceUrl(resp.file_name)
        })
      })
      this.successform.get('county').clearValidators(); // 6. Clear All Validators
      this.successform.get('county').updateValueAndValidity();
      console.log("rightextension", this.successform);
    }
    else {
      this.successform.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.successform.get('county').updateValueAndValidity();

      console.log("wrongextension", this.successform);
    }
  }
  onCompaniesChangeImage(e) {
    const file = e.target.files[0];
    const fileType = file.type.split("/")[0];
    console.log(fileType);
    if (fileType == "image") {
      this.selectedfile = e.target.files[0];
      const formData = new FormData();
      formData.append('media', this.selectedfile);
      this.Service.uploadmedia1(formData).subscribe((resp: any) => {

        console.log("video response ==>", resp);

        this.Companies.controls['image'].setValue(resp.file_name)
      })
      this.Companies.get('county').clearValidators(); // 6. Clear All Validators
      this.Companies.get('county').updateValueAndValidity();
      console.log("rightextension", this.Companies);
    } else {
      this.Companies.get('county').setValidators([Validators.required]); // 5.Set Required Validator
      this.Companies.get('county').updateValueAndValidity();

      console.log("wrongextension",this.Companies);


    }
  }
  onRemove(i) {
    this.logos.splice(i, 1)
    this.logosUrl.splice(i, 1)

  }
  homepagecontent() {
    this.Service.homecontent().subscribe(data => {
      console.log("home page content is ====>", data)
      // this.data=data.data
      // this.data=JSON.parse(this.data)
      // console.log("home page content is new====>", this.data)


      this.headerform.patchValue({
        title: data.data.home_header_section.title,
        image: data.data.home_header_section.image,
        is_visible: data.data.home_header_section.is_visible
      })
      this.storyform.patchValue({
        title1: data.data.our_story_section.title,
        description: data.data.our_story_section.description,
        name: data.data.our_story_section.posted_by,
        video: this.sanitizer.bypassSecurityTrustResourceUrl(data.data.our_story_section.video),
        designation: data.data.our_story_section.position,
        is_visible: data.data.our_story_section.is_visible
      })
      this.curatedform.patchValue({
        heading: data.data.section_3.heading,
        is_visible: data.data.section_3.is_visible
      })
      this.newRegister.patchValue({
        heading: data.data.section_7.heading,
        text: data.data.section_7.text,
        description: data.data.section_7.description,
        image: data.data.section_7.image,
        is_visible: data.data.section_7.is_visible
      })
      this.successform.patchValue({
        heading: data.data.section_6.heading,
        video: this.sanitizer.bypassSecurityTrustResourceUrl(data.data.section_6.video),
        is_visible: data.data.section_6.is_visible
      })
      this.Companies.patchValue({
        heading: data.data.section_5.heading,
        image: data.data.section_5.image,
        is_visible: data.data.section_5.is_visible
      })
      this.mainBenefitsForBoth.patchValue({
        heading: data.data.section_4.heading,
        is_visible: data.data.section_4.is_visible
      })
      
      data.data.section_4.tab_1.forEach((element) => {
        this.employerArray.push(this._formBuilder.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          Description: [element.Description, [Validators.required, Validators.maxLength(500)]],
          image: [element.image, [Validators.required,]],
          is_visible: [element.is_visible],
          county: ['']
          
        }))
      });

      data.data.section_4.tab_2.forEach((element) => {
        this.graduateArray.push(this._formBuilder.group({
          heading: [element.heading, [Validators.required, Validators.maxLength(50)]],
          Description: [element.Description, [Validators.required, Validators.maxLength(500)]],
          image: [element.image, [Validators.required]],
          is_visible: [element.is_visible],
          county: ['']
        }))
      });

      data.data.section_6.description.forEach((element) => {
        this.discriptionArray.push(this._formBuilder.control(element, [Validators.required]))
      });

    })

  }
  postHomePageContent(type, Secondtype?) {
    let obj: any
    console.log("type==>", type, this.headerform);

    if (type == 'headerform') {
      if (this.headerform.valid) {
        const formdata = new FormData()
        const home_header_section = {
          title: this.headerform.controls['title'].value,
          image: this.headerform.controls['image'].value,
          is_visible: this.headerform.controls['is_visible'].value
        }
        formdata.append("home_header_section", JSON.stringify(home_header_section))

        obj = formdata

      } else {
        this.headerform.markAllAsTouched()
        return
      }
    }
    if (type == "curatedform") {
      if (this.curatedform.valid) {

        const section_3 = {
          heading: this.curatedform.controls['heading'].value,
          is_visible: this.curatedform.controls['is_visible'].value
        }
        const formdata = new FormData()
        formdata.append("section_3", JSON.stringify(section_3))

        obj = formdata
      } else {
        this.curatedform.markAllAsTouched()
        return
      }
    }
    if (type == "storyform") {
      if (this.storyform.valid) {
        console.log(this.storyform);
        console.log(this.storyform.controls['video'].value.changingThisBreaksApplicationSecurity)
        const our_story_section = {
          title: this.storyform.controls['title1'].value,
          description: this.storyform.controls['description'].value,
          posted_by: this.storyform.controls['name'].value,
          position: this.storyform.controls['designation'].value,
          video: this.storyform.controls['video'].value.changingThisBreaksApplicationSecurity,
          is_visible: this.storyform.controls['is_visible'].value
        }
        const formdata = new FormData()
        formdata.append("our_story_section", JSON.stringify(our_story_section))
        obj = formdata
      } else {
        this.storyform.markAllAsTouched()
        return
      }
    }
    if (type == "successform") {
      if (this.successform.valid) {

        const section_6 = {
          heading: this.successform.controls['heading'].value,
          video: this.successform.controls['video'].value.changingThisBreaksApplicationSecurity,
          description: this.successform.controls['discriptionArray'].value,
          is_visible: this.successform.controls['is_visible'].value
        }
        const formdata = new FormData()
        formdata.append("section_6", JSON.stringify(section_6))
        obj = formdata
      } else {
        this.successform.markAllAsTouched()
        return
      }

    }
    if (type == "mainBenefitsForBoth") {

      console.log("both==>", this.mainBenefitsForBoth);

      if (this.mainBenefitsForBoth.valid) {

        if (Secondtype == "employerTab") {
          if (this.mainBenefitsForBoth.controls['employerTab'].valid) {

            const section_4 = {
              heading: this.mainBenefitsForBoth.controls['heading'].value,
              is_visible: this.mainBenefitsForBoth.controls['is_visible'].value,
              tab_1: this.mainBenefitsForBoth.controls['employerTab'].get('employerArray').value
            }
            const formdata = new FormData()
            formdata.append("section_4", JSON.stringify(section_4))
            obj = formdata
          } else {
            this.mainBenefitsForBoth.controls['employerTab'].markAllAsTouched()
            return
          }
        }
        if (Secondtype == "graduateTab") {
          if (this.mainBenefitsForBoth.controls['graduateTab'].valid) {

            const section_4 = {
              heading: this.mainBenefitsForBoth.controls['heading'].value,
              is_visible: this.mainBenefitsForBoth.controls['is_visible'].value,
              tab_2: this.mainBenefitsForBoth.controls['graduateTab'].get('graduateArray').value
            }
            const formdata = new FormData()
            formdata.append("section_4", JSON.stringify(section_4))
            obj = formdata
          } else {
            this.mainBenefitsForBoth.controls['graduateTab'].markAllAsTouched()
            return
          }
        }
      }
    }
    if (type == "newRegister") {
      if (this.newRegister.valid) {

        const section_7 = {
          heading: this.newRegister.controls['heading'].value,
          text: this.newRegister.controls['text'].value,
          description: this.newRegister.controls['description'].value,
          image: this.newRegister.controls['image'].value,
          is_visible: this.newRegister.controls['is_visible'].value
        }
        const formdata = new FormData()
        formdata.append("section_7", JSON.stringify(section_7))
        obj = formdata
      } else {
        this.newRegister.markAllAsTouched()
        return
      }
    }
    if (type == "Companies") {
      if (this.Companies.valid) {

        const section_5 = {
          heading: this.Companies.controls['heading'].value,
          logos: this.logosUrl,
          image: this.Companies.controls['image'].value,
          is_visible: this.Companies.controls['is_visible'].value
        }
        const formdata = new FormData()
        formdata.append("section_5", JSON.stringify(section_5))
        obj = formdata
      } else {
        this.Companies.markAllAsTouched()
        return
      }
    }
    this.Service.postHomePageContent(obj).subscribe((resp) => {

      this.Service.showMessage({ message: "Submitted Successfully" })
    })

  }

}
