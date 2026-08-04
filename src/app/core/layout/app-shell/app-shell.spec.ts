import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { routes } from '../../../app.routes';
import { AppShell } from './app-shell';

describe('AppShell', () => {
  let fixture: ComponentFixture<AppShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShell],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShell);
  });

  it('renders the brand and primary navigation links', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('NewsTrust');
    expect(text).toContain('Análise');
    expect(text).toContain('Rede de Confiança');
  });
});
