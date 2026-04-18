import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowCaseComponent } from './show-case.component';

describe('ShowCaseComponent', () => {
  let component: ShowCaseComponent;
  let fixture: ComponentFixture<ShowCaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShowCaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ShowCaseComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
