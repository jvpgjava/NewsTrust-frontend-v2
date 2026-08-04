/**
 * Erro normalizado a partir de qualquer falha HTTP - inclui o caso em que o
 * backend responde com um ProblemDetail (RFC 7807), o caso de falha de rede
 * (status 0) e qualquer outro erro inesperado. `userMessage` e sempre seguro
 * para exibir diretamente na UI.
 */
export interface ApiError {
  status: number;
  title: string;
  detail: string;
  userMessage: string;
}
