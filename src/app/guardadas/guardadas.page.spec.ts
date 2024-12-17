import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuardadasPage } from './guardadas.page';

describe('GuardadasPage', () => {
  let component: GuardadasPage;
  let fixture: ComponentFixture<GuardadasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GuardadasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
