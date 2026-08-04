import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiError } from '../../../core/http/api-error.model';
import { ErrorBanner } from '../../../shared/ui/error-banner/error-banner';
import { LoadingSpinner } from '../../../shared/ui/loading-spinner/loading-spinner';
import { Icon } from '../../../shared/ui/icon/icon';
import { SourceAnalysisApi } from '../source-analysis-api';
import { SourceAnalysisResponse } from '../source-analysis.model';
import { SourceAnalysisResult } from '../source-analysis-result/source-analysis-result';

const URL_PATTERN = /^https?:\/\/.+\..+/i;

@Component({
  selector: 'app-source-analysis-page',
  imports: [ReactiveFormsModule, LoadingSpinner, ErrorBanner, SourceAnalysisResult, Icon],
  templateUrl: './source-analysis-page.html',
  styleUrl: './source-analysis-page.css',
})
export class SourceAnalysisPage {
  private readonly api = inject(SourceAnalysisApi);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    url: ['', [Validators.required, Validators.pattern(URL_PATTERN)]],
  });

  protected readonly submitting = signal(false);
  protected readonly result = signal<SourceAnalysisResponse | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    const { url } = this.form.getRawValue();
    this.api.analyze({ url }).subscribe({
      next: (response) => {
        this.result.set(response);
        this.submitting.set(false);
      },
      error: (error: ApiError) => {
        this.errorMessage.set(error.userMessage);
        this.submitting.set(false);
      },
    });
  }

  protected clear(): void {
    this.form.reset({ url: '' });
    this.result.set(null);
    this.errorMessage.set(null);
  }
}
