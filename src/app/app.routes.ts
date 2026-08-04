import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'analysis/content', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard-page/dashboard-page').then((m) => m.DashboardPage),
  },
  {
    path: 'analysis',
    loadComponent: () => import('./core/layout/analysis-tabs/analysis-tabs').then((m) => m.AnalysisTabs),
    children: [
      { path: '', redirectTo: 'content', pathMatch: 'full' },
      {
        path: 'content',
        loadComponent: () =>
          import('./features/content-analysis/content-analysis-page/content-analysis-page').then(
            (m) => m.ContentAnalysisPage,
          ),
      },
      {
        path: 'source',
        loadComponent: () =>
          import('./features/source-analysis/source-analysis-page/source-analysis-page').then(
            (m) => m.SourceAnalysisPage,
          ),
      },
    ],
  },
  {
    path: 'trust-graph',
    loadComponent: () =>
      import('./features/trust-graph/trust-graph-page/trust-graph-page').then((m) => m.TrustGraphPage),
  },
  {
    path: 'about',
    loadComponent: () => import('./features/about/about-page/about-page').then((m) => m.AboutPage),
  },
  {
    path: 'contact',
    loadComponent: () => import('./features/contact/contact-page/contact-page').then((m) => m.ContactPage),
  },
  { path: '**', redirectTo: 'analysis/content' },
];
