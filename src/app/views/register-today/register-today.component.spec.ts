import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterTodayComponent } from './register-today.component';

describe('RegisterTodayComponent', () => {
  let component: RegisterTodayComponent;
  let fixture: ComponentFixture<RegisterTodayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterTodayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterTodayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
