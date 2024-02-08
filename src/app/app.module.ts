import { NgModule, effect } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireStorageModule} from '@angular/fire/compat/storage';
import {AngularFirestoreModule} from '@angular/fire/compat/firestore';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import {provideFirebaseApp, initializeApp} from '@angular/fire/app';
import {getFirestore, provideFirestore} from '@angular/fire/firestore';
import {getAuth, provideAuth} from '@angular/fire/auth';
import {getStorage,provideStorage} from '@angular/fire/storage'


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '@src/environments/environment';
import { IndicatorsModule, SpinnerModule } from './shared/indicators';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { PopupsModule } from './shared/popups';

import { NotificationModule } from './services';
import {MatSidenavModule } from '@angular/material/sidenav';
import {MatToolbarModule } from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { HeaderComponent } from './components/header/header.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MenuListComponent } from './components/menu-list/menu-list.component';
import {MatListModule} from '@angular/material/list';
import { ControlsModule, GetEliminarModule } from './shared';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {reducers,effects} from './store'
import {HttpClientModule} from '@angular/common/http'
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import {NgApexchartsModule} from 'ng-apexcharts';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const StoreDevTools = !environment.production ? StoreDevtoolsModule.instrument({maxAge:50}) : [];
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuListComponent
  ],
  imports: [
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,

    provideFirebaseApp(() => initializeApp(environment.firebase.Config)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAuth(() => getAuth()),

    AngularFireModule.initializeApp(environment.firebase.Config),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    IndicatorsModule,
    BrowserAnimationsModule,
    PopupsModule,
    NotificationModule.forRoot(),
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    ControlsModule,
    StoreDevTools,
    StoreModule.forRoot(reducers,{
      runtimeChecks:{
        strictActionImmutability: true,
        strictStateImmutability: true
      }
    }),
    EffectsModule.forRoot(effects),
    HttpClientModule,
    SpinnerModule,
    MatExpansionModule,
    MatMenuModule,
    NgApexchartsModule,
    MatGridListModule,
    MatCardModule, MatDividerModule,MatProgressBarModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
