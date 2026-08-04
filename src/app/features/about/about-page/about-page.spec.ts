import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutPage } from './about-page';

describe('AboutPage', () => {
  let fixture: ComponentFixture<AboutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutPage],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutPage);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('shows the mission statement and the four score factors', () => {
    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Nossa Missão');
    expect(text).toContain('Reputação da Fonte (R)');
    expect(text).toContain('Consistência Textual (T)');
    expect(text).toContain('Verificação Cruzada (V)');
    expect(text).toContain('Padrão de Disseminação (D)');
  });
});
