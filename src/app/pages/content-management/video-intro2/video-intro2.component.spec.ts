import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIntro2Component } from './video-intro2.component';

describe('VideoIntro2Component', () => {
  let component: VideoIntro2Component;
  let fixture: ComponentFixture<VideoIntro2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoIntro2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIntro2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
