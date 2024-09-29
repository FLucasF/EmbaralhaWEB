import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

interface Word {
  word: string;
  image: string;
}

interface Context {
  name: string;
  words: Word[];
}

@Component({
  selector: 'app-word-lists',
  templateUrl: './word-lists.component.html',
  styleUrls: ['./word-lists.component.scss']
})
export class WordListsComponent implements OnInit {
  contextName: string | null = '';
  contextWords: Word[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.contextName = params.get('contextName');
      this.loadWordsData();
    });
  }

  loadWordsData(): void {
    this.http.get<{ contexts: Context[] }>('assets/words.json').subscribe(data => {
      const selectedContext = data.contexts.find(context => context.name === this.contextName);
      if (selectedContext) {
        this.contextWords = selectedContext.words;
      }
    });
  }
}
