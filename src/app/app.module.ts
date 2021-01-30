import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';
import { RegisterComponent } from './register/register.component';
import { MenuComponent } from './menu/menu.component';
import { QuizComponent } from './quiz/quiz.component';
import { RouterModule } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CorrectionsComponent } from './corrections/corrections.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ControlComponent } from './control/control.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { RegistrationsComponent } from './registrations/registrations.component';
import { StorageService } from './services/storage.service';


@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    HomeComponent,
    ScoreboardComponent,
    RegisterComponent,
    MenuComponent,
    QuizComponent,
    CorrectionsComponent,
    ControlComponent,
    RegistrationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule, 
    ReactiveFormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule, 
    MatSlideToggleModule,
    NgxQRCodeModule,
    AngularFireStorageModule
      ],
  providers: [DatabaseService, StorageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
