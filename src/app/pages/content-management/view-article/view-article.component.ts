import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-article',
  templateUrl: './view-article.component.html',
  styleUrls: ['./view-article.component.scss']
})
export class ViewArticleComponent implements OnInit {
  articledetail: any;

  constructor(private _location: Location,private route:ActivatedRoute, private Service: TopgradserviceService, private _snackBar: MatSnackBar, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.getcontent();
  }

  getcontent(){
    var obj={
      article_id:this.route.snapshot.paramMap.get('id')
    }
    this.Service.getArticleContent(obj).subscribe((resp) => {
      this.articledetail=resp.data;
     })
  }

  back(){
    this._location.back();
  }


}
