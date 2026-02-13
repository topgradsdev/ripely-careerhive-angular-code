import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPlacementTabComponent } from './post-placement-tab.component';

describe('PostPlacementTabComponent', () => {
  let component: PostPlacementTabComponent;
  let fixture: ComponentFixture<PostPlacementTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostPlacementTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPlacementTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
