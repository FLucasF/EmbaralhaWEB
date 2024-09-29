import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { WordScrambleComponent } from './word-scramble/word-scramble.component';
import { ContextComponent } from './context/context.component';
import { WordListsComponent } from './word-lists/word-lists.component'; // Adicione se necessário
import { AboutComponent } from './about/about.component'; // Importa o componente About

const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' }, // Redireciona para o menu principal
  { path: 'menu', component: HomeScreenComponent },      // Menu principal
  { path: 'context', component: ContextComponent },      // Página de contextos
  { path: 'game', component: WordScrambleComponent },    // Página do jogo com o contexto
  { path: 'word-lists', component: WordListsComponent }, // Página de visualização das palavras no contexto
  { path: 'about', component: AboutComponent },         // Rota para o componente About
  { path: '**', redirectTo: '/menu' }                    // Redireciona rotas inválidas para o menu principal
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
