import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordListsComponent } from './word-lists.component';

describe('WordListsComponent', () => {
  let component: WordListsComponent;
  let fixture: ComponentFixture<WordListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WordListsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WordListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
