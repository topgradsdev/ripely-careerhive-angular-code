import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateEditFaqComponent } from './graduate-edit-faq.component';

describe('GraduateEditFaqComponent', () => {
  let component: GraduateEditFaqComponent;
  let fixture: ComponentFixture<GraduateEditFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduateEditFaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateEditFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
