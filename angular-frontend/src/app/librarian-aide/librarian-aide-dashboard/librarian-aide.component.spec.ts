import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrarianAideComponent } from './librarian-aide.component';

describe('LibrarianAideComponent', () => {
  let component: LibrarianAideComponent;
  let fixture: ComponentFixture<LibrarianAideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibrarianAideComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LibrarianAideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
