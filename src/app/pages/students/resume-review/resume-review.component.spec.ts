import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeReviewComponent } from './resume-review.component';

describe('ResumeReviewComponent', () => {
  let component: ResumeReviewComponent;
  let fixture: ComponentFixture<ResumeReviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResumeReviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
