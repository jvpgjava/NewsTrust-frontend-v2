import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPage } from './team-page';

describe('TeamPage', () => {
  let fixture: ComponentFixture<TeamPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamPage],
    }).compileComponents();

    fixture = TestBed.createComponent(TeamPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows João and Arthur with a link to their Lattes profile', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('João Vitor Prestes Grando');
    expect(text).toContain('Arthur Marques de Oliveira');

    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a[href*="lattes.cnpq.br"]'));
    expect(links.length).toBe(2);
  });
});
