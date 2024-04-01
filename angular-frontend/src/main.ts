/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
