import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

import { AddAIAgentComponent } from './add-ai-agent.component';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { FileIconService } from 'src/app/shared/file-icon.service';

describe('AddAIAgentComponent', () => {
  let component: AddAIAgentComponent;
  let fixture: ComponentFixture<AddAIAgentComponent>;
  let mockService: jasmine.SpyObj<TopgradserviceService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockFileIconService: jasmine.SpyObj<FileIconService>;

  const createRoute = (id: string | null) => ({
    snapshot: { paramMap: convertToParamMap(id ? { id } : {}) },
  });

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('TopgradserviceService', [
      'createAgent',
      'updateAgent',
      'getAgentById',
      'archiveAgent',
      'deleteAgent',
      'searchKnowledgeBases',
      'showMessage',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockFileIconService = jasmine.createSpyObj('FileIconService', ['getFileIcon']);

    mockService.searchKnowledgeBases.and.returnValue(of({
      status: HttpResponseCode.SUCCESS,
      data: [
        { _id: 'kb1', title: 'KB One', name: 'KB One' },
        { _id: 'kb2', title: 'KB Two', name: 'KB Two' },
      ],
    }));
    mockFileIconService.getFileIcon.and.returnValue('<svg></svg>' as any);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddAIAgentComponent],
      providers: [
        FormBuilder,
        { provide: TopgradserviceService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: createRoute(null) },
        { provide: FileIconService, useValue: mockFileIconService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAIAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Init ──

  it('should initialize form with required validators', () => {
    expect(component.agentForm).toBeTruthy();
    expect(component.agentForm.get('agentName')).toBeTruthy();
    expect(component.agentForm.get('agentTitle')).toBeTruthy();
    expect(component.agentForm.get('characterBackground')).toBeTruthy();
  });

  it('should be in create mode when no id param', () => {
    expect(component.isEditMode).toBeFalse();
    expect(component.agentId).toBeNull();
  });

  it('should load knowledge bases on init', () => {
    expect(mockService.searchKnowledgeBases).toHaveBeenCalledWith({ search: '', limit: 100 });
    expect(component.allKnowledgeBases.length).toBe(2);
  });

  // ── Edit Mode ──

  describe('Edit Mode', () => {
    beforeEach(async () => {
      await TestBed.resetTestingModule();

      mockService = jasmine.createSpyObj('TopgradserviceService', [
        'createAgent',
        'updateAgent',
        'getAgentById',
        'archiveAgent',
        'deleteAgent',
        'searchKnowledgeBases',
        'showMessage',
      ]);
      mockRouter = jasmine.createSpyObj('Router', ['navigate']);
      mockFileIconService = jasmine.createSpyObj('FileIconService', ['getFileIcon']);
      mockFileIconService.getFileIcon.and.returnValue('<svg></svg>' as any);

      mockService.searchKnowledgeBases.and.returnValue(of({
        status: HttpResponseCode.SUCCESS,
        data: [],
      }));

      mockService.getAgentById.and.returnValue(of({
        status: HttpResponseCode.SUCCESS,
        data: {
          name: 'Test Agent',
          title: 'Test Title',
          background: 'Test Background',
          tags: ['tag1', 'tag2'],
          avatar_url: 'https://example.com/avatar.png',
          character: { persona: 'Tough Client' },
          personality: {
            flexibility: 2,
            meticulousness: 5,
            agreeableness: 1,
            communications: 2,
            language_complexity: 4,
          },
          knowledge_bases: [{ _id: 'kb1', name: 'KB One' }],
          guardrails: {
            blocked_words: ['bad', 'word'],
            flag_inappropriate: true,
          },
        },
      }));

      await TestBed.configureTestingModule({
        imports: [ReactiveFormsModule],
        declarations: [AddAIAgentComponent],
        providers: [
          FormBuilder,
          { provide: TopgradserviceService, useValue: mockService },
          { provide: Router, useValue: mockRouter },
          { provide: ActivatedRoute, useValue: createRoute('agent123') },
          { provide: FileIconService, useValue: mockFileIconService },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();

      fixture = TestBed.createComponent(AddAIAgentComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should be in edit mode with agent id', () => {
      expect(component.isEditMode).toBeTrue();
      expect(component.agentId).toBe('agent123');
    });

    it('should load agent data and patch form', () => {
      expect(component.agentForm.get('agentName')?.value).toBe('Test Agent');
      expect(component.agentForm.get('agentTitle')?.value).toBe('Test Title');
      expect(component.agentForm.get('characterBackground')?.value).toBe('Test Background');
    });

    it('should load tags from agent data', () => {
      expect(component.agentTags).toEqual(['tag1', 'tag2']);
    });

    it('should load avatar from agent data', () => {
      expect(component.avatarPreview).toBe('https://example.com/avatar.png');
    });

    it('should load persona from agent data', () => {
      expect(component.selectedPersona).toBe('Tough Client');
    });

    it('should load personality traits from agent data', () => {
      expect(component.personalityTraits[0].value).toBe(2); // flexibility
      expect(component.personalityTraits[1].value).toBe(5); // meticulousness
      expect(component.personalityTraits[2].value).toBe(1); // agreeableness
      expect(component.personalityTraits[3].value).toBe(2); // communications
      expect(component.personalityTraits[4].value).toBe(4); // language_complexity
    });

    it('should load knowledge bases from agent data', () => {
      expect(component.knowledgeBases.length).toBe(1);
      expect(component.knowledgeBases[0]._id).toBe('kb1');
    });

    it('should load guardrails from agent data', () => {
      expect(component.blockedWords).toEqual(['bad', 'word']);
      expect(component.flagModeratedMemories).toBeTrue();
    });
  });

  // ── Tags ──

  it('should add a tag', () => {
    component.agentTagInput = 'newTag';
    component.addTag();
    expect(component.agentTags).toContain('newTag');
    expect(component.agentTagInput).toBe('');
  });

  it('should not add duplicate tag', () => {
    component.agentTags = ['existingTag'];
    component.agentTagInput = 'existingTag';
    component.addTag();
    expect(component.agentTags.length).toBe(1);
  });

  it('should not add empty tag', () => {
    component.agentTagInput = '   ';
    component.addTag();
    expect(component.agentTags.length).toBe(0);
  });

  it('should remove a tag', () => {
    component.agentTags = ['tag1', 'tag2', 'tag3'];
    component.removeTag(1);
    expect(component.agentTags).toEqual(['tag1', 'tag3']);
  });

  it('should add tag on Enter key', () => {
    component.agentTagInput = 'enterTag';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    component.onTagKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.agentTags).toContain('enterTag');
  });

  it('should not add tag on non-Enter key', () => {
    component.agentTagInput = 'test';
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    component.onTagKeydown(event);
    expect(component.agentTags).not.toContain('test');
  });

  // ── Avatar ──

  it('should return initials from agent name', () => {
    component.agentForm.patchValue({ agentName: 'John Doe' });
    expect(component.getAvatarInitials()).toBe('JD');
  });

  it('should return first 2 chars for single word name', () => {
    component.agentForm.patchValue({ agentName: 'Agent' });
    expect(component.getAvatarInitials()).toBe('AG');
  });

  it('should return AI for empty name', () => {
    component.agentForm.patchValue({ agentName: '' });
    expect(component.getAvatarInitials()).toBe('AI');
  });

  it('should reset avatar', () => {
    component.avatarPreview = 'some-url';
    component.avatarFile = new File([], 'test.png');
    component.resetAvatar();
    expect(component.avatarPreview).toBeNull();
    expect(component.avatarFile).toBeNull();
    expect(component.avatarReset).toBeTrue();
  });

  // ── Personality ──

  it('should set personality traits from persona preset', () => {
    component.selectedPersona = 'Tough Client';
    component.onPersonaChange();
    expect(component.personalityTraits[0].value).toBe(2); // flexibility
    expect(component.personalityTraits[1].value).toBe(5); // meticulousness
  });

  it('should update radar chart on trait value change', () => {
    component.setTraitValue(0, 5);
    expect(component.personalityTraits[0].value).toBe(5);
    expect(component.radarChartData.datasets[0].data).toContain(5);
  });

  // ── Knowledge Bank ──

  it('should filter KB list excluding selected', () => {
    component.knowledgeBases = [{ _id: 'kb1', name: 'KB One' }];
    component.kbSearchText = '';
    const filtered = component.filteredKBList;
    expect(filtered.length).toBe(1);
    expect(filtered[0]._id).toBe('kb2');
  });

  it('should filter KB list by search text', () => {
    component.kbSearchText = 'Two';
    const filtered = component.filteredKBList;
    expect(filtered.length).toBe(1);
    expect(filtered[0]._id).toBe('kb2');
  });

  it('should select a knowledge base', () => {
    component.selectKnowledgeBase({ _id: 'kb1', name: 'KB One' });
    expect(component.knowledgeBases.length).toBe(1);
    expect(component.knowledgeBases[0]._id).toBe('kb1');
    expect(component.kbSearchText).toBe('');
    expect(component.kbDropdownOpen).toBeFalse();
  });

  it('should not add duplicate knowledge base', () => {
    component.knowledgeBases = [{ _id: 'kb1', name: 'KB One', expanded: false }];
    component.selectKnowledgeBase({ _id: 'kb1', name: 'KB One' });
    expect(component.knowledgeBases.length).toBe(1);
  });

  it('should remove knowledge base', () => {
    component.knowledgeBases = [
      { _id: 'kb1', expanded: false },
      { _id: 'kb2', expanded: false },
    ];
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    component.removeKnowledgeBase(0, event);
    expect(event.stopPropagation).toHaveBeenCalled();
    expect(component.knowledgeBases.length).toBe(1);
    expect(component.knowledgeBases[0]._id).toBe('kb2');
  });

  it('should toggle knowledge base expanded state', () => {
    component.knowledgeBases = [{ _id: 'kb1', expanded: false }];
    component.toggleKnowledgeBase(0);
    expect(component.knowledgeBases[0].expanded).toBeTrue();
    component.toggleKnowledgeBase(0);
    expect(component.knowledgeBases[0].expanded).toBeFalse();
  });

  it('should open dropdown on focus', () => {
    component.onKbSearchFocus();
    expect(component.kbDropdownOpen).toBeTrue();
  });

  it('should close dropdown on blur after delay', fakeAsync(() => {
    component.kbDropdownOpen = true;
    component.onKbSearchBlur();
    expect(component.kbDropdownOpen).toBeTrue();
    tick(200);
    expect(component.kbDropdownOpen).toBeFalse();
  }));

  // ── Guardrails ──

  it('should add blocked word', () => {
    component.newBlockedWord = 'spam';
    component.addBlockedWord();
    expect(component.blockedWords).toContain('spam');
    expect(component.newBlockedWord).toBe('');
  });

  it('should not add duplicate blocked word', () => {
    component.blockedWords = ['spam'];
    component.newBlockedWord = 'spam';
    component.addBlockedWord();
    expect(component.blockedWords.length).toBe(1);
  });

  it('should not add empty blocked word', () => {
    component.newBlockedWord = '   ';
    component.addBlockedWord();
    expect(component.blockedWords.length).toBe(0);
  });

  it('should remove blocked word', () => {
    component.blockedWords = ['spam', 'bad'];
    component.removeBlockedWord(0);
    expect(component.blockedWords).toEqual(['bad']);
  });

  it('should add blocked word on Enter key', () => {
    component.newBlockedWord = 'blocked';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    component.onBlockedWordKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.blockedWords).toContain('blocked');
  });

  // ── Section Navigation ──

  it('should select section', () => {
    component.selectSection('personality');
    expect(component.selectedSection).toBe('personality');
  });

  // ── Validation ──

  it('should report form invalid when fields empty', () => {
    expect(component.descriptionValid).toBeFalse();
  });

  it('should report form valid when fields filled', () => {
    component.agentForm.patchValue({
      agentName: 'Test',
      agentTitle: 'Title',
      characterBackground: 'Background',
    });
    expect(component.descriptionValid).toBeTrue();
  });

  it('should report personality invalid when no persona selected', () => {
    component.selectedPersona = null;
    expect(component.personalityValid).toBeFalse();
  });

  it('should report personality valid when persona selected', () => {
    component.selectedPersona = 'Tough Client';
    expect(component.personalityValid).toBeTrue();
  });

  it('should report knowledge invalid when no KBs', () => {
    component.knowledgeBases = [];
    expect(component.knowledgeValid).toBeFalse();
  });

  it('should report knowledge valid when KBs exist', () => {
    component.knowledgeBases = [{ _id: 'kb1' }];
    expect(component.knowledgeValid).toBeTrue();
  });

  it('should return section error only after submitted', () => {
    expect(component.getSectionError('description')).toBeFalse();
    component.submitted = true;
    expect(component.getSectionError('description')).toBeTrue();
  });

  // ── Save Agent (Create) ──

  it('should not save if form is invalid', () => {
    component.saveAgent();
    expect(component.submitted).toBeTrue();
    expect(component.selectedSection).toBe('description');
    expect(mockService.createAgent).not.toHaveBeenCalled();
  });

  it('should not save if personality is missing', () => {
    component.agentForm.patchValue({
      agentName: 'Test',
      agentTitle: 'Title',
      characterBackground: 'Background',
    });
    component.selectedPersona = null;
    component.knowledgeBases = [{ _id: 'kb1' }];
    component.saveAgent();
    expect(component.selectedSection).toBe('personality');
    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Please select a Persona Tone & Style' });
  });

  it('should not save if knowledge bank is empty', () => {
    component.agentForm.patchValue({
      agentName: 'Test',
      agentTitle: 'Title',
      characterBackground: 'Background',
    });
    component.selectedPersona = 'Tough Client';
    component.knowledgeBases = [];
    component.saveAgent();
    expect(component.selectedSection).toBe('knowledge');
    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Please add at least one Knowledge Base' });
  });

  it('should create agent with JSON payload when no avatar', () => {
    mockService.createAgent.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));

    component.agentForm.patchValue({
      agentName: 'New Agent',
      agentTitle: 'New Title',
      characterBackground: 'New Background',
    });
    component.selectedPersona = 'Tough Client';
    component.knowledgeBases = [{ _id: 'kb1' }];
    component.agentTags = ['tag1'];
    component.avatarFile = null;

    component.saveAgent();

    expect(mockService.createAgent).toHaveBeenCalled();
    const payload = mockService.createAgent.calls.mostRecent().args[0];
    expect(payload.name).toBe('New Agent');
    expect(payload.title).toBe('New Title');
    expect(payload.tags).toEqual(['tag1']);
    expect(payload.knowledge_bases).toEqual(['kb1']);
  });

  it('should create agent with FormData when avatar exists', () => {
    mockService.createAgent.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));

    component.agentForm.patchValue({
      agentName: 'New Agent',
      agentTitle: 'New Title',
      characterBackground: 'New Background',
    });
    component.selectedPersona = 'Tough Client';
    component.knowledgeBases = [{ _id: 'kb1' }];
    component.avatarFile = new File([''], 'avatar.png', { type: 'image/png' });

    component.saveAgent();

    expect(mockService.createAgent).toHaveBeenCalled();
    const payload = mockService.createAgent.calls.mostRecent().args[0];
    expect(payload instanceof FormData).toBeTrue();
  });

  it('should navigate to agent list on successful create', () => {
    mockService.createAgent.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));

    component.agentForm.patchValue({
      agentName: 'New Agent',
      agentTitle: 'Title',
      characterBackground: 'Background',
    });
    component.selectedPersona = 'Tough Client';
    component.knowledgeBases = [{ _id: 'kb1' }];

    component.saveAgent();

    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Agent created successfully' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/system/agent-list']);
  });

  it('should show error on create failure', () => {
    mockService.createAgent.and.returnValue(throwError(() => ({
      error: { errors: { msg: 'Create failed' } },
    })));

    component.agentForm.patchValue({
      agentName: 'New Agent',
      agentTitle: 'Title',
      characterBackground: 'Background',
    });
    component.selectedPersona = 'Tough Client';
    component.knowledgeBases = [{ _id: 'kb1' }];

    component.saveAgent();

    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Create failed' });
  });

  // ── Archive / Delete Agent ──

  it('should archive agent and navigate', () => {
    component.agentId = 'agent123';
    mockService.archiveAgent.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));
    component.archiveAgent();
    expect(mockService.archiveAgent).toHaveBeenCalledWith({ id: 'agent123' });
  });

  it('should not archive without agentId', () => {
    component.agentId = null;
    component.archiveAgent();
    expect(mockService.archiveAgent).not.toHaveBeenCalled();
  });

  it('should delete agent and navigate', () => {
    component.agentId = 'agent123';
    mockService.deleteAgent.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));
    component.deleteAgent();
    expect(mockService.deleteAgent).toHaveBeenCalledWith({ id: 'agent123' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/system/agent-list']);
  });

  it('should not delete without agentId', () => {
    component.agentId = null;
    component.deleteAgent();
    expect(mockService.deleteAgent).not.toHaveBeenCalled();
  });

  // ── Transcripts ──

  it('should toggle transcript menu', () => {
    const event = new Event('click');
    spyOn(event, 'stopPropagation');
    component.toggleTranscriptMenu(0, event);
    expect(component.transcriptMenuOpenIndex).toBe(0);
    component.toggleTranscriptMenu(0, event);
    expect(component.transcriptMenuOpenIndex).toBeNull();
  });

  it('should close transcript menu', () => {
    component.transcriptMenuOpenIndex = 1;
    component.closeTranscriptMenu();
    expect(component.transcriptMenuOpenIndex).toBeNull();
  });

  it('should open chat view', () => {
    component.transcriptMenuOpenIndex = 1;
    component.openChatView();
    expect(component.viewingChat).toBeTrue();
    expect(component.transcriptMenuOpenIndex).toBeNull();
  });

  it('should go back to chat history', () => {
    component.viewingChat = true;
    component.backToChatHistory();
    expect(component.viewingChat).toBeFalse();
  });

  // ── Chat Toggle ──

  it('should toggle chat visibility', () => {
    expect(component.isChatVisible).toBeTrue();
    component.toggleChat();
    expect(component.isChatVisible).toBeFalse();
    component.toggleChat();
    expect(component.isChatVisible).toBeTrue();
  });
});
