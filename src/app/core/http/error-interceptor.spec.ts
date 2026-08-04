import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';

import { ApiError } from './api-error.model';
import { errorInterceptor } from './error-interceptor';

describe('errorInterceptor', () => {
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(withInterceptors([errorInterceptor])), provideHttpClientTesting()],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpTesting.verify());

  it('maps a ProblemDetail error body into a user-safe ApiError', async () => {
    const resultPromise = firstValueFrom(httpClient.get('/api/whatever')).catch((error: ApiError) => error);

    httpTesting.expectOne('/api/whatever').flush(
      { title: 'Requisição inválida', detail: 'title não pode ser vazio' },
      { status: 400, statusText: 'Bad Request' },
    );

    const result = (await resultPromise) as ApiError;
    expect(result.status).toBe(400);
    expect(result.title).toBe('Requisição inválida');
    expect(result.userMessage).toBe('title não pode ser vazio');
  });

  it('maps a network failure (status 0) into a friendly connection error', async () => {
    const resultPromise = firstValueFrom(httpClient.get('/api/whatever')).catch((error: ApiError) => error);

    httpTesting.expectOne('/api/whatever').error(new ProgressEvent('error'), { status: 0 });

    const result = (await resultPromise) as ApiError;
    expect(result.status).toBe(0);
    expect(result.userMessage).toContain('Não foi possível conectar');
  });
});
