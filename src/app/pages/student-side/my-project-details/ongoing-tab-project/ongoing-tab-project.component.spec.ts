import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OngoingTabProjectComponent } from './ongoing-tab-project.component';

describe('OngoingTabProjectComponent', () => {
  let component: OngoingTabProjectComponent;
  let fixture: ComponentFixture<OngoingTabProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OngoingTabProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OngoingTabProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
