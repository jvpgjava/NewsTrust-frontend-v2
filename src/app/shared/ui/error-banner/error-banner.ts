import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-error-banner',
  imports: [],
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
})
export class ErrorBanner {
  readonly message = input.required<string>();
  readonly retry = output<void>();
}
