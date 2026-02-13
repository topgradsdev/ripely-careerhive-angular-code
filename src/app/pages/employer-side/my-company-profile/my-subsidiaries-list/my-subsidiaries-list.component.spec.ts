import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySubsidiariesListComponent } from './my-subsidiaries-list.component';

describe('MySubsidiariesListComponent', () => {
  let component: MySubsidiariesListComponent;
  let fixture: ComponentFixture<MySubsidiariesListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MySubsidiariesListComponent]
    });
    fixture = TestBed.createComponent(MySubsidiariesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
