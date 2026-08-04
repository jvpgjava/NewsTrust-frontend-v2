import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPage } from './contact-page';

describe('ContactPage', () => {
  let fixture: ComponentFixture<ContactPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactPage],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactPage);
    fixture.detectChanges();
  });

  function fill(name: string, email: string, message: string): void {
    setValue('#contact-name', name);
    setValue('#contact-email', email);
    setValue('#contact-message', message);
  }

  function setValue(selector: string, value: string): void {
    const element: HTMLInputElement | HTMLTextAreaElement = fixture.nativeElement.querySelector(selector);
    element.value = value;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitForm(): void {
    const form: HTMLFormElement = fixture.nativeElement.querySelector('form');
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
  }

  it('does not show the success panel when required fields are empty', () => {
    submitForm();

    expect(fixture.nativeElement.textContent).not.toContain('Obrigado pelo seu contato!');
    expect(fixture.nativeElement.textContent).toContain('Este campo é obrigatório');
  });

  it('rejects an email from an untrusted domain and suggests trusted alternatives', () => {
    fill('Ana', 'ana@dominio-desconhecido.com', 'Uma mensagem qualquer.');
    submitForm();

    expect(fixture.nativeElement.textContent).not.toContain('Obrigado pelo seu contato!');
    expect(fixture.nativeElement.textContent).toContain('gmail.com');
  });

  it('shows the success panel and resets the form for a trusted email domain', () => {
    fill('Ana', 'ana@gmail.com', 'Uma mensagem qualquer.');
    submitForm();

    expect(fixture.nativeElement.textContent).toContain('Obrigado pelo seu contato!');
    const nameInput: HTMLInputElement = fixture.nativeElement.querySelector('#contact-name');
    expect(nameInput.value).toBe('');
  });
});
