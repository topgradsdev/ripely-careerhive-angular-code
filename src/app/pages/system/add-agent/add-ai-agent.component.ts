import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TopgradserviceService } from '../../../topgradservice.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponseCode } from '../../../shared/enum';
import { ChartData, ChartOptions } from 'chart.js';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FileIconService } from 'src/app/shared/file-icon.service';
import { LoaderService } from '../../../loaderservice.service';

@Component({
  selector: 'app-add-ai-agent',
  templateUrl: './add-ai-agent.component.html',
  styleUrls: ['./add-ai-agent.component.scss'],
})
export class AddAIAgentComponent implements OnInit {

  @ViewChild('archiveAgentModal') archiveAgentModal: ModalDirective;
  @ViewChild('removechat') removechat: ModalDirective;
  @ViewChild('removeTestChat') removeTestChat: ModalDirective;
  @ViewChild('chatBody') chatBody: ElementRef;
  
  selectedSection = 'description';

  menuItems = [
    { id: 'description', label: 'Character Description', icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M15.8327 17.5V15.8333C15.8327 14.9493 15.4815 14.1014 14.8564 13.4763C14.2312 12.8512 13.3834 12.5 12.4993 12.5H7.49935C6.61529 12.5 5.76745 12.8512 5.14233 13.4763C4.5172 14.1014 4.16602 14.9493 4.16602 15.8333V17.5" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9.99935 9.16667C11.8403 9.16667 13.3327 7.67428 13.3327 5.83333C13.3327 3.99238 11.8403 2.5 9.99935 2.5C8.1584 2.5 6.66602 3.99238 6.66602 5.83333C6.66602 7.67428 8.1584 9.16667 9.99935 9.16667Z" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>` },
    { id: 'personality', label: 'Personality', icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1270_42721)">
<path d="M10 4.16655C10.001 3.83324 9.93532 3.5031 9.80685 3.19555C9.67837 2.88799 9.4897 2.60923 9.25191 2.37567C9.01413 2.1421 8.73204 1.95844 8.42224 1.83549C8.11243 1.71254 7.78117 1.65278 7.44793 1.65972C7.1147 1.66667 6.78621 1.74018 6.4818 1.87593C6.17739 2.01169 5.9032 2.20694 5.67536 2.45022C5.44751 2.69349 5.27061 2.97987 5.15506 3.29251C5.03952 3.60515 4.98765 3.93774 5.00252 4.27071C4.51269 4.39666 4.05794 4.63242 3.67271 4.96014C3.28749 5.28786 2.98189 5.69894 2.77906 6.16225C2.57623 6.62556 2.48149 7.12896 2.50201 7.63431C2.52254 8.13965 2.65779 8.63371 2.89752 9.07905C2.476 9.42149 2.14454 9.86174 1.93197 10.3615C1.7194 10.8612 1.63215 11.4054 1.67782 11.9465C1.7235 12.4877 1.9007 13.0095 2.19403 13.4666C2.48735 13.9236 2.88791 14.3021 3.36085 14.569C3.30245 15.0209 3.3373 15.4799 3.46326 15.9178C3.58922 16.3557 3.8036 16.7631 4.09318 17.1148C4.38275 17.4666 4.74136 17.7553 5.14687 17.963C5.55238 18.1708 5.99617 18.2932 6.45083 18.3227C6.9055 18.3522 7.36139 18.2881 7.79034 18.1346C8.2193 17.981 8.61221 17.7411 8.94482 17.4297C9.27743 17.1183 9.54267 16.742 9.72416 16.3241C9.90565 15.9062 9.99953 15.4555 10 14.9999V4.16655Z" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 4.16655C9.99903 3.83324 10.0647 3.5031 10.1932 3.19555C10.3217 2.88799 10.5103 2.60923 10.7481 2.37567C10.9859 2.1421 11.268 1.95844 11.5778 1.83549C11.8876 1.71254 12.2189 1.65278 12.5521 1.65972C12.8853 1.66667 13.2138 1.74018 13.5182 1.87593C13.8226 2.01169 14.0968 2.20694 14.3247 2.45022C14.5525 2.69349 14.7294 2.97987 14.845 3.29251C14.9605 3.60515 15.0124 3.93774 14.9975 4.27071C15.4873 4.39666 15.9421 4.63242 16.3273 4.96014C16.7125 5.28786 17.0181 5.69894 17.221 6.16225C17.4238 6.62556 17.5185 7.12896 17.498 7.63431C17.4775 8.13965 17.3422 8.63371 17.1025 9.07905C17.524 9.42149 17.8555 9.86174 18.0681 10.3615C18.2806 10.8612 18.3679 11.4054 18.3222 11.9465C18.2765 12.4877 18.0993 13.0095 17.806 13.4666C17.5127 13.9236 17.1121 14.3021 16.6392 14.569C16.6976 15.0209 16.6627 15.4799 16.5368 15.9178C16.4108 16.3557 16.1964 16.7631 15.9069 17.1148C15.6173 17.4666 15.2587 17.7553 14.8532 17.963C14.4477 18.1708 14.0039 18.2932 13.5492 18.3227C13.0945 18.3522 12.6386 18.2881 12.2097 18.1346C11.7807 17.981 11.3878 17.7411 11.0552 17.4297C10.7226 17.1183 10.4574 16.742 10.2759 16.3241C10.0944 15.9062 10.0005 15.4555 10 14.9999V4.16655Z" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M12.5 10.8333C11.8004 10.5872 11.1894 10.1392 10.7444 9.54584C10.2994 8.95251 10.0404 8.24056 10 7.5C9.95962 8.24056 9.70056 8.95251 9.25556 9.54584C8.81057 10.1392 8.19963 10.5872 7.5 10.8333" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M14.666 5.41634C14.8677 5.06683 14.9818 4.67369 14.9985 4.27051" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.00195 4.27051C5.01843 4.67362 5.13223 5.06675 5.33362 5.41634" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M2.89844 9.08C3.05089 8.95584 3.21402 8.84541 3.38594 8.75" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6152 8.75C16.7871 8.84541 16.9503 8.95584 17.1027 9.08" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5.00049 15.0003C4.42619 15.0006 3.86155 14.8525 3.36133 14.5703" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M16.6392 14.5703C16.1389 14.8525 15.5743 15.0006 15 15.0003" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1270_42721">
<rect width="20" height="20" fill="white"/>
</clipPath>
</defs>
</svg>`},
    { id: 'knowledge', label: 'Knowledge Bank', icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5 11.667C12.6667 10.8337 13.0833 10.2503 13.75 9.58366C14.5833 8.83366 15 7.75033 15 6.66699C15 5.34091 14.4732 4.06914 13.5355 3.13146C12.5979 2.19378 11.3261 1.66699 10 1.66699C8.67392 1.66699 7.40215 2.19378 6.46447 3.13146C5.52678 4.06914 5 5.34091 5 6.66699C5 7.50033 5.16667 8.50033 6.25 9.58366C6.83333 10.167 7.33333 10.8337 7.5 11.667" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 15H12.5" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8.33398 18.333H11.6673" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>` },
    { id: 'transcripts', label: 'Transcripts', icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M17.5 12.5C17.5 12.942 17.3244 13.366 17.0118 13.6785C16.6993 13.9911 16.2754 14.1667 15.8333 14.1667H5.83333L2.5 17.5V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H15.8333C16.2754 2.5 16.6993 2.67559 17.0118 2.98816C17.3244 3.30072 17.5 3.72464 17.5 4.16667V12.5Z" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>` },
    { id: 'guardrails', label: 'Guardrails', icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.6673 10.8331C16.6673 14.9997 13.7507 17.0831 10.284 18.2914C10.1025 18.3529 9.90527 18.35 9.72565 18.2831C6.25065 17.0831 3.33398 14.9997 3.33398 10.8331V4.99972C3.33398 4.77871 3.42178 4.56675 3.57806 4.41047C3.73434 4.25419 3.9463 4.16639 4.16732 4.16639C5.83398 4.16639 7.91732 3.16639 9.36732 1.89972C9.54386 1.74889 9.76845 1.66602 10.0007 1.66602C10.2329 1.66602 10.4574 1.74889 10.634 1.89972C12.0923 3.17472 14.1673 4.16639 15.834 4.16639C16.055 4.16639 16.267 4.25419 16.4232 4.41047C16.5795 4.56675 16.6673 4.77871 16.6673 4.99972V10.8331Z" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 6.66699V10.0003" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10 13.333H10.0083" stroke="#2B2A35" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`},
    { id: 'usage', label: 'Usage', icon: `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.666 5.83301H3.33268C2.41221 5.83301 1.66602 6.5792 1.66602 7.49967V15.833C1.66602 16.7535 2.41221 17.4997 3.33268 17.4997H16.666C17.5865 17.4997 18.3327 16.7535 18.3327 15.833V7.49967C18.3327 6.5792 17.5865 5.83301 16.666 5.83301Z" stroke="#2B2A35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M13.3327 17.5V4.16667C13.3327 3.72464 13.1571 3.30072 12.8445 2.98816C12.532 2.67559 12.108 2.5 11.666 2.5H8.33268C7.89065 2.5 7.46673 2.67559 7.15417 2.98816C6.84161 3.30072 6.66602 3.72464 6.66602 4.16667V17.5" stroke="#2B2A35" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>` }
  ];

  selectSection(id: string) {
    this.selectedSection = id;
  }

  isEditMode = false;
  agentId: string | null = null;
  agentStats: any = {};

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private fileIconService: FileIconService,
    private loaderService: LoaderService
  ) {}

  getSafeSvg(documentName: string) {
   return this.fileIconService.getFileIcon(documentName);
  }

  getSafeIcon(icon: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(icon);
  }

  isChatVisible = true;
  flaggedChatsCount = 0;

  // ── Memory Settings ──
  memoryEnabled = true;
  memoryWindowSize = 10;

  toggleChat() {
    this.isChatVisible = !this.isChatVisible;
  }

  // ── Character Description Form ──

  agentForm!: FormGroup;
  agentTags: string[] = [];
  agentTagInput = '';
  avatarPreview: string | null = null;
  avatarFile: File | null = null;

  addTag() {
    const tag = this.agentTagInput.trim();
    if (tag && !this.agentTags.includes(tag)) {
      this.agentTags.push(tag);
    }
    this.agentTagInput = '';
  }

  removeTag(index: number) {
    this.agentTags.splice(index, 1);
  }

  onTagKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  getAvatarInitials(): string {
    const name = this.agentForm?.get('agentName')?.value || '';
    if (!name.trim()) return 'AI';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.avatarFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarPreview = reader.result as string;
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(this.avatarFile);
    }
  }

  resetAvatar() {
    this.avatarPreview = null;
    this.avatarFile = null;
    this.avatarReset = true;
  }

  // Validation flags
  submitted = false;
  personaError = false;
  knowledgeError = false;

  get descriptionValid(): boolean {
    return this.agentForm?.valid ?? false;
  }

  get personalityValid(): boolean {
    return !!this.selectedPersona;
  }

  get knowledgeValid(): boolean {
    return this.knowledgeBases.length > 0;
  }

  getSectionError(sectionId: string): boolean {
    if (!this.submitted) return false;
    switch (sectionId) {
      case 'description': return !this.descriptionValid;
      case 'personality': return !this.personalityValid;
      case 'knowledge': return !this.knowledgeValid;
      default: return false;
    }
  }

  saveAgent() {
    this.submitted = true;
    this.personaError = !this.personalityValid;
    this.knowledgeError = !this.knowledgeValid;

    // Check Character Description
    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();
      this.selectedSection = 'description';
      return;
    }

    // Check Personality
    if (!this.personalityValid) {
      this.selectedSection = 'personality';
      this.service.showMessage({ message: 'Please select a Persona Tone & Style' });
      return;
    }

    // Check Knowledge Bank
    if (!this.knowledgeValid) {
      this.selectedSection = 'knowledge';
      this.service.showMessage({ message: 'Please add at least one Knowledge Base' });
      return;
    }

    this.loaderService.show();
    const formVal = this.agentForm.value;

    // Use FormData if avatar file exists, otherwise JSON
    if (this.avatarFile) {
      const fd = new FormData();
      if (this.isEditMode && this.agentId) {
        fd.append('id', this.agentId);
      }
      fd.append('name', formVal.agentName);
      fd.append('title', formVal.agentTitle);
      fd.append('background', formVal.characterBackground);
      fd.append('tags', JSON.stringify(this.agentTags));
      fd.append('character', JSON.stringify({
        persona: this.selectedPersona || '',
        role: '',
        tone: ''
      }));
      fd.append('personality', JSON.stringify({
        flexibility: this.personalityTraits[0].value,
        meticulousness: this.personalityTraits[1].value,
        agreeableness: this.personalityTraits[2].value,
        communications: this.personalityTraits[3].value,
        language_complexity: this.personalityTraits[4].value,
      }));
      fd.append('knowledge_bases', JSON.stringify(this.knowledgeBases.map((kb: any) => kb._id)));
      fd.append('guardrails', JSON.stringify({
        blocked_words: this.blockedWords,
        flag_inappropriate: this.flagModeratedMemories
      }));
      fd.append('memory_settings', JSON.stringify({
        enabled: this.memoryEnabled,
        window_size: this.memoryWindowSize
      }));
      fd.append('document', this.avatarFile);

      this.callSaveApi(fd);
    } else {
      const payload: any = {
        name: formVal.agentName,
        title: formVal.agentTitle,
        background: formVal.characterBackground,
        tags: this.agentTags,
        character: {
          persona: this.selectedPersona || '',
          role: '',
          tone: ''
        },
        personality: {
          flexibility: this.personalityTraits[0].value,
          meticulousness: this.personalityTraits[1].value,
          agreeableness: this.personalityTraits[2].value,
          communications: this.personalityTraits[3].value,
          language_complexity: this.personalityTraits[4].value,
        },
        knowledge_bases: this.knowledgeBases.map((kb: any) => kb._id),
        guardrails: {
          blocked_words: this.blockedWords,
          flag_inappropriate: this.flagModeratedMemories
        },
        memory_settings: {
          enabled: this.memoryEnabled,
          window_size: this.memoryWindowSize
        },
      };

      if (this.isEditMode && this.agentId) {
        payload.id = this.agentId;
        if (this.avatarReset) {
          payload.reset_image = true;
        }
      }

      this.callSaveApi(payload);
    }
  }

