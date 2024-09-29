import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router'; // Importa o Router para redirecionamento
import { Observable } from 'rxjs';

interface Context {
  name: string;
  context_image: string; // Adiciona a propriedade context_image
  words: Array<{ word: string; image: string }>;
}


@Component({
  selector: 'app-context',
  templateUrl: './context.component.html',
  styleUrls: ['./context.component.scss']
})
export class ContextComponent implements OnInit {
  contexts: Context[] = [];

  constructor(private http: HttpClient, private router: Router) {} // Adiciona o Router no construtor

  ngOnInit(): void {
    this.loadContexts().subscribe((data: { contexts: Context[] }) => {
      this.contexts = data.contexts;
    });
  }

  // Função para carregar os contextos do arquivo JSON
  loadContexts(): Observable<{ contexts: Context[] }> {
    return this.http.get<{ contexts: Context[] }>('assets/words.json');
  }

  // Função para redirecionar para o jogo com o contexto escolhido
  playGame(contextName: string): void {
    this.router.navigate(['/game', { contextName }]); // Redireciona para a rota do jogo com o nome do contexto
  }

  // Função para redirecionar para a visualização do contexto
  viewContext(contextName: string): void {
    this.router.navigate(['/word-lists', { contextName }]); // Redireciona para a página de visualização do contexto
  }
}
