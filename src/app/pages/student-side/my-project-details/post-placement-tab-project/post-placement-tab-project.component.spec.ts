import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPlacementTabProjectComponent } from './post-placement-tab-project.component';

describe('PostPlacementTabProjectComponent', () => {
  let component: PostPlacementTabProjectComponent;
  let fixture: ComponentFixture<PostPlacementTabProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPlacementTabProjectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPlacementTabProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