  avatarReset = false;

  private callSaveApi(payload: any) {
    const apiCall = this.isEditMode
      ? this.service.updateAgent(payload)
      : this.service.createAgent(payload);

    apiCall.subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        if (res.status === HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: this.isEditMode ? 'Agent updated successfully' : 'Agent created successfully' });
          this.router.navigate(['/admin/system/agent-list']);
        } else {
          this.service.showMessage({ message: res.msg });
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went wrong',
        });
      },
    });
  }

  // ── Personality Section ──

  selectedPersona: string | null = null;

  personaPresets = [
    { name: 'Tough Client', values: [2, 5, 1, 2, 4] },
    { name: 'Supporting Manager', values: [4, 3, 5, 4, 3] },
    { name: 'Strict Evaluator', values: [1, 5, 2, 3, 5] },
    { name: 'Grumpy Colleague', values: [1, 2, 1, 2, 2] },
  ];

  onPersonaChange() {
    const preset = this.personaPresets.find(p => p.name === this.selectedPersona);
    if (preset) {
      this.personalityTraits.forEach((trait, i) => {
        trait.value = preset.values[i];
      });
      this.updateRadarChart();
    }
  }

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

  setTraitValue(traitIndex: number, value: number) {
    this.personalityTraits = this.personalityTraits.map((trait, idx) =>
      idx === traitIndex ? { ...trait, value } : { ...trait }
    );
    this.updateRadarChart();
    this.cdr.detectChanges();
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

  // ── Knowledge Bank Section ──

  allKnowledgeBases: any[] = [];
  knowledgeBases: any[] = [];
  kbSearchText = '';
  kbDropdownOpen = false;

  get filteredKBList(): any[] {
    const term = this.kbSearchText.toLowerCase().trim();
    const selectedIds = this.knowledgeBases.map((kb: any) => kb._id);
    return this.allKnowledgeBases.filter((kb: any) =>
      !selectedIds.includes(kb._id) &&
      (!term || (kb.title || kb.name || '').toLowerCase().includes(term))
    );
  }

  loadKnowledgeBases() {
    this.service.searchKnowledgeBases({ search: '', limit: 100 }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.allKnowledgeBases = res.data || [];
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load knowledge bases',
        });
      },
    });
  }

  selectKnowledgeBase(kb: any) {
    if (this.knowledgeBases.find((k: any) => k._id === kb._id)) {
      this.kbSearchText = '';
      this.kbDropdownOpen = false;
      return;
    }
    this.knowledgeBases.push({ ...kb, expanded: false });
    this.knowledgeError = false;
    this.kbSearchText = '';
    this.kbDropdownOpen = false;

    // Fetch full KB details (brain_files, additional_prompts, etc.)
    this.service.getKnowledgeBaseById({ id: kb._id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS && res.data) {
          const idx = this.knowledgeBases.findIndex((k: any) => k._id === kb._id);
          if (idx !== -1) {
            this.knowledgeBases[idx] = { ...this.knowledgeBases[idx], ...res.data, expanded: this.knowledgeBases[idx].expanded };
            this.cdr.detectChanges();
          }
        }
      },
      error: () => {},
    });
  }

  viewBrainFile(file: any) {
    if (file.file_url) {
      window.open(file.file_url, '_blank');
    }
  }

  onKbSearchFocus() {
    this.kbDropdownOpen = true;
  }

  onKbSearchBlur() {
    setTimeout(() => {
      this.kbDropdownOpen = false;
    }, 200);
  }

  toggleKnowledgeBase(index: number) {
    this.knowledgeBases[index].expanded = !this.knowledgeBases[index].expanded;
  }

  removeKnowledgeBase(index: number, event: Event) {
    event.stopPropagation();
    this.knowledgeBases.splice(index, 1);
  }

  // ── Transcripts Section ──

  transcripts: any[] = [];

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

  viewingChat = false;
  chatMessages: any[] = [];
  selectedConversationId: string | null = null;

  loadTranscripts() {
    if (!this.agentId) return;
    this.service.getAgentConversations({ agent_id: this.agentId, page: 1, limit: 100 }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.transcripts = res.data || [];
          // Load the latest conversation messages into test chat preview
          if (this.transcripts.length > 0 && this.testChatMessages.length === 0) {
            const latest = this.transcripts[0];
            this.testChatSessionId = latest.session_id || '';
            this.testChatMessages = (latest.messages || []).map((msg: any) => ({
              role: msg.role === 'assistant' ? 'agent' : msg.role,
              message: msg.content,
              sources: msg.sources || [],
              flagged: msg.flagged || false
            }));
          }
          this.cdr.detectChanges();
        }
      },
      error: () => {},
    });
  }

  openChatView(transcript?: any) {
    this.transcriptMenuOpenIndex = null;
    if (transcript) {
      this.selectedConversationId = transcript._id;
      this.chatMessages = (transcript.messages || []).map((msg: any) => ({
        role: msg.role,
        content: msg.content,
        flagged: msg.flagged,
        flag_reason: msg.flag_reason,
        sources: msg.sources || [],
        createdAt: msg.createdAt
      }));
      if (transcript.session_id) {
        this.testChatSessionId = transcript.session_id;
      }
      this.viewingChat = true;
      this.cdr.detectChanges();
    } else {
      this.viewingChat = true;
    }
  }

  backToChatHistory() {
    this.viewingChat = false;
    this.chatMessages = [];
    this.selectedConversationId = null;
    this.loadTranscripts();
  }

  // ── Test Chat ──

  testChatMessages: { role: string; message: string; sources?: any[]; flagged?: boolean }[] = [];
  testChatInput = '';
  testChatSessionId = '';
  testChatLoading = false;

  sendTestChat() {
    const msg = this.testChatInput.trim();
    if (!msg || !this.agentId || this.testChatLoading) return;

    this.testChatMessages.push({ role: 'user', message: msg });
    this.testChatInput = '';
    this.testChatLoading = true;
    this.cdr.detectChanges();
    this.scrollChatToBottom();

    this.service.agentChat({
      agent_id: this.agentId,
      message: msg,
      session_id: this.testChatSessionId || ''
    }).subscribe({
      next: (res: any) => {
        this.testChatLoading = false;
        if (res.status === HttpResponseCode.SUCCESS) {
          this.testChatSessionId = res.data?.session_id || this.testChatSessionId;
          this.testChatMessages.push({
            role: 'agent',
            message: res.data?.message || '',
            sources: res.data?.sources || [],
            flagged: res.data?.flagged || false
          });
        } else {
          this.testChatMessages.push({ role: 'agent', message: res.msg || 'Failed to get response' });
        }
        this.cdr.detectChanges();
        this.scrollChatToBottom();
      },
      error: (err) => {
        this.testChatLoading = false;
        this.testChatMessages.push({ role: 'agent', message: err.error?.errors?.msg || 'Chat failed' });
        this.cdr.detectChanges();
        this.scrollChatToBottom();
      },
    });
  }

  resetTestChat() {
    this.testChatMessages = [];
    this.testChatSessionId = '';
    this.testChatInput = '';
  }

  private scrollChatToBottom() {
    setTimeout(() => {
      if (this.chatBody?.nativeElement) {
        this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
      }
    }, 50);
  }

  confirmResetTestChat() {
    if (this.agentId && this.testChatSessionId) {
      this.service.resetChat({
        agent_id: this.agentId,
        session_id: this.testChatSessionId
      }).subscribe({
        next: () => {
          this.resetTestChat();
          this.removeTestChat.hide();
        },
        error: () => {
          this.resetTestChat();
          this.removeTestChat.hide();
        }
      });
    } else {
      this.resetTestChat();
      this.removeTestChat.hide();
    }
  }

  loadFlaggedChats() {
    if (!this.agentId) return;
    this.service.getAgentFlaggedChats({ agent_id: this.agentId, page: 1, limit: 1 }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.flaggedChatsCount = res.total || res.data?.length || 0;
          this.cdr.detectChanges();
        }
      },
      error: () => {},
    });
  }

  // ── Guardrails Section ──

  flagModeratedMemories = false;
  blockedWords: string[] = [];
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

  usageData: { workflowGroup: string; taskName: string }[] = [];

  archiveAgent() {
    if (!this.agentId) return;
    this.loaderService.show();
    this.service.archiveAgent({ id: this.agentId }).subscribe({
      next: (res: any) => {
        this.loaderService.hide();
        if (res.status === HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: 'Agent archived successfully' });
          this.router.navigate(['/admin/system/agent-list']);
        } else {
          this.service.showMessage({ message: res.msg });
        }
      },
      error: (err) => {
        this.loaderService.hide();
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went wrong',
        });
      },
    });
  }

  ngOnInit(): void {
    this.agentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.agentId;

    this.agentForm = this.fb.group({
      agentName: ['', [Validators.required]],
      agentTitle: ['', [Validators.required]],
      characterBackground: ['', [Validators.required]],
    });

    this.loadKnowledgeBases();
    this.getAgentStats();

    if (this.isEditMode && this.agentId) {
      this.loadAgentById(this.agentId);
      this.loadTranscripts();
      this.loadFlaggedChats();
    }
  }

  getAgentStats() {
    this.service.getAgentStats({}).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.agentStats = res.data || {};
          this.cdr.detectChanges();
        }
      },
      error: () => {},
    });
  }

  loadAgentById(id: string) {
    this.service.getAgentById({ id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS && res.data) {
          const agent = res.data;

          // Character Description
          this.agentForm.patchValue({
            agentName: agent.name || '',
            agentTitle: agent.title || '',
            characterBackground: agent.background || '',
          });
          this.agentTags = agent.tags || [];
          if (agent.image_url) {
            this.avatarPreview = agent.image_url;
          }

          // Personality
          if (agent.character?.persona) {
            this.selectedPersona = agent.character.persona;
          }
          if (agent.personality) {
            const p = agent.personality;
            this.personalityTraits[0].value = p.flexibility ?? 3;
            this.personalityTraits[1].value = p.meticulousness ?? 4;
            this.personalityTraits[2].value = p.agreeableness ?? 4;
            this.personalityTraits[3].value = p.communications ?? 4;
            this.personalityTraits[4].value = p.language_complexity ?? 4;
            this.updateRadarChart();
          }

          // Knowledge Bases
          if (agent.knowledge_bases?.length) {
            this.knowledgeBases = agent.knowledge_bases.map((kb: any) => ({
              ...kb,
              expanded: false
            }));
          }

          // Guardrails
          if (agent.guardrails) {
            this.blockedWords = agent.guardrails.blocked_words || [];
            this.flagModeratedMemories = agent.guardrails.flag_inappropriate ?? false;
          }

          // Memory Settings
          if (agent.memory_settings) {
            this.memoryEnabled = agent.memory_settings.enabled ?? true;
            this.memoryWindowSize = agent.memory_settings.window_size ?? 10;
          }

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load agent',
        });
      },
    });
  }

}
