import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TopgradserviceService } from '../../../topgradservice.service';
import { HttpResponseCode } from '../../../shared/enum';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-create-sandbox',
  templateUrl: './create-sandbox.component.html',
  styleUrls: ['./create-sandbox.component.scss'],
})
export class CreateSandboxComponent implements OnInit {

  sandboxForm: FormGroup;
  isEdit: boolean = false;
  sandboxId: string = '';
  showPreview: boolean = false;
  outputLines: string[] = [];
  isRunning: boolean = false;
  showHtmlPreview: boolean = false;
  htmlPreviewUrl: SafeResourceUrl | null = null;

  languageOptions = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C++', value: 'cpp' },
    { label: 'C#', value: 'csharp' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'SQL', value: 'sql' },
    { label: 'PHP', value: 'php' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'Go', value: 'go' },
    { label: 'Rust', value: 'rust' },
  ];

  editorModeOptions = [
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'Python', value: 'python' },
    { label: 'Java', value: 'java' },
    { label: 'C/C++', value: 'c_cpp' },
    { label: 'C#', value: 'csharp' },
    { label: 'HTML', value: 'html' },
    { label: 'CSS', value: 'css' },
    { label: 'SQL', value: 'sql' },
    { label: 'PHP', value: 'php' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'Go', value: 'golang' },
    { label: 'Rust', value: 'rust' },
  ];

  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.sandboxForm = this.fb.group({
      name: ['', Validators.required],
      language: ['', Validators.required],
      editor_mode: ['javascript'],
      template_code: [''],
      status: ['active'],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.sandboxId = id;
      this.loadSandbox(id);
    }
  }

  loadSandbox(id: string) {
    this.service.getSandboxById({ id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS && res.data) {
          this.sandboxForm.patchValue({
            name: res.data.name,
            language: res.data.language,
            editor_mode: res.data.editor_mode,
            template_code: res.data.template_code,
            status: res.data.status,
          });
        }
      },
      error: (err) => {
        this.service.showMessage({
          message: err.error?.errors?.msg || 'Failed to load sandbox',
        });
      },
    });
  }

  onSubmit() {
    if (this.sandboxForm.invalid) return;

    const formData = this.sandboxForm.value;

    if (this.isEdit) {
      formData.id = this.sandboxId;
      this.service.updateSandbox(formData).subscribe({
        next: (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.service.showMessage({ message: 'Sandbox updated successfully' });
            this.router.navigate(['/admin/sandbox-library/manage']);
          }
        },
        error: (err) => {
          this.service.showMessage({
            message: err.error?.errors?.msg || 'Failed to update sandbox',
          });
        },
      });
    } else {
      this.service.createSandbox(formData).subscribe({
        next: (res: any) => {
          if (res.status === HttpResponseCode.SUCCESS) {
            this.service.showMessage({ message: 'Sandbox created successfully' });
            this.router.navigate(['/admin/sandbox-library/manage']);
          }
        },
        error: (err) => {
          this.service.showMessage({
            message: err.error?.errors?.msg || 'Failed to create sandbox',
          });
        },
      });
    }
  }

  togglePreview() {
    this.showPreview = !this.showPreview;
    this.outputLines = [];
    this.showHtmlPreview = false;
    this.htmlPreviewUrl = null;
  }

  getLanguageLabel(value: string): string {
    const found = this.languageOptions.find(l => l.value === value);
    return found ? found.label : value || 'Code';
  }

  runCode() {
    const code = this.sandboxForm.get('template_code')?.value || '';
    const language = this.sandboxForm.get('language')?.value;

    if (!code.trim()) {
      this.outputLines = ['No code to run.'];
      return;
    }

    this.isRunning = true;
    this.outputLines = [];

    if (language === 'javascript' || language === 'typescript') {
      this.runJavaScript(code);
    } else if (language === 'html' || language === 'css') {
      this.runHtml(code, language);
    } else {
      this.service.executeSandboxCode({ code, language }).subscribe({
        next: (res: any) => {
          this.isRunning = false;
          if (res.status === HttpResponseCode.SUCCESS) {
            this.outputLines = (res.data?.output || 'No output').split('\n');
          } else {
            this.outputLines = ['Error: ' + (res.msg || 'Execution failed')];
          }
        },
        error: () => {
          this.isRunning = false;
          this.outputLines = ['Server execution not available for ' + this.getLanguageLabel(language) + '. Only JavaScript runs in preview.'];
        },
      });
    }
  }

  private runJavaScript(code: string) {
    const logs: string[] = [];
    const fakeConsole = {
      log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args: any[]) => logs.push('Error: ' + args.map(a => String(a)).join(' ')),
      warn: (...args: any[]) => logs.push('Warning: ' + args.map(a => String(a)).join(' ')),
      info: (...args: any[]) => logs.push(args.map(a => String(a)).join(' ')),
    };

    try {
      const fn = new Function('console', code);
      fn(fakeConsole);
      this.outputLines = logs.length ? logs : ['Code executed successfully. (No console output)'];
    } catch (err: any) {
      this.outputLines = [...logs, 'Error: ' + (err.message || String(err))];
    }
    this.isRunning = false;
  }

  private runHtml(code: string, language: string) {
    let htmlContent = code;
    if (language === 'css') {
      htmlContent = `<!DOCTYPE html><html><head><style>${code}</style></head><body><h1>CSS Preview</h1><p>Your styles are applied to this page.</p><div class="container"><div class="box">Box 1</div><div class="box">Box 2</div><div class="box">Box 3</div></div></body></html>`;
    }
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    this.htmlPreviewUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.showHtmlPreview = true;
    this.outputLines = [];
    this.isRunning = false;
  }

  cancel() {
    this.router.navigate(['/admin/sandbox-library/manage']);
  }
}
