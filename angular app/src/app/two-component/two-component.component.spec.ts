import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoComponentComponent } from './two-component.component';

describe('TwoComponentComponent', () => {
  let component: TwoComponentComponent;
  let fixture: ComponentFixture<TwoComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TwoComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
