import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Component } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';

import {NgbModule, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import {AgmCoreModule, GoogleMapsAPIWrapper} from '@agm/core';

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
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { CheckTicketPageComponent } from './pages/check-ticket-page/check-ticket-page.component';
import { ShowAdminsComponent } from './show-admins/show-admins.component';
import { UserAdminPageComponent } from './pages/user-admin-page/user-admin-page.component';
import { AccountRequestsComponent } from './account-requests/account-requests.component';
import { ReportsComponent } from './reports/reports.component';
import { TokenInterceptorService } from './services/token-interceptor-service/token-interceptor.service';
import { DownloadFileService } from './services/download-file/download-file.service';
import { PriceService } from './services/price/price.service';
import { ChangeAccountTypeComponent } from './change-account-type/change-account-type.component';
import { ChangeAccountTypeService } from './services/change-account-type/change-account-type.service';
import { PositionsOfVehiclesComponent } from './positions-of-vehicles/positions-of-vehicles.component';
import { BuyTicketComponent } from './buy-ticket/buy-ticket.component';
import { ShowTicketsComponent } from './show-tickets/show-tickets.component';
import { AddAdminComponent } from './add-admin/add-admin.component';
import { AddPriceTicketComponent } from './add-price-ticket/add-price-ticket.component';
import { PriceticketUdComponent, EditDialogComponent } from './priceticket-ud/priceticket-ud.component';
import {MatButtonModule, MatCheckboxModule, MatDialogModule,
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonToggleModule,
  MatCardModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,



} from '@angular/material';
import { MenuPriceticketComponent } from './pages/menu-priceticket/menu-priceticket.component';
import { CanActivateUserGuard } from './services/guard/can-activate-user.guard';
//import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { GeneralReportComponent } from './general-report/general-report.component';
import { DailyGeneralReportComponent } from './daily-general-report/daily-general-report.component';
import { ShowRequestsComponent } from './show-requests/show-requests.component';
import { TransportAdminMapComponent } from './pages/transport-admin-page/transport-admin-map/transport-admin-map.component';
import { ModalDialogComponent } from './modal-dialog/modal-dialog.component';
import { NgbDateCustomParserFormatter } from './buy-ticket/ngb-date-custom-parser-formatter/ngb-date-custom-parser-formatter';
import { ImageDialogComponent } from './image-dialog/image-dialog.component';
import { TransportAdminLineMapComponent } from './pages/transport-admin-page/transport-admin-line-map/transport-admin-line-map.component';
import { AddLineComponent } from './pages/transport-admin-page/line-page/add-line/add-line.component';
import { UpdateLineComponent } from './pages/transport-admin-page/line-page/update-line/update-line.component';
import { UpdateScheduleComponent } from './pages/transport-admin-page/schedule-page/update-schedule/update-schedule.component';
import { AddScheduleComponent } from './pages/transport-admin-page/schedule-page/add-schedule/add-schedule.component';
import { TimetableComponent } from './pages/transport-admin-page/schedule-page/timetable/timetable.component';
import { TimeComponent } from './pages/transport-admin-page/schedule-page/time/time.component';
import { AddTimeComponent } from './pages/transport-admin-page/schedule-page/add-time/add-time.component';
import { ScheduleService} from './services/schedule/schedule.service';


const appRoutes: Routes = [
  { path: 'home-page', component: HomePageComponent },
  { path: 'transport', component: TransportAdminPageComponent, canActivate: [CanActivateUserGuard],
    children: [
      { path: 'zone', component: ZonePageComponent},
      { path: 'add_zone', component: AddZoneComponent},
      { path: 'update_zone/:id', component: UpdateZoneComponent},
      { path: 'line', component: LinePageComponent},
      { path: 'add_line', component: AddLineComponent},
      { path: 'stop', component: StopPageComponent},
      { path: 'schedule', component: SchedulePageComponent},
      { path: 'update_schedule/:name', component: UpdateScheduleComponent},
      { path: 'add_schedule/:name', component: AddScheduleComponent},
      { path: 'priceticket', component: MenuPriceticketComponent}
    ]
  },
  { path: 'login', component: LoginPageComponent},
  { path: 'register', component: RegisterPageComponent},
  { path: 'checkticket', component: CheckTicketPageComponent, canActivate: [CanActivateUserGuard]},
  { path: 'passenger', component: PassengerPageComponent, canActivate: [CanActivateUserGuard]},
  { path: 'user-admin', component: UserAdminPageComponent, canActivate: [CanActivateUserGuard]},
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
    ShowTimesComponent,
    RegisterPageComponent,
    CheckTicketPageComponent,
    ShowAdminsComponent,
    BuyTicketComponent,
    ShowTicketsComponent,
    ChangeAccountTypeComponent,
    PositionsOfVehiclesComponent,
    UserAdminPageComponent,
    AccountRequestsComponent,
    ReportsComponent,
    AddAdminComponent,
    AddPriceTicketComponent,
    PriceticketUdComponent,
    EditDialogComponent,
    MenuPriceticketComponent,
    GeneralReportComponent,
    DailyGeneralReportComponent,
    ShowRequestsComponent,
    TransportAdminMapComponent,
    ModalDialogComponent,
    ImageDialogComponent,
    TransportAdminMapComponent,
    TransportAdminLineMapComponent,
    AddLineComponent,
    UpdateLineComponent,
    UpdateScheduleComponent,
    AddScheduleComponent,
    TimetableComponent,
    TimeComponent,
    AddTimeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    MatInputModule,
    MatDialogModule,
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: true } // <-- debugging purposes only
    ),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCncyqJ42IAu6XewfdwvXyVmCOUyr30gWI'
    }),
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot(), // ToastrModule added
    NgbModule,
    NgxDatatableModule,
    ReactiveFormsModule
  ],
  providers: [
    GenericService,
    GoogleMapsAPIWrapper,
    { provide: 'BASE_API_URL', useValue: 'http://localhost:8080/api' },  // environment.apiUrl
    CheckSliderService,
    AuthenticationService,
    JwtUtilsService,
    ZoneService,
    ScheduleService,
    TimesService,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true },
    DownloadFileService,
    CanActivateUserGuard,
    PriceService,
    ChangeAccountTypeService,
    {provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter}
  ],
  bootstrap: [AppComponent],
  entryComponents: [EditDialogComponent]
})
export class AppModule { }
