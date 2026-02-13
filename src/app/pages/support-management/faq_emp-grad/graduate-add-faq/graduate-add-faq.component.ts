import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../../topgradservice.service';

@Component({
  selector: 'app-graduate-add-faq',
  templateUrl: './graduate-add-faq.component.html',
  styleUrls: ['./graduate-add-faq.component.scss']
})
export class GraduateAddFaqComponent implements OnInit {
  input:string;
  toastr: any;
  faq:any;
  inputTitle: FormGroup;
  id: any;
  description: string;
  title: string;
  title1: string;
 
selectedValue:any = '';

  constructor(private _snackBar: MatSnackBar, private route:ActivatedRoute,private Service:TopgradserviceService, private fb:FormBuilder, private router: Router  ) {
    this.inputTitle=this.fb.group({
      title:['',Validators.required],
      description:['',Validators.required],
      category_id:['',Validators.required],
      })
   }

  ngOnInit(): void {
    this.getFaqCategories()
    this.title=""
    this.description=""
    this.faq=""
    this.title1=""
  }

  getFaqCategories(){
    var obj={
      user_type: 'graduate'
    }
    console.log("categories=============",obj)
    this.Service.faqCategories(obj).subscribe(data => {
      console.log("fgdfgfgdfgdfgdfgdfgdfgdgf",data);
      this.faq=data.data
 
    }, err => {
      console.log(err.status)
      if (err.status >= 404) {
        console.log('Some error occured')
      } else {
         this.toastr.error('Some error occured, please try again!!', 'Error')

      }
    })

  }

  add_faq(id){  
    console.log("",id)
    this.id=id
    
  }
  openSnackBar(){
    this.id=this.id
  }


  addEditFaq(id){
   
    console.log("formmmmmmmmmmmm",this.inputTitle);
    if(this.inputTitle.invalid){
      this.inputTitle.markAllAsTouched()
    }
    else{
      var obj={
        faq_id:this.route.snapshot.paramMap.get('id'),
        category_id:this.inputTitle.controls.category_id.value,
        title:this.inputTitle.controls.title.value,
        description:this.inputTitle.controls.description.value,
        // faq:this.inputTitle.controls.faq.value,
      }
      console.log("editingFaq=========>",obj);
      this.Service.addEditFaq(obj).subscribe(res=>{
        console.log("Response==========",res);
        this.Service.showMessage({ message: "Added Successfully" })
        this.router.navigate(['/graduateFaq'])
      })
    }
  }

}
