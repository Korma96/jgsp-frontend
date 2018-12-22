import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

import { RouterModule, Routes } from '@angular/router';
import { TransportAdminNavBarComponent } from './pages/transport-admin-page/transport-admin-nav-bar/transport-admin-nav-bar.component';
import { TransportAdminPageComponent } from './pages/transport-admin-page/transport-admin-page.component';
import { ZonePageComponent } from './pages/transport-admin-page/zone-page/zone-page.component';
import { LinePageComponent } from './pages/transport-admin-page/line-page/line-page.component';
import { StopPageComponent } from './pages/transport-admin-page/stop-page/stop-page.component';
import {SchedulePageComponent} from './pages/transport-admin-page/schedule-page/schedule-page.component';
import {ZoneService} from './services/transport-admin-services/zone-service/zone.service';
import { ZoneComponent } from './pages/transport-admin-page/zone-page/zone/zone.component';
import {InterceptorService} from './services/shared-services/interceptor.service';

const appRoutes: Routes = [
  { path: 'home-page', component: HomePageComponent },
  { path: 'transport', component: TransportAdminPageComponent, children: [
      { path: 'zone', component: ZonePageComponent},
      { path: 'line', component: LinePageComponent},
      { path: 'stop', component: StopPageComponent},
      { path: 'schedule', component: SchedulePageComponent}]},
  // { path: 'entry/:index',      component: BlogEntryPageComponent },
  { path: '', // localhost:4200 redirect to localhost:4200/home-page
    redirectTo: '/home-page',
    pathMatch: 'full'
  },
  { path: '**', component: NotFoundPageComponent } // za sve ostale path-ove izbaci page not found
];

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    NotFoundPageComponent,
    HomePageComponent,
    TransportAdminNavBarComponent,
    TransportAdminPageComponent,
    ZonePageComponent,
    LinePageComponent,
    StopPageComponent,
    SchedulePageComponent,
    ZoneComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    ZoneService],
  bootstrap: [AppComponent]
})
export class AppModule { }
