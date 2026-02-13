import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { log } from 'console';
import { MatRadioModule } from '@angular/material/radio';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from '../../../topgradservice.service';
import SignaturePad from 'signature_pad';
import { Router } from '@angular/router';
// import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { NgxPermissionsService } from 'ngx-permissions';
import * as $ from "jquery";
import { HttpResponseCode } from '../../../shared/enum';
import { LoaderService } from '../../../loaderservice.service';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { DomSanitizer, SafeHtml, SafeResourceUrl } from '@angular/platform-browser';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';
import { MatStepper } from '@angular/material/stepper';



@Component({
  selector: 'app-add-ai-agent',
  templateUrl: './add-ai-agent.component.html',
  styleUrls: ['./add-ai-agent.component.scss'],
})
export class AddAIAgentComponent implements OnInit {
 
 selectedSection = 'description';

  menuItems = [
    { id: 'description', label: 'Character Description', icon: '👤' },
    { id: 'personality', label: 'Personality & Style', icon: '🧠' },
    { id: 'knowledge', label: 'Knowledge Bank', icon: '📚' },
    { id: 'memory', label: 'Memory', icon: '💾' },
    { id: 'guardrails', label: 'Guardrails', icon: '🛡️' },
    { id: 'usage', label: 'Usage', icon: '📊' }
  ];

  selectSection(id: string) {
    this.selectedSection = id;
  }

  constructor(private fb: FormBuilder, private service: TopgradserviceService,
     private router: Router, private ngxPermissionService: NgxPermissionsService, private cdr: ChangeDetectorRef, private loaderService:LoaderService, private fileIconService:FileIconService, private sanitizer: DomSanitizer) {
  }
 getSafeSvg(documentName: string): SafeHtml {
   return this.fileIconService.getFileIcon(documentName);
  }


  ngOnInit(): void {


  }

}