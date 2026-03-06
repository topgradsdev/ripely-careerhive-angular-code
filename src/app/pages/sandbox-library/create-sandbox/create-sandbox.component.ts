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

  categoryOptions = [
    { label: 'Coding', value: 'Coding' },
    { label: 'SQL', value: 'SQL' },
    { label: 'Cyber Security', value: 'Cyber Security' },
    { label: 'Testing', value: 'Testing' },
    { label: 'Bug Tracking', value: 'Bug Tracking' },
    { label: 'Load Testing', value: 'Load Testing' },
    { label: 'API Testing', value: 'API Testing' },
  ];

  languageOptions: { label: string; value: string }[] = [];

  categoryLanguageMap: { [key: string]: { label: string; value: string }[] } = {
    'Coding': [
      { label: 'JavaScript', value: 'javascript' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Python', value: 'python' },
      { label: 'Java', value: 'java' },
      { label: 'C', value: 'c' },
      { label: 'C++', value: 'cpp' },
      { label: 'HTML', value: 'html' },
      { label: 'CSS', value: 'css' },
      { label: 'PHP', value: 'php' },
      { label: 'Ruby', value: 'ruby' },
      { label: 'Go', value: 'go' },
      { label: 'Rust', value: 'rust' },
    ],
    'SQL': [
      { label: 'SQL Fiddle', value: 'sql_fiddle' },
      { label: 'DB Fiddle', value: 'db_fiddle' },
      { label: 'SQLite Online', value: 'sqlite_online' },
      { label: 'Adminer', value: 'adminer' },
      { label: 'MySQL', value: 'mysql' },
      { label: 'PostgreSQL', value: 'postgresql' },
    ],
    'Cyber Security': [
      { label: 'Security Onion', value: 'security_onion' },
      { label: 'Cuckoo Sandbox', value: 'cuckoo_sandbox' },
      { label: 'Zeek', value: 'zeek' },
      { label: 'Snort', value: 'snort' },
      { label: 'Firejail', value: 'firejail' },
    ],
    'Testing': [
      { label: 'Selenium', value: 'selenium' },
      { label: 'Playwright', value: 'playwright' },
      { label: 'TestCafe', value: 'testcafe' },
      { label: 'Cypress', value: 'cypress' },
    ],
    'Bug Tracking': [
      { label: 'Bugzilla', value: 'bugzilla' },
      { label: 'MantisBT', value: 'mantisbt' },
    ],
    'Load Testing': [
      { label: 'Apache JMeter', value: 'apache_jmeter' },
      { label: 'Locust', value: 'locust' },
      { label: 'K6', value: 'k6' },
    ],
    'API Testing': [
      { label: 'Postman', value: 'postman' },
      { label: 'Insomnia', value: 'insomnia' },
      { label: 'RestAssured', value: 'restassured' },
      { label: 'Hoppscotch', value: 'hoppscotch' },
    ],
  };


  constructor(
    private fb: FormBuilder,
    private service: TopgradserviceService,
    private router: Router,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {
    this.sandboxForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      language: [''],
      html_structure: [''],
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

  onCategoryChange() {
    const category = this.sandboxForm.get('category')?.value;
    this.languageOptions = this.categoryLanguageMap[category] || [];
    this.sandboxForm.patchValue({ language: '' });
  }

  loadSandbox(id: string) {
    this.service.getSandboxById({ id }).subscribe({
      next: (res: any) => {
        if (res.status === HttpResponseCode.SUCCESS && res.data) {
          this.languageOptions = this.categoryLanguageMap[res.data.category] || [];
          this.sandboxForm.patchValue({
            name: res.data.name,
            category: res.data.category,
            language: res.data.language,
            html_structure: res.data.html_structure || '',
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
    for (const langs of Object.values(this.categoryLanguageMap)) {
      const found = langs.find(l => l.value === value);
      if (found) return found.label;
    }
    return value || 'Code';
  }

  // Maps tool-based languages to their underlying execution runtime
  private executionLanguageMap: { [key: string]: string } = {
    // Coding - direct
    javascript: 'javascript',
    typescript: 'typescript',
    python: 'python',
    java: 'java',
    c: 'c',
    cpp: 'cpp',
    html: 'html',
    css: 'css',
    php: 'php',
    ruby: 'ruby',
    go: 'go',
    rust: 'rust',
    // SQL tools
    sql_fiddle: 'sql_fiddle',
    db_fiddle: 'db_fiddle',
    sqlite_online: 'sqlite_online',
    adminer: 'sql_fiddle',
    mysql: 'mysql',
    postgresql: 'postgresql',
    // Cyber Security (scripts typically in Python/Bash)
    security_onion: 'python',
    cuckoo_sandbox: 'python',
    zeek: 'python',
    snort: 'python',
    firejail: 'python',
    // Testing (JS-based frameworks)
    selenium: 'javascript',
    playwright: 'javascript',
    testcafe: 'javascript',
    cypress: 'javascript',
    // Bug Tracking (Python scripts)
    bugzilla: 'python',
    mantisbt: 'python',
    // Load Testing
    apache_jmeter: 'javascript',
    locust: 'python',
    k6: 'javascript',
    // API Testing (JS-based)
    postman: 'javascript',
    insomnia: 'javascript',
    restassured: 'javascript',
    hoppscotch: 'javascript',
  };

  private getExecutionLanguage(language: string): string {
    return this.executionLanguageMap[language] || language;
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

    const execLang = this.getExecutionLanguage(language);

    if (execLang === 'javascript' || execLang === 'typescript') {
      this.runJavaScript(code);
    } else if (execLang === 'html' || execLang === 'css') {
      this.runHtml(code, execLang);
    } else {
      // Show loading message while waiting for server
      this.outputLines = ['⏳ Executing code on server...'];
      this.service.executeSandboxCode({ code, language: execLang }).subscribe({
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
          this.outputLines = ['Execution failed. Please try again.'];
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

  private defaultCssHtml = `<h1>CSS Preview</h1>
<p>Your styles are applied to this page.</p>
<div class="container">
  <div class="box">Box 1</div>
  <div class="box">Box 2</div>
  <div class="box">Box 3</div>
</div>`;

  private runHtml(code: string, language: string) {
    let htmlContent = code;
    if (language === 'css') {
      const htmlBody = this.sandboxForm.get('html_structure')?.value || this.defaultCssHtml;
      htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>${code}</style>
</head>
<body>
${htmlBody}
</body>
</html>`;
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
