import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { log } from 'console';
import { MatRadioModule } from '@angular/material/radio';
import { CdkDragDrop, moveItemInArray, transferArrayItem, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TopgradserviceService } from '../../../topgradservice.service';
import SignaturePad from 'signature_pad';
import { ActivatedRoute, Router } from '@angular/router';
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
  reviewers: any[] = [];
  archivedReviewers: any[] = [];
  cards: any[] = [];
  archivedCards: any[] = [];

  // Counts
  totalAgents: number = 0;
  activeAgents: number = 0;
  archivedAgentsCount: number = 0;
  deployedAgents: number = 0;
  totalKnowledgeBases: number = 0;
  activeKBCount: number = 0;
  archivedKBCount: number = 0;

  filteredCards: any[] = [];
  private searchTimeout: any;

  onKBSearch() {
    clearTimeout(this.searchTimeout);
    const term = this.kbSearchText.trim();
    if (!term) {
      this.filteredCards = this.cards;
      return;
    }
    this.searchTimeout = setTimeout(() => {
      this.service.searchKnowledgeBases({ search: term, limit: 100 }).subscribe({
        next: (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.filteredCards = res.data || [];
            this.cdr.detectChanges();
          }
        },
        error: () => {},
      });
    }, 400);
  }

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router,
    private route: ActivatedRoute,
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
    const tab = this.route.snapshot.queryParamMap.get('tab');
    if (tab) {
      this.selectedIndex = +tab;
    }
    this.getAgentList();
    this.getKnowledgeBaseList();
    this.getAgentStats();
    this.getKBStats();
  }

  // ── API Calls ──

  getAgentList() {
    this.service.getAgentList({ search: '', page: 1, limit: 100, status: 'active' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.reviewers = res.data || [];
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
    this.service.getAgentList({ search: '', page: 1, limit: 100, status: 'archived' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.archivedReviewers = res.data || [];
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load archived agents',
        });
      },
    });
  }

  getAgentStats() {
    this.service.getAgentStats({}).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.totalAgents = res.data?.total || 0;
          this.activeAgents = res.data?.active || 0;
          this.archivedAgentsCount = res.data?.archived || 0;
          this.deployedAgents = res.data?.deployed || 0;
        }
      },
      error: () => {},
    });
  }

  getKnowledgeBaseList() {
    this.service.getKnowledgeBaseList({ search: '', page: 1, limit: 100, status: 'active' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.cards = res.data || [];
          this.filteredCards = this.cards;
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
    this.service.getKnowledgeBaseList({ search: '', page: 1, limit: 100, status: 'archived' }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.archivedCards = res.data || [];
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load archived knowledge bases',
        });
      },
    });
  }

  getKBStats() {
    this.service.getKBStats({}).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.totalKnowledgeBases = res.data?.total || 0;
          this.activeKBCount = res.data?.active || 0;
          this.archivedKBCount = res.data?.archived || 0;
        }
      },
      error: () => {},
    });
  }

  archiveAgent(reviewer: any, event: Event) {
    event.stopPropagation();
    if (!reviewer._id) return;
    this.service.archiveAgent({ id: reviewer._id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.getAgentList();
          this.getAgentStats();
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to archive agent',
        });
      },
    });
  }

  archiveKB(card: any, event: Event) {
    event.stopPropagation();
    if (!card._id) return;
    this.service.archiveKnowledgeBase({ id: card._id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.getKnowledgeBaseList();
          this.getKBStats();
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to archive knowledge base',
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