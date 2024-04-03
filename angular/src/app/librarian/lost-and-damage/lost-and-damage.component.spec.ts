import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LostAndDamageComponent } from './lost-and-damage.component';

describe('LostAndDamageComponent', () => {
  let component: LostAndDamageComponent;
  let fixture: ComponentFixture<LostAndDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LostAndDamageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LostAndDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
