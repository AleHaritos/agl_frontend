import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporEstoqueComponent } from './repor-estoque.component';

describe('ReporEstoqueComponent', () => {
  let component: ReporEstoqueComponent;
  let fixture: ComponentFixture<ReporEstoqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporEstoqueComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporEstoqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
