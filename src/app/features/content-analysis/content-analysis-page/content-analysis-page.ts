import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { ApiError } from '../../../core/http/api-error.model';
import { ErrorBanner } from '../../../shared/ui/error-banner/error-banner';
import { LoadingSpinner } from '../../../shared/ui/loading-spinner/loading-spinner';
import { Icon } from '../../../shared/ui/icon/icon';
import { ContentAnalysisApi } from '../content-analysis-api';
import { NewsContentAnalysisResponse } from '../content-analysis.model';
import { ContentAnalysisResult } from '../content-analysis-result/content-analysis-result';

@Component({
  selector: 'app-content-analysis-page',
  imports: [ReactiveFormsModule, LoadingSpinner, ErrorBanner, ContentAnalysisResult, Icon],
  templateUrl: './content-analysis-page.html',
  styleUrl: './content-analysis-page.css',
})
export class ContentAnalysisPage {
  private readonly api = inject(ContentAnalysisApi);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required]],
    content: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected readonly submitting = signal(false);
  protected readonly result = signal<NewsContentAnalysisResponse | null>(null);
  protected readonly errorMessage = signal<string | null>(null);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.errorMessage.set(null);
    this.result.set(null);

    const { title, content } = this.form.getRawValue();
    this.api.analyze({ title, content }).subscribe({
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
    this.form.reset({ title: '', content: '' });
    this.result.set(null);
    this.errorMessage.set(null);
  }
}
