import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';

import { AddKnowledgeBaseComponent } from './add-knowledge-base.component';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';

describe('AddKnowledgeBaseComponent', () => {
  let component: AddKnowledgeBaseComponent;
  let fixture: ComponentFixture<AddKnowledgeBaseComponent>;
  let mockService: jasmine.SpyObj<TopgradserviceService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('TopgradserviceService', [
      'createKnowledgeBase',
      'uploadOthersMedia',
      'showMessage',
    ]);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      declarations: [AddKnowledgeBaseComponent],
      providers: [
        FormBuilder,
        { provide: TopgradserviceService, useValue: mockService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKnowledgeBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── Init ──

  it('should initialize form with required validators', () => {
    expect(component.kbForm).toBeTruthy();
    expect(component.kbForm.get('kbName')).toBeTruthy();
    expect(component.kbForm.get('kbDescription')).toBeTruthy();
    expect(component.kbForm.get('kbBrainUrl')).toBeTruthy();
    expect(component.kbForm.get('kbAdditionalPrompts')).toBeTruthy();
  });

  it('should have kbName as required', () => {
    const control = component.kbForm.get('kbName');
    control?.setValue('');
    expect(control?.valid).toBeFalse();
    control?.setValue('Test KB');
    expect(control?.valid).toBeTrue();
  });

  it('should have kbDescription as required', () => {
    const control = component.kbForm.get('kbDescription');
    control?.setValue('');
    expect(control?.valid).toBeFalse();
    control?.setValue('A description');
    expect(control?.valid).toBeTrue();
  });

  it('should have kbBrainUrl as optional', () => {
    const control = component.kbForm.get('kbBrainUrl');
    control?.setValue('');
    expect(control?.valid).toBeTrue();
  });

  it('should have kbAdditionalPrompts as optional', () => {
    const control = component.kbForm.get('kbAdditionalPrompts');
    control?.setValue('');
    expect(control?.valid).toBeTrue();
  });

  // ── Tags ──

  it('should add a tag', () => {
    component.kbTagInput = 'security';
    component.addTag();
    expect(component.kbTags).toContain('security');
    expect(component.kbTagInput).toBe('');
  });

  it('should not add duplicate tag', () => {
    component.kbTags = ['security'];
    component.kbTagInput = 'security';
    component.addTag();
    expect(component.kbTags.length).toBe(1);
  });

  it('should not add empty tag', () => {
    component.kbTagInput = '  ';
    component.addTag();
    expect(component.kbTags.length).toBe(0);
  });

  it('should remove a tag by index', () => {
    component.kbTags = ['tag1', 'tag2', 'tag3'];
    component.removeTag(1);
    expect(component.kbTags).toEqual(['tag1', 'tag3']);
  });

  it('should add tag on Enter keydown', () => {
    component.kbTagInput = 'enterTag';
    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    spyOn(event, 'preventDefault');
    component.onTagKeydown(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(component.kbTags).toContain('enterTag');
  });

  it('should not add tag on non-Enter keydown', () => {
    component.kbTagInput = 'test';
    const event = new KeyboardEvent('keydown', { key: 'a' });
    component.onTagKeydown(event);
    expect(component.kbTags).not.toContain('test');
  });

  // ── Brain Files ──

  it('should remove brain file by index', () => {
    component.kbBrainFiles = [
      { name: 'file1.pdf', url: 'url1' },
      { name: 'file2.pdf', url: 'url2' },
    ];
    component.removeBrainFile(0);
    expect(component.kbBrainFiles.length).toBe(1);
    expect(component.kbBrainFiles[0].name).toBe('file2.pdf');
  });

  it('should open file URL in new tab', () => {
    spyOn(window, 'open');
    component.viewFile('https://example.com/file.pdf');
    expect(window.open).toHaveBeenCalledWith('https://example.com/file.pdf', '_blank');
  });

  it('should not open window for empty URL', () => {
    spyOn(window, 'open');
    component.viewFile('');
    expect(window.open).not.toHaveBeenCalled();
  });

  it('should upload brain files on selection', () => {
    mockService.uploadOthersMedia.and.returnValue(of('https://uploaded-url.com/file.pdf'));

    const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
    const input = { files: [file], value: '' } as any;
    const event = { target: input } as any;

    component.onBrainFileSelected(event);

    expect(mockService.uploadOthersMedia).toHaveBeenCalled();
    expect(component.kbBrainFiles.length).toBe(1);
    expect(component.kbBrainFiles[0].name).toBe('test.pdf');
    expect(component.kbBrainFiles[0].url).toBe('https://uploaded-url.com/file.pdf');
  });

  it('should handle brain file upload error', () => {
    mockService.uploadOthersMedia.and.returnValue(throwError(() => new Error('Upload failed')));
    spyOn(console, 'error');

    const file = new File(['content'], 'test.pdf');
    const input = { files: [file], value: '' } as any;
    const event = { target: input } as any;

    component.onBrainFileSelected(event);

    expect(console.error).toHaveBeenCalled();
    expect(component.kbBrainFiles.length).toBe(0);
  });

  it('should handle null files on brain file selection', () => {
    const input = { files: null } as any;
    const event = { target: input } as any;
    component.onBrainFileSelected(event);
    expect(mockService.uploadOthersMedia).not.toHaveBeenCalled();
  });

  // ── Save Knowledge Base ──

  it('should not save if form is invalid', () => {
    component.saveKnowledgeBase();
    expect(mockService.createKnowledgeBase).not.toHaveBeenCalled();
  });

  it('should save knowledge base with valid form', () => {
    mockService.createKnowledgeBase.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));

    component.kbForm.patchValue({
      kbName: 'Test KB',
      kbDescription: 'A test knowledge base',
      kbBrainUrl: 'https://example.com',
      kbAdditionalPrompts: 'Some prompts',
    });
    component.kbTags = ['tag1', 'tag2'];
    component.kbBrainFiles = [{ name: 'file.pdf', url: 'url' }];

    component.saveKnowledgeBase();

    expect(mockService.createKnowledgeBase).toHaveBeenCalled();
    const payload = mockService.createKnowledgeBase.calls.mostRecent().args[0];
    expect(payload.name).toBe('Test KB');
    expect(payload.description).toBe('A test knowledge base');
    expect(payload.tags).toEqual(['tag1', 'tag2']);
    expect(payload.brainUrl).toBe('https://example.com');
    expect(payload.additionalPrompts).toBe('Some prompts');
    expect(payload.brainFiles.length).toBe(1);
  });

  it('should trigger success modal on save success', () => {
    mockService.createKnowledgeBase.and.returnValue(of({ status: HttpResponseCode.SUCCESS }));
    const mockElement = { click: jasmine.createSpy('click') };
    spyOn(document, 'getElementById').and.returnValue(mockElement as any);

    component.kbForm.patchValue({
      kbName: 'Test KB',
      kbDescription: 'Description',
    });
    component.saveKnowledgeBase();

    expect(document.getElementById).toHaveBeenCalledWith('kb-save-success');
    expect(mockElement.click).toHaveBeenCalled();
  });

  it('should show message on non-success response', () => {
    mockService.createKnowledgeBase.and.returnValue(of({ status: 400, msg: 'Failed to save' }));

    component.kbForm.patchValue({
      kbName: 'Test KB',
      kbDescription: 'Description',
    });
    component.saveKnowledgeBase();

    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Failed to save' });
  });

  it('should show error message on save failure', () => {
    mockService.createKnowledgeBase.and.returnValue(throwError(() => ({
      error: { errors: { msg: 'Server error' } },
    })));

    component.kbForm.patchValue({
      kbName: 'Test KB',
      kbDescription: 'Description',
    });
    component.saveKnowledgeBase();

    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Server error' });
  });

  it('should show fallback error message when no specific error', () => {
    mockService.createKnowledgeBase.and.returnValue(throwError(() => ({ error: {} })));

    component.kbForm.patchValue({
      kbName: 'Test KB',
      kbDescription: 'Description',
    });
    component.saveKnowledgeBase();

    expect(mockService.showMessage).toHaveBeenCalledWith({ message: 'Something went wrong' });
  });
});
