import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsSubHeadingsComponent } from './terms-sub-headings.component';

describe('TermsSubHeadingsComponent', () => {
  let component: TermsSubHeadingsComponent;
  let fixture: ComponentFixture<TermsSubHeadingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsSubHeadingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsSubHeadingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
