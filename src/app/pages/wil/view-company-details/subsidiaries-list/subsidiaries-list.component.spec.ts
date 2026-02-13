import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubsidiariesListComponent } from './subsidiaries-list.component';

describe('SubsidiariesListComponent', () => {
  let component: SubsidiariesListComponent;
  let fixture: ComponentFixture<SubsidiariesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubsidiariesListComponent]
    });
    fixture = TestBed.createComponent(SubsidiariesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
