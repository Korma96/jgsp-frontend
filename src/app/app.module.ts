import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

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
import {ZoneService} from './services/transport-admin-services/zone-service/zone.service';
import { ZoneComponent } from './pages/transport-admin-page/zone-page/zone/zone.component';
import {InterceptorService} from './services/shared-services/interceptor.service';

import { RouterModule, Routes } from '@angular/router';
import { GenericService } from './services/generic/generic.service';
import { DirectionsMapComponent } from './directions-map/directions-map.component';
import { CheckSliderComponent } from './check-slider/check-slider.component';
import { CheckDirective } from './directives/check.directive';
import { CheckSliderService } from './services/check-slider/check-slider.service';
import { ShowLinesComponent } from './show-lines/show-lines.component';
import { ShowScheduleComponent } from './show-schedule/show-schedule.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { AuthenticationService } from './services/authentication.service';
import { JwtUtilsService } from './services/jwt-utils.service';
import { AddZoneComponent } from './pages/transport-admin-page/zone-page/add-zone/add-zone.component';
import { LineComponent } from './pages/transport-admin-page/line-page/line/line.component';
import { CompleteLineComponent } from './pages/transport-admin-page/line-page/complete-line/complete-line.component';
import { UpdateZoneComponent } from './pages/transport-admin-page/zone-page/update-zone/update-zone.component';
import { TimesService } from './services/times.service';
import { ShowTimesComponent } from './show-times/show-times.component';


const appRoutes: Routes = [
  { path: 'home-page', component: HomePageComponent },
  { path: 'transport', component: TransportAdminPageComponent, 
    children: [
      { path: 'zone', component: ZonePageComponent},
      { path: 'add_zone', component: AddZoneComponent},
      { path: 'update_zone/:id', component: UpdateZoneComponent},
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
    DirectionsMapComponent,
    CheckDirective,
    ShowLinesComponent,
    ShowScheduleComponent,
    LoginPageComponent,
    CheckSliderComponent,
    SchedulePageComponent,
    ZoneComponent,
    AddZoneComponent,
    LineComponent,
    CompleteLineComponent,
    UpdateZoneComponent,
    ShowTimesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCncyqJ42IAu6XewfdwvXyVmCOUyr30gWI'
    }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot() // ToastrModule added
  ],
  providers: [
    GenericService,
    { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },  // environment.apiUrl
    CheckSliderService,
    AuthenticationService,
    JwtUtilsService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorService,
      multi: true
    },
    ZoneService,
    TimesService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
