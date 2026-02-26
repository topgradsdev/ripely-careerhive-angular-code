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
    { id: 'personality', label: 'Personality', icon: '🧠' },
    { id: 'knowledge', label: 'Knowledge Bank', icon: '📚' },
    { id: 'transcripts', label: 'Transcripts', icon: '💬' },
    { id: 'guardrails', label: 'Guardrails', icon: '🛡️' },
    { id: 'usage', label: 'Usage', icon: '📊' }
  ];

  selectSection(id: string) {
    this.selectedSection = id;
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

  isChatVisible = true;

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  // ── Personality Section ──

  personalityTraits = [
    { name: 'Flexibility', value: 3, highLabel: 'Very Adaptable', lowLabel: 'Rigid' },
    { name: 'Meticulousness', value: 4, highLabel: 'Hyper-detailed', lowLabel: 'Carefree' },
    { name: 'Agreeableness', value: 4, highLabel: 'Very Encouraging', lowLabel: 'Antagonistic' },
    { name: 'Communications', value: 4, highLabel: 'Verbose', lowLabel: 'Terse' },
    { name: 'Language Complexity', value: 4, highLabel: 'Highly Technical', lowLabel: 'Layman/Basic' }
  ];

  sliderLevels = [5, 4, 3, 2, 1];

  radarChartData: ChartData<'radar'> = {
    labels: ['Meticulousness', 'Communications', 'Flexibility', 'Agreeableness', ['Language', 'Complexity']],
    datasets: [{
      data: [4, 4, 3, 4, 4],
      fill: true,
      backgroundColor: 'rgba(70, 75, 168, 0.2)',
      borderColor: '#464BA8',
      pointBackgroundColor: '#464BA8',
      pointBorderColor: '#464BA8',
      pointRadius: 6,
      borderWidth: 2
    }]
  };

  radarChartOptions: ChartOptions<'radar'> = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1, display: false },
        grid: { color: '#D5D5D5' },
        angleLines: { color: '#D5D5D5' },
        pointLabels: {
          font: { size: 14, family: 'DM Sans'},
          color: '#2B2A35'
        }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  // ── Knowledge Bank Section ──

  knowledgeBases = [
    {
      name: 'Company Management 101',
      expanded: false,
      brainFiles: [{ name: 'Uploaded_File.pdf' }],
      additionalPrompts: '',
      ragFiles: [],
      frameworks: []
    },
    {
      name: 'Advanced BA',
      expanded: true,
      brainFiles: [{ name: 'Uploaded_File.pdf' }],
      additionalPrompts: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum',
      ragFiles: [{ name: 'Uploaded_File.pdf' }],
      frameworks: [
        { name: 'Course Handbooks V2', status: 'Active' },
        { name: 'Project Methodologies', status: 'Active' }
      ]
    }
  ];

  toggleKnowledgeBase(index: number) {
    this.knowledgeBases[index].expanded = !this.knowledgeBases[index].expanded;
  }

  removeKnowledgeBase(index: number, event: Event) {
    event.stopPropagation();
    this.knowledgeBases.splice(index, 1);
  }

  // ── Transcripts Section ──

  transcripts = [
    { date: '24/06/25, 1:40 PM', sessionId: 'b91029b135g13', student: 'Dena Beanies', highlighted: true },
    { date: '24/06/25, 1:40 PM', sessionId: 'b91029b135g13', student: 'Dena Beanies', highlighted: false },
    { date: '24/06/25, 1:40 PM', sessionId: 'b91029b135g13', student: 'Dena Beanies', highlighted: false },
    { date: '24/06/25, 1:40 PM', sessionId: 'b91029b135g13', student: 'Dena Beanies', highlighted: false },
    { date: '24/06/25, 1:40 PM', sessionId: 'b91029b135g13', student: 'Dena Beanies', highlighted: false },
    { date: '24/06/25, 1:40 PM', sessionId: 'b91029b135g13', student: 'Dena Beanies', highlighted: false },
  ];

  transcriptMenuOpenIndex: number | null = null;

  toggleTranscriptMenu(index: number, event: Event) {
    event.stopPropagation();
    this.transcriptMenuOpenIndex = this.transcriptMenuOpenIndex === index ? null : index;
  }

  closeTranscriptMenu() {
    this.transcriptMenuOpenIndex = null;
  }

  copiedIndex: number | null = null;

  copySessionId(sessionId: string, index: number, event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(sessionId).then(() => {
      this.copiedIndex = index;
      setTimeout(() => {
        this.copiedIndex = null;
        this.cdr.detectChanges();
      }, 1500);
      this.cdr.detectChanges();
    });
  }

  // ── Transcript Chat View ──

  viewingChat = false;

  chatMessages = [
    {
      type: 'date-divider',
      label: 'Friday'
    },
    {
      type: 'left',
      sender: 'Victoria Kay',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      messages: [
        { text: 'Thank you for the interview', time: '' },
        { text: 'I would like to arrange a different time for interview with you, as I need to be some place please share your availability, so I could work out a different timing with you.', time: '21:30' }
      ]
    },
    {
      type: 'right',
      messages: [
        { text: 'Sure no worries, please view my calendar for this week and dedice what time will suit your availability.', time: '21:36' }
      ]
    },
    {
      type: 'right-file',
      fileName: 'Calendar.pdf',
      fileSize: 'PDF \u00B7 4MB',
      time: '21:40'
    },
    {
      type: 'date-divider',
      label: 'Today'
    },
    {
      type: 'left',
      sender: 'Jason Stantler',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
      messages: [
        { text: 'Hello, I\'m available anytime between tuesday to thursday.', time: '10:01' }
      ]
    },
    {
      type: 'right',
      messages: [
        { text: 'Sure no worries, I\'ll send you a voice message in a moment', time: '21:36' }
      ]
    }
  ];

  openChatView() {
    this.transcriptMenuOpenIndex = null;
    this.viewingChat = true;
  }

  backToChatHistory() {
    this.viewingChat = false;
  }

  setTraitValue(traitIndex: number, value: number) {
    this.personalityTraits[traitIndex].value = value;
    this.updateRadarChart();
  }

  updateRadarChart() {
    const t = this.personalityTraits;
    this.radarChartData = {
      ...this.radarChartData,
      datasets: [{
        ...this.radarChartData.datasets[0],
        data: [t[1].value, t[3].value, t[0].value, t[2].value, t[4].value]
      }]
    };
  }

  // ── Guardrails Section ──

  flagModeratedMemories = false;
  blockedWords: string[] = ['Adobe Photoshop', 'Python', 'Canva', 'GitHub'];
  newBlockedWord = '';

  addBlockedWord() {
    const word = this.newBlockedWord.trim();
    if (word && !this.blockedWords.includes(word)) {
      this.blockedWords.push(word);
    }
    this.newBlockedWord = '';
  }

  removeBlockedWord(index: number) {
    this.blockedWords.splice(index, 1);
  }

  onBlockedWordKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addBlockedWord();
    }
  }

  // ── Usage Section ──

  usageData = [
    { workflowGroup: 'F1 Advanced Data Analyst', taskName: 'Where to start?' },
    { workflowGroup: 'F1 Advanced Data Analyst', taskName: 'Where to start?' },
    { workflowGroup: 'F1 Advanced Data Analyst', taskName: 'Where to start?' },
    { workflowGroup: 'F1 Advanced Data Analyst', taskName: 'Where to start?' },
    { workflowGroup: 'Wooling Data with Woolworths', taskName: 'Code Red Day' },
    { workflowGroup: 'Wooling Data with Woolworths', taskName: 'Code Red Day' },
  ];

  ngOnInit(): void {}

}