
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedTabProjectComponent } from './completed-tab-project.component';

describe('CompletedTabProjectComponent', () => {
  let component: CompletedTabProjectComponent;
  let fixture: ComponentFixture<CompletedTabProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompletedTabProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletedTabProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
