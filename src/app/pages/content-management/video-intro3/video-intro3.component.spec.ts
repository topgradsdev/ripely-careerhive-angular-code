import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoIntro3Component } from './video-intro3.component';

describe('VideoIntro3Component', () => {
  let component: VideoIntro3Component;
  let fixture: ComponentFixture<VideoIntro3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoIntro3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoIntro3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
