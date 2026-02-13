import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIntro1Component } from './video-intro1.component';

describe('VideoIntro1Component', () => {
  let component: VideoIntro1Component;
  let fixture: ComponentFixture<VideoIntro1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoIntro1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIntro1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
