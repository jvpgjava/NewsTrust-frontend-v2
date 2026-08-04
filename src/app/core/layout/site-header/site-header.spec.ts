import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { routes } from '../../../app.routes';
import { SiteHeader } from './site-header';

describe('SiteHeader', () => {
  let fixture: ComponentFixture<SiteHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteHeader);
  });

  it('always renders the brand and every menu item, in both the desktop nav and the mobile panel', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('NewsTrust');
    expect(text).toContain('Dashboard');
    expect(text).toContain('Análise de Notícias');
    expect(text).toContain('Rede de Confiança');
    expect(text).toContain('Sobre o Sistema');
    expect(text).toContain('Equipe');
    expect(text).toContain('Fale Conosco');
  });

  it('toggles the open state and aria-expanded when the mobile menu button is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button[aria-label="Menu"]');
    expect(button.getAttribute('aria-expanded')).toBe('false');

    button.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(button.getAttribute('aria-expanded')).toBe('true');
  });
});
