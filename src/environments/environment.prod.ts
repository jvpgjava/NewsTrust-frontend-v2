export const environment = {
  production: true,
  // Em producao o frontend e servido como arquivos estaticos pelo mesmo Nginx que
  // faz proxy reverso para o backend em /api (ver nginx.conf) - caminho relativo,
  // sem host/porta hardcoded.
  apiBaseUrl: '/api',
};
