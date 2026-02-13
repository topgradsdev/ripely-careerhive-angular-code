
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadTabProjectComponent } from './download-tab-project.component';

describe('DownloadTabProjectComponent', () => {
  let component: DownloadTabProjectComponent;
  let fixture: ComponentFixture<DownloadTabProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadTabProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadTabProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
