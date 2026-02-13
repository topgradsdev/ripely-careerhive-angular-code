import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadableContentComponent } from './downloadable-content.component';

describe('DownloadableContentComponent', () => {
  let component: DownloadableContentComponent;
  let fixture: ComponentFixture<DownloadableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadableContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
