import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SinglePageFormComponent } from './single-page-form.component';

describe('SinglePageFormComponent', () => {
  let component: SinglePageFormComponent;
  let fixture: ComponentFixture<SinglePageFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SinglePageFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SinglePageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
