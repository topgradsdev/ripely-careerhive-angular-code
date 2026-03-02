import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';

@Component({
  selector: 'app-add-knowledge-base',
  templateUrl: './add-knowledge-base.component.html',
  styleUrls: ['./add-knowledge-base.component.scss'],
})
export class AddKnowledgeBaseComponent implements OnInit {

  kbForm!: FormGroup;

  kbTags: string[] = [];
  kbTagInput = '';

  kbBrainFiles: { name: string; url: string }[] = [
    // { name: 'Uploaded_File.pdf', url: '' }
  ];

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private cdr: ChangeDetectorRef
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
    this.kbBrainFiles.splice(index, 1);
  }

  onBrainFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const files = Array.from(input.files);
      files.forEach((file) => {
        const formData = new FormData();
        formData.append('media', file);

        this.service.uploadOthersMedia(formData).subscribe({
          next: (resp: any) => {
            this.kbBrainFiles.push({ name: file.name, url: resp });
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Brain file upload failed:', err),
        });
      });
      input.value = '';
    }
  }

  saveKnowledgeBase() {
    if (this.kbForm.invalid) {
      this.kbForm.markAllAsTouched();
      return;
    }

    const formVal = this.kbForm.value;
    const payload = {
      name: formVal.kbName,
      description: formVal.kbDescription,
      tags: this.kbTags,
      additionalPrompts: formVal.kbAdditionalPrompts,
      brainUrl: formVal.kbBrainUrl,
      brainFiles: this.kbBrainFiles,
    };

    this.service.createKnowledgeBase(payload).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS) {
          document.getElementById('kb-save-success')?.click();
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

  ngOnInit(): void {
    this.kbForm = this.fb.group({
      kbName: ['', [Validators.required]],
      kbDescription: ['', [Validators.required]],
      kbBrainUrl: [''],
      kbAdditionalPrompts: [''],
    });
  }

}
