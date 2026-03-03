import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { AIAgentComponent } from './ai-agent.component';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';

describe('AIAgentComponent', () => {
  let component: AIAgentComponent;
  let fixture: ComponentFixture<AIAgentComponent>;
  let mockService: jasmine.SpyObj<TopgradserviceService>;
  let mockRouter: jasmine.SpyObj<Router>;

  const successAgentList = {
    status: HttpResponseCode.SUCCESS,
    data: [
      { _id: '1', name: 'Agent 1', title: 'Title 1' },
      { _id: '2', name: 'Agent 2', title: 'Title 2' },
    ],
  };

  const successKBList = {
    status: HttpResponseCode.SUCCESS,
    data: [
      { _id: 'kb1', title: 'KB 1', skills: ['skill1'] },
      { _id: 'kb2', title: 'KB 2', skills: ['skill2', 'skill3'] },
    ],
  };

  const successAgentStats = {
    status: HttpResponseCode.SUCCESS,
    data: { total: 10, active: 7, archived: 3, deployed: 5 },
  };

  const successKBStats = {
    status: HttpResponseCode.SUCCESS,
    data: { total: 8, active: 6, archived: 2 },
  };

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('TopgradserviceService', [
      'getAgentList',
      'getAgentStats',
      'getKnowledgeBaseList',
      'getKBStats',
      'archiveAgent',
      'archiveKnowledgeBase',
      'showMessage',
    ]);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    // Default returns
    mockService.getAgentList.and.returnValue(of(successAgentList));
    mockService.getAgentStats.and.returnValue(of(successAgentStats));
    mockService.getKnowledgeBaseList.and.returnValue(of(successKBList));
    mockService.getKBStats.and.returnValue(of(successKBStats));

    await TestBed.configureTestingModule({
      declarations: [AIAgentComponent],
      providers: [
        FormBuilder,
        { provide: TopgradserviceService, useValue: mockService },
        { provide: Router, useValue: mockRouter },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AIAgentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── ngOnInit ──

  it('should load agents, knowledge bases, and stats on init', () => {
    expect(mockService.getAgentList).toHaveBeenCalledWith({ search: '', page: 1, limit: 100, status: 'active' });
    expect(mockService.getKnowledgeBaseList).toHaveBeenCalledWith({ search: '', page: 1, limit: 100, status: 'active' });
    expect(mockService.getAgentStats).toHaveBeenCalledWith({});
    expect(mockService.getKBStats).toHaveBeenCalledWith({});
  });

  // ── Agent List ──

  it('should populate reviewers from agent list API', () => {
    expect(component.reviewers.length).toBe(2);
    expect(component.reviewers[0].name).toBe('Agent 1');
  });

  it('should handle agent list API error', () => {
    mockService.getAgentList.and.returnValue(throwError(() => ({ error: { errors: { msg: 'Server error' } } })));
    component.getAgentList();
    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Server error' });
  });

  it('should handle agent list API error with fallback message', () => {
    mockService.getAgentList.and.returnValue(throwError(() => ({ error: {} })));
    component.getAgentList();
    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Failed to load agents' });
  });

  // ── Agent Stats ──

  it('should populate agent stats', () => {
    expect(component.totalAgents).toBe(10);
    expect(component.activeAgents).toBe(7);
    expect(component.archivedAgentsCount).toBe(3);
    expect(component.deployedAgents).toBe(5);
  });

  // ── Knowledge Base List ──

  it('should populate cards from knowledge base list API', () => {
    expect(component.cards.length).toBe(2);
    expect(component.cards[0].title).toBe('KB 1');
  });

  it('should handle KB list API error', () => {
    mockService.getKnowledgeBaseList.and.returnValue(throwError(() => ({ error: { errors: { msg: 'KB error' } } })));
    component.getKnowledgeBaseList();
    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'KB error' });
  });

  // ── KB Stats ──

  it('should populate KB stats', () => {
    expect(component.totalKnowledgeBases).toBe(8);
    expect(component.activeKBCount).toBe(6);
    expect(component.archivedKBCount).toBe(2);
  });

  // ── Filtered Cards ──

  it('should return all cards when search text is empty', () => {
    component.kbSearchText = '';
    expect(component.filteredCards.length).toBe(2);
  });

  it('should filter cards by title', () => {
    component.kbSearchText = 'KB 1';
    expect(component.filteredCards.length).toBe(1);
    expect(component.filteredCards[0].title).toBe('KB 1');
  });

  it('should filter cards by skill', () => {
    component.kbSearchText = 'skill2';
    expect(component.filteredCards.length).toBe(1);
    expect(component.filteredCards[0]._id).toBe('kb2');
  });

  it('should return empty when no match', () => {
    component.kbSearchText = 'nonexistent';
    expect(component.filteredCards.length).toBe(0);
  });

  // ── Archive Agent ──

  it('should archive agent and refresh list', () => {
    mockService.archiveAgent.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));
    const event = new Event('click');
    spyOn(event, 'stopPropagation');

    component.archiveAgent({ _id: '1' }, event);

    expect(event.stopPropagation).toHaveBeenCalled();
    expect(mockService.archiveAgent).toHaveBeenCalledWith({ id: '1' });
  });

  it('should not archive agent without _id', () => {
    const event = new Event('click');
    component.archiveAgent({}, event);
    expect(mockService.archiveAgent).not.toHaveBeenCalled();
  });

  it('should handle archive agent error', () => {
    mockService.archiveAgent.and.returnValue(throwError(() => ({ error: { errors: { msg: 'Archive failed' } } })));
    const event = new Event('click');
    component.archiveAgent({ _id: '1' }, event);
    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Archive failed' });
  });

  // ── Archive KB ──

  it('should archive KB and refresh list', () => {
    mockService.archiveKnowledgeBase.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));
    const event = new Event('click');
    component.archiveKB({ _id: 'kb1' }, event);
    expect(mockService.archiveKnowledgeBase).toHaveBeenCalledWith({ id: 'kb1' });
  });

  it('should not archive KB without _id', () => {
    const event = new Event('click');
    component.archiveKB({}, event);
    expect(mockService.archiveKnowledgeBase).not.toHaveBeenCalled();
  });

  // ── Navigation ──

  it('should navigate to edit agent', () => {
    component.editReviewer({ _id: '1' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/system/edit-agent', '1']);
  });

  it('should not navigate without _id for agent', () => {
    component.editReviewer({});
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to edit knowledge base', () => {
    component.edit({ _id: 'kb1' });
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/admin/system/edit-knowledge-base', 'kb1']);
  });

  it('should not navigate without _id for KB', () => {
    component.edit({});
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  // ── Archived Views ──

  it('should open archived agents view', () => {
    mockService.getAgentList.and.returnValue(of({
      status: HttpResponseCode.SUCCESS,
      data: [{ _id: 'a1', name: 'Archived Agent' }],
    }));
    component.openArchivedAgents();
    expect(component.showArchivedAgents).toBeTrue();
    expect(mockService.getAgentList).toHaveBeenCalledWith({ search: '', page: 1, limit: 100, status: 'archived' });
  });

  it('should go back to active agents', () => {
    component.showArchivedAgents = true;
    component.backToActiveAgents();
    expect(component.showArchivedAgents).toBeFalse();
  });

  it('should open archived KB view', () => {
    mockService.getKnowledgeBaseList.and.returnValue(of({
      status: HttpResponseCode.SUCCESS,
      data: [{ _id: 'akb1', title: 'Archived KB' }],
    }));
    component.openArchivedKB();
    expect(component.showArchivedKB).toBeTrue();
  });

  it('should go back to active KB', () => {
    component.showArchivedKB = true;
    component.backToActiveKB();
    expect(component.showArchivedKB).toBeFalse();
  });

  // ── Tab Change ──

  it('should update selectedIndex on tab change', () => {
    component.onTabChange({ index: 1 } as any);
    expect(component.selectedIndex).toBe(1);
  });

  it('should update selectedIndex on btnTabs', () => {
    component.btnTabs(2);
    expect(component.selectedIndex).toBe(2);
  });
});
