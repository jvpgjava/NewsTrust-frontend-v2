import { Component, computed, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { Icon } from '../../../shared/ui/icon/icon';

const TRUSTED_DOMAINS = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'protonmail.com',
  'tutanota.com',
  'zoho.com',
  'yandex.com',
  'mail.com',
  'gmx.com',
  'terra.com.br',
  'bol.com.br',
  'uol.com.br',
  'ig.com.br',
  'globo.com',
  'r7.com',
  'folha.com.br',
  'estadao.com.br',
  'g1.com.br',
];

const MAIN_PROVIDERS = ['gmail.com', 'yahoo.com', 'outlook.com'];

/**
 * Formulario de contato sem backend ainda (nao ha endpoint /api/contact no
 * AnalysisController). Fica funcional no lado do cliente (validacao +
 * confirmacao visual) mas nao envia nada de verdade - evita disparar uma
 * requisicao para um endpoint que sempre retornaria 404.
 */
@Component({
  selector: 'app-contact-page',
  imports: [ReactiveFormsModule, Icon],
  templateUrl: './contact-page.html',
  styleUrl: './contact-page.css',
})
export class ContactPage {
  private readonly formBuilder = new FormBuilder();

  protected readonly form = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required]],
  });

  protected readonly submitted = signal(false);

  protected readonly emailDomainSuggestions = computed(() => {
    const email = this.form.controls.email.value;
    const domain = email.split('@')[1]?.toLowerCase() ?? '';
    const suggestions = [...MAIN_PROVIDERS];

    for (const candidate of TRUSTED_DOMAINS) {
      if (domain && (candidate.includes(domain) || domain.includes(candidate)) && !suggestions.includes(candidate)) {
        suggestions.push(candidate);
      }
    }

    return suggestions.slice(0, 6);
  });

  protected get emailDomainInvalid(): boolean {
    const email = this.form.controls.email.value;
    const domain = email.split('@')[1]?.toLowerCase();
    return !!domain && !TRUSTED_DOMAINS.includes(domain);
  }

  protected applySuggestedDomain(domain: string): void {
    const prefix = this.form.controls.email.value.split('@')[0] ?? '';
    this.form.controls.email.setValue(`${prefix}@${domain}`);
  }

  protected isMainProvider(domain: string): boolean {
    return MAIN_PROVIDERS.includes(domain);
  }

  protected submit(): void {
    if (this.form.invalid || this.emailDomainInvalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitted.set(true);
    this.form.reset({ name: '', email: '', message: '' });
  }

  protected closeSuccess(): void {
    this.submitted.set(false);
  }
}
