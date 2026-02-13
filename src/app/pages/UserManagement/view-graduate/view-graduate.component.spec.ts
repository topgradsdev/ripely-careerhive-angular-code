import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewGraduateComponent } from './view-graduate.component';

describe('ViewGraduateComponent', () => {
  let component: ViewGraduateComponent;
  let fixture: ComponentFixture<ViewGraduateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewGraduateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewGraduateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
