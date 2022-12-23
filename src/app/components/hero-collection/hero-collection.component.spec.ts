import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroCollectionComponent } from './hero-collection.component';

describe('HeroCollectionComponent', () => {
  let component: HeroCollectionComponent;
  let fixture: ComponentFixture<HeroCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HeroCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
