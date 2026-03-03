import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { LoaderService } from '../../../loaderservice.service';

@Component({
  selector: 'app-add-knowledge-base',
  templateUrl: './add-knowledge-base.component.html',
  styleUrls: ['./add-knowledge-base.component.scss'],
})
export class AddKnowledgeBaseComponent implements OnInit {

  @ViewChild('archiveKBModal') archiveKBModal: ModalDirective;

  kbForm!: FormGroup;

  isEditMode = false;
  kbId: string | null = null;

  kbTags: string[] = [];
  kbTagInput = '';

  kbBrainFiles: any[] = [];
  pendingBrainFiles: File[] = [];
  kbStats: any = {};

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private loaderService: LoaderService
  ) {}

  addTag() {
    const tag = this.kbTagInput.trim();
    if (tag && !this.kbTags.includes(tag)) {
      this.kbTags.push(tag);
    }
    this.kbTagInput = '';
  }

  removeTag(index: number) {
    this.kbTags.splice(index, 1);
  }

  onTagKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.addTag();
    }
  }

  viewFile(url: string) {
    if (url) {
      window.open(url, '_blank');
    }
  }

  removeBrainFile(index: number) {
    const file = this.kbBrainFiles[index];
    if (this.isEditMode && this.kbId && file) {
      this.service.deleteKBBrainFile({ id: this.kbId, file_name: file.file_name, file_url: file.file_url }).subscribe({
        next: (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.kbBrainFiles.splice(index, 1);
            this.service.showMessage({ message: 'File deleted successfully' });
            this.cdr.detectChanges();
          } else {
            this.service.showMessage({ message: res.msg || 'Failed to delete file' });
          }
        },
        error: (err) => {
          this.service.showMessage({
            message: err.error?.errors?.msg || 'Failed to delete file',
          });
        },
      });
    } else {
      this.pendingBrainFiles.splice(index, 1);
      this.kbBrainFiles.splice(index, 1);
    }
  }

  onBrainFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      Array.from(input.files).forEach((file) => {
        if (this.isEditMode && this.kbId) {
          // Edit mode: upload immediately
          const fd = new FormData();
          fd.append('document', file, file.name);
          fd.append('id', this.kbId);

          this.service.uploadKBBrainFile(fd).subscribe({
            next: (res: any) => {
              if (res.status === HttpResponseCode.SUCCESS) {
                this.kbBrainFiles.push(res.data || { file_name: file.name, file_url: '' });
                this.service.showMessage({ message: 'File uploaded successfully' });
              } else {
                this.service.showMessage({ message: res.msg || 'Upload failed' });
              }
              this.cdr.detectChanges();
            },
            error: (err) => {
              this.service.showMessage({
                message: err.error?.errors?.msg || 'File upload failed',
              });
            },
          });
        } else {
          // Add mode: collect locally, upload on save
          this.pendingBrainFiles.push(file);
          this.kbBrainFiles.push({ file_name: file.name, file_url: '' });
          this.cdr.detectChanges();
        }
      });
      input.value = '';
    }
  }

  saveKnowledgeBase() {
    if (this.kbForm.invalid) {
      this.kbForm.markAllAsTouched();
      return;
    }

    this.loaderService.show();

    const formVal = this.kbForm.value;
    const payload: any = {
      name: formVal.kbName,
      description: formVal.kbDescription,
      tags: this.kbTags,
      additional_prompts: formVal.kbAdditionalPrompts || '',
      url: formVal.kbBrainUrl || '',
    };

    if (this.isEditMode && this.kbId) {
      payload.id = this.kbId;
      payload.brain_files = this.kbBrainFiles;

      this.service.updateKnowledgeBase(payload).subscribe({
        next: (res: any) => {
          this.loaderService.hide();
          if (res.status === HttpResponseCode.SUCCESS) {
            this.service.showMessage({ message: 'Knowledge Base updated successfully' });
            this.router.navigate(['/admin/system/agent-list'], { queryParams: { tab: 1 } });
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
    } else {
      // Create mode: first create KB, then upload pending brain files
      this.service.createKnowledgeBase(payload).subscribe({
        next: (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            const newKbId = res.data?._id || res.data?.id;
            if (this.pendingBrainFiles.length && newKbId) {
              this.uploadPendingBrainFiles(newKbId);
            } else {
              this.loaderService.hide();
              this.service.showMessage({ message: 'Knowledge Base created successfully' });
              this.router.navigate(['/admin/system/agent-list'], { queryParams: { tab: 1 } });
            }
          } else {
            this.loaderService.hide();
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
  }

  uploadPendingBrainFiles(kbId: string) {
    const uploads = this.pendingBrainFiles.map((file) => {
      const fd = new FormData();
      fd.append('document', file, file.name);
      fd.append('id', kbId);
      return this.service.uploadKBBrainFile(fd);
    });

    forkJoin(uploads).subscribe({
      next: () => {
        this.loaderService.hide();
        this.service.showMessage({ message: 'Knowledge Base created successfully' });
        this.router.navigate(['/admin/system/agent-list'], { queryParams: { tab: 1 } });
      },
      error: () => {
        this.loaderService.hide();
        this.service.showMessage({ message: 'Knowledge Base created but some files failed to upload' });
        this.router.navigate(['/admin/system/agent-list'], { queryParams: { tab: 1 } });
      },
    });
  }

  ngOnInit(): void {
    this.kbId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.kbId;

    this.kbForm = this.fb.group({
      kbName: ['', [Validators.required]],
      kbDescription: ['', [Validators.required]],
      kbBrainUrl: [''],
      kbAdditionalPrompts: [''],
    });

    this.getKBStats();

    if (this.isEditMode && this.kbId) {
      this.loadKnowledgeBaseById(this.kbId);
    }
  }

  getKBStats() {
    this.service.getKBStats({}).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.kbStats = res.data || {};
          this.cdr.detectChanges();
        }
      },
      error: () => {},
    });
  }

  archiveKB() {
    if (!this.kbId) return;
    this.service.archiveKnowledgeBase({ id: this.kbId }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          this.service.showMessage({ message: 'Knowledge Base archived successfully' });
          this.router.navigate(['/admin/system/agent-list'], { queryParams: { tab: 1 } });
        } else {
          this.service.showMessage({ message: res.msg });
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Something went wrong',
        });
      },
    });
  }

  loadKnowledgeBaseById(id: string) {
    this.service.getKnowledgeBaseById({ id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS && res.data) {
          const kb = res.data;

          this.kbForm.patchValue({
            kbName: kb.name || '',
            kbDescription: kb.description || '',
            kbBrainUrl: kb.url || '',
            kbAdditionalPrompts: kb.additional_prompts || '',
          });

          this.kbTags = kb.tags || [];
          this.kbBrainFiles = kb.brain_files || [];

          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load knowledge base',
        });
      },
    });
  }

}
