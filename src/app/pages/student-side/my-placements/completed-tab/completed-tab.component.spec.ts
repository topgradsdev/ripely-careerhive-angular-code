import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTabComponent } from './completed-tab.component';

describe('CompletedTabComponent', () => {
  let component: CompletedTabComponent;
  let fixture: ComponentFixture<CompletedTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
