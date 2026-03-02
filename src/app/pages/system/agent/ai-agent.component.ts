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
import { MatTabChangeEvent } from '@angular/material/tabs';



@Component({
  selector: 'app-ai-agent',
  templateUrl: './ai-agent.component.html',
  styleUrls: ['./ai-agent.component.scss'],
})
export class AIAgentComponent implements OnInit {

  @ViewChild('closeRminderModal') closeRminderModal;
  selectedIndex: any = 0;
  kbSearchText: string = '';
  showArchivedAgents: boolean = false;
  showArchivedKB: boolean = false;

  // Data
  reviewers: any = [
    {
      name: 'Robert',
      role: 'Instant Resume Reviewer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      name: 'Albert',
      role: 'Instant Resume Reviewer',
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      name: 'Claire',
      role: 'Instant Resume Reviewer',
      image: 'https://randomuser.me/api/portraits/women/65.jpg',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      name: 'Brett',
      role: 'Instant Resume Reviewer',
      image: 'https://randomuser.me/api/portraits/men/12.jpg',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    }
  ];

  archivedReviewers: any = [
    {
      name: 'Robert',
      role: 'Instant Resume Reviewer',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      name: 'Albert',
      role: 'Instant Resume Reviewer',
      image: 'https://randomuser.me/api/portraits/men/44.jpg',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    }
  ];

  archivedCards: any[] = [
    {
      title: 'Advanced BA',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    }
  ];
   cards: any[] = [
    {
      title: 'Advanced BA',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      title: 'Python',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      title: 'MySQL',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      title: 'UI/UX Design',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Figma', 'Sketch (Design Software)', 'Paper Prototyping', 'Adobe XD', 'FigJam']
    },
    {
      title: 'Advanced BA',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      title: 'Advanced BA',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    },
    {
      title: 'Advanced BA',
      description: 'Advanced BA knowledge bases with multiple relevant skills to assist students.',
      skills: ['Business Analysis', 'Advanced', 'MySQL', 'Information Technology']
    }
  ];
  // archivedCards: any[] = [];

  // Counts
  totalAgents: number = 0;
  archivedAgentsCount: number = 0;
  totalKnowledgeBases: number = 0;
  archivedKBCount: number = 0;

  get filteredCards() {
    if (!this.kbSearchText.trim()) return this.cards;
    const term = this.kbSearchText.toLowerCase().trim();
    return this.cards.filter((card: any) =>
      (card.title || '').toLowerCase().includes(term) ||
      (card.skills || []).some((skill: string) => skill.toLowerCase().includes(term))
    );
  }

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router,
    private ngxPermissionService: NgxPermissionsService,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService,
    private fileIconService: FileIconService,
    private sanitizer: DomSanitizer
  ) {}

  getSafeSvg(documentName: string): SafeHtml {
    return this.fileIconService.getFileIcon(documentName);
  }

  ngOnInit(): void {
    this.getAgentList();
    this.getKnowledgeBaseList();
  }

  // ── API Calls ──

  getAgentList() {
    this.service.getAgentList({ status: 'active' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.reviewers = res.data || [];
          this.totalAgents = res.total || this.reviewers.length;
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load agents',
        });
      },
    });
  }

  getArchivedAgentList() {
    this.service.getArchivedAgentList({ status: 'archived' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.archivedReviewers = res.data || [];
          this.archivedAgentsCount = res.total || this.archivedReviewers.length;
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load archived agents',
        });
      },
    });
  }

  getKnowledgeBaseList() {
    this.service.getKnowledgeBaseList({ status: 'active' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.cards = res.data || [];
          this.totalKnowledgeBases = res.total || this.cards.length;
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load knowledge bases',
        });
      },
    });
  }

  getArchivedKnowledgeBaseList() {
    this.service.getArchivedKnowledgeBaseList({ status: 'archived' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.archivedCards = res.data || [];
          this.archivedKBCount = res.total || this.archivedCards.length;
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load archived knowledge bases',
        });
      },
    });
  }

  // ── Click Events ──

  editReviewer(reviewer: any) {
    if (reviewer._id) {
      this.router.navigate(['/admin/system/edit-agent', reviewer._id]);
    }
  }

  edit(card: any) {
    if (card._id) {
      this.router.navigate(['/admin/system/edit-knowledge-base', card._id]);
    }
  }

  openArchivedAgents() {
    this.showArchivedAgents = true;
    this.getArchivedAgentList();
  }

  backToActiveAgents() {
    this.showArchivedAgents = false;
  }

  openArchivedKB() {
    this.showArchivedKB = true;
    this.getArchivedKnowledgeBaseList();
  }

  backToActiveKB() {
    this.showArchivedKB = false;
  }

  onTabChange(event: MatTabChangeEvent) {
    this.selectedIndex = event.index;
  }

  btnTabs(index: any) {
    this.selectedIndex = index;
  }
}