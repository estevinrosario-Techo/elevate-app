import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { tabsRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(tabsRoutes, withHashLocation()),
    importProvidersFrom(IonicModule.forRoot({ mode: 'md' })),
  ]
};
