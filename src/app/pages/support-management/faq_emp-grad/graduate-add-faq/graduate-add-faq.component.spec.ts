import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateAddFaqComponent } from './graduate-add-faq.component';

describe('GraduateAddFaqComponent', () => {
  let component: GraduateAddFaqComponent;
  let fixture: ComponentFixture<GraduateAddFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduateAddFaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateAddFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
