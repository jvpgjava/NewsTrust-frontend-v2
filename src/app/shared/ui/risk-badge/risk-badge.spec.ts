import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskBadge } from './risk-badge';

describe('RiskBadge', () => {
  let fixture: ComponentFixture<RiskBadge>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiskBadge],
    }).compileComponents();

    fixture = TestBed.createComponent(RiskBadge);
  });

  it('shows the Portuguese label for each risk level', async () => {
    fixture.componentRef.setInput('riskLevel', 'LOW_RISK');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Baixo risco');

    fixture.componentRef.setInput('riskLevel', 'ATTENTION');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Atenção');

    fixture.componentRef.setInput('riskLevel', 'HIGH_RISK');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Alto risco');
  });
});
