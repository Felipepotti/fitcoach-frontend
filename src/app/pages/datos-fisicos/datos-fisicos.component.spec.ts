import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosFisicosComponent } from './datos-fisicos.component';

describe('DatosFisicosComponent', () => {
  let component: DatosFisicosComponent;
  let fixture: ComponentFixture<DatosFisicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatosFisicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatosFisicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
