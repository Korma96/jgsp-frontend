import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { NotFoundPageComponent } from './pages/not-found-page/not-found-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { PassengerPageComponent } from './pages/passenger-page/passenger-page.component';
import { TransportAdminNavBarComponent } from './pages/transport-admin-page/transport-admin-nav-bar/transport-admin-nav-bar.component';
import { TransportAdminPageComponent } from './pages/transport-admin-page/transport-admin-page.component';
import { ZonePageComponent } from './pages/transport-admin-page/zone-page/zone-page.component';
import { LinePageComponent } from './pages/transport-admin-page/line-page/line-page.component';
import { StopPageComponent } from './pages/transport-admin-page/stop-page/stop-page.component';
import {SchedulePageComponent} from './pages/transport-admin-page/schedule-page/schedule-page.component';

import { RouterModule, Routes } from '@angular/router';
import { GenericService } from './services/generic/generic.service';
import { MyGoogleMapComponent } from './my-google-map/my-google-map.component';
import { DirectionsMapComponent } from './directions-map/directions-map.component';
import { CheckSliderComponent } from './check-slider/check-slider.component';
import { HttpClientModule } from '@angular/common/http';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationService } from './services/authentication.service';
import { JwtUtilsService } from './services/jwt-utils.service';


const appRoutes: Routes = [
  { path: 'home-page', component: HomePageComponent },
  { path: 'transport', component: TransportAdminPageComponent, 
    children: [
      { path: 'zone', component: ZonePageComponent},
      { path: 'line', component: LinePageComponent},
      { path: 'stop', component: StopPageComponent},
      { path: 'schedule', component: SchedulePageComponent}
    ]
  },
  { path: 'login', component: LoginPageComponent},
  { path: 'passenger', component: PassengerPageComponent},
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
    PassengerPageComponent,
    TransportAdminNavBarComponent,
    TransportAdminPageComponent,
    ZonePageComponent,
    LinePageComponent,
    StopPageComponent,
    SchedulePageComponent,
    MyGoogleMapComponent,
    DirectionsMapComponent,
    CheckSliderComponent,
    LoginPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCncyqJ42IAu6XewfdwvXyVmCOUyr30gWI'
    }),
    HttpClientModule
  ],
  providers: [
    GenericService,
    AuthenticationService,
    JwtUtilsService,
    { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' }  // environment.apiUrl
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
