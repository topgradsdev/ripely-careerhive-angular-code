import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDefaultLayoutComponent } from './login-default-layout.component';

describe('LoginDefaultLayoutComponent', () => {
  let component: LoginDefaultLayoutComponent;
  let fixture: ComponentFixture<LoginDefaultLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginDefaultLayoutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginDefaultLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
