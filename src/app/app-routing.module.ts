import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ControlComponent } from './control/control.component';
import { CorrectionsComponent } from './corrections/corrections.component';
import { GameComponent } from './game/game.component';
import { HomeComponent } from './home/home.component';
import { AdminGuard, LoginGuard } from './quiz-guard.guard';
import { QuizComponent } from './quiz/quiz.component';
import { RegisterComponent } from './register/register.component';
import { ScoreboardComponent } from './scoreboard/scoreboard.component';

const routes: Routes = [
  { path: '', redirectTo: '/registreer', pathMatch: 'full' },
  { path: 'registreer', component: RegisterComponent },
  { path: 'start', component: HomeComponent, canActivate:[LoginGuard] },
  { path: 'score', component: ScoreboardComponent, canActivate:[LoginGuard] },
  { path: 'schifting', component: GameComponent, canActivate:[LoginGuard] },
  { path: 'quiz', component: QuizComponent, canActivate:[LoginGuard] },
  { path: 'verbeter', component: CorrectionsComponent, canActivate: [AdminGuard] },
  { path: 'controle', component: ControlComponent, canActivate: [AdminGuard] },
  { path: '**', component: RegisterComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
