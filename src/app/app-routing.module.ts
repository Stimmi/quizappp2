import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { QuizComponent } from './quiz/quiz.component';
import { RegisterComponent } from './register/register.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/registreer', pathMatch: 'full' },
  { path: 'registreer', component: RegisterComponent },
  { path: 'start', component: HomeComponent },
  { path: 'score', component: ScoreboardComponent },
  { path: 'schifting', component: GameComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '**', component: RegisterComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
