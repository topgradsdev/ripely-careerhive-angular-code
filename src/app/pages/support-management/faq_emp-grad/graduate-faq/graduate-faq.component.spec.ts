import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraduateFaqComponent } from './graduate-faq.component';

describe('GraduateFaqComponent', () => {
  let component: GraduateFaqComponent;
  let fixture: ComponentFixture<GraduateFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraduateFaqComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraduateFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
