import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewSubsidiariesListComponent } from './view-subsidiaries-list.component';

describe('ViewSubsidiariesListComponent', () => {
  let component: ViewSubsidiariesListComponent;
  let fixture: ComponentFixture<ViewSubsidiariesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewSubsidiariesListComponent]
    });
    fixture = TestBed.createComponent(ViewSubsidiariesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
