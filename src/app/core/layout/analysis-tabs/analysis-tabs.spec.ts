import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { routes } from '../../../app.routes';
import { AnalysisTabs } from './analysis-tabs';

describe('AnalysisTabs', () => {
  let fixture: ComponentFixture<AnalysisTabs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalysisTabs],
      providers: [provideRouter(routes)],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalysisTabs);
  });

  it('renders both analysis tabs', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    const text = fixture.nativeElement.textContent as string;
    expect(text).toContain('Análise de Conteúdo');
    expect(text).toContain('Análise de Fonte');
  });
});
