import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySiteVisitsDetailsComponent } from './my-site-visits-details.component';

describe('MySiteVisitsDetailsComponent', () => {
  let component: MySiteVisitsDetailsComponent;
  let fixture: ComponentFixture<MySiteVisitsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySiteVisitsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySiteVisitsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
