// import { enableProdMode } from '@angular/core';
// import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

// import { AppModule } from './app/app.module';
// import { environment } from './environments/environment';

// if (environment.production) {
//   enableProdMode();
// }

// platformBrowserDynamic().bootstrapModule(AppModule, {
//   useJit: true,
//   preserveWhitespaces: true
// })
//   .catch(err => console.log(err));

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// ────────────────────────────────────────────────
// ADD THESE IMPORTS AND REGISTRATION FOR AG GRID
import { ModuleRegistry } from 'ag-grid-community';
import { AllCommunityModule } from 'ag-grid-community';

// Register all Community features (sorting, filtering, resizing, CSV export, etc.)
ModuleRegistry.registerModules([AllCommunityModule]);

// If you later need Enterprise features (row grouping, Excel export, server-side model, etc.):
// import { AllEnterpriseModule } from 'ag-grid-enterprise';
// ModuleRegistry.registerModules([AllEnterpriseModule]);
// ────────────────────────────────────────────────

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, {
  useJit: true,
  preserveWhitespaces: true
})
  .catch(err => console.log(err));