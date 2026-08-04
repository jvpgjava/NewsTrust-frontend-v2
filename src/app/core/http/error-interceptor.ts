import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { ApiError } from './api-error.model';

/**
 * Normaliza qualquer erro HTTP em um {@link ApiError} com uma mensagem segura
 * para exibir ao usuario, antes de repropagar para quem chamou o service. O
 * backend retorna ProblemDetail (RFC 7807: title/detail/status) em erros -
 * ver GlobalExceptionHandler no backend.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(catchError((error: unknown) => throwError(() => toApiError(error))));

function toApiError(error: unknown): ApiError {
  if (!(error instanceof HttpErrorResponse)) {
    return {
      status: -1,
      title: 'Erro inesperado',
      detail: String(error),
      userMessage: 'Ocorreu um erro inesperado. Tente novamente.',
    };
  }

  if (error.status === 0) {
    return {
      status: 0,
      title: 'Sem conexão',
      detail: 'Não foi possível conectar ao servidor.',
      userMessage: 'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
    };
  }

  const problemDetail = error.error as { title?: string; detail?: string } | null;
  return {
    status: error.status,
    title: problemDetail?.title ?? 'Erro',
    detail: problemDetail?.detail ?? error.message,
    userMessage: problemDetail?.detail || 'Ocorreu um erro inesperado. Tente novamente.',
  };
}
