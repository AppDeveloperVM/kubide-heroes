import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { HomeComponent } from './pages/home/home.component';
import { TeamListComponent } from './components/team-list/team-list.component';
import { CharacterItemComponent } from './components/character-item/character-item.component';
import { HeroDetailsComponent } from './components/hero-details/hero-details.component';
import { HeroCollectionComponent } from './components/hero-collection/hero-collection.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TeamListComponent,
    CharacterItemComponent,
    HeroDetailsComponent,
    HeroCollectionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    IonicModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
