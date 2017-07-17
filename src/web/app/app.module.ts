import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';

import { AppMaterialModule } from './app-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BuildComponent } from './build/build.component';
import { BuildsComponent } from './builds/builds.component';
import { firebaseAppConfig } from './firebase.init';
import { BuildsTableComponent } from './shared/components/builds-table/builds-table.component';
import { EnumValuePipe } from './shared/pipes/enum-value.pipe';
import { BuildsService } from './shared/services/builds.service';

@NgModule({
  declarations: [
    AppComponent,
    BuildComponent,
    BuildsComponent,
    BuildsTableComponent,
    EnumValuePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(firebaseAppConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  providers: [
    BuildsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }