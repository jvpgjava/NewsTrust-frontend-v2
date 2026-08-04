import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorBanner } from './error-banner';

describe('ErrorBanner', () => {
  let fixture: ComponentFixture<ErrorBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorBanner);
    fixture.componentRef.setInput('message', 'Algo deu errado.');
  });

  it('displays the given message', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.nativeElement.textContent).toContain('Algo deu errado.');
  });

  it('emits retry when the button is clicked', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    let retried = false;
    fixture.componentInstance.retry.subscribe(() => (retried = true));

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    button.click();

    expect(retried).toBe(true);
  });
});
