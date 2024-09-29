import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Para capturar o contexto selecionado
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface WordData {
  word: string;
  image: string;
}

interface Context {
  name: string;
  words: WordData[];
}

@Component({
  selector: 'app-word-scramble',
  templateUrl: './word-scramble.component.html',
  styleUrls: ['./word-scramble.component.scss']
})
export class WordScrambleComponent implements OnInit {
  @ViewChild('wordContainer', { static: true }) wordContainer!: ElementRef;
  @ViewChild('lettersContainer', { static: true }) lettersContainer!: ElementRef;
  @ViewChild('message', { static: true }) messageElement!: ElementRef;
  @ViewChild('imageContainer', { static: true }) imageContainer!: ElementRef; // Para exibir a imagem

  wordsData: WordData[] = [];
  currentIndex: number = 0;
  selectedWordsData: WordData[] = [];
  contextName: string | null = null;

  // Mapeamento para associar cada drop-box ao letter-box original
  dropToLetterMap: Map<HTMLElement, HTMLElement> = new Map();

  constructor(
    private renderer: Renderer2,
    private http: HttpClient,
    private route: ActivatedRoute // Para obter o contexto selecionado
  ) {}

  ngOnInit(): void {
    // Captura o nome do contexto a partir da URL
    this.route.paramMap.subscribe(params => {
      this.contextName = params.get('contextName');
      this.loadWordsData();
    });
  }

  // Carrega as palavras do arquivo JSON e filtra pelo contexto selecionado
  loadWordsData(): void {
    this.getWordsData().subscribe((data: { contexts: Context[] }) => {
      const selectedContext = data.contexts.find(
        (context: Context) => context.name === this.contextName
      );
      if (selectedContext) {
        this.wordsData = selectedContext.words;
        this.selectRandomWords();
        this.loadNextWord();
      }
    });
  }

  getWordsData(): Observable<{ contexts: Context[] }> {
    return this.http.get<{ contexts: Context[] }>('assets/words.json');
  }

  selectRandomWords(): void {
    const shuffledWords = this.wordsData.sort(() => 0.5 - Math.random());
    this.selectedWordsData = shuffledWords.slice(0, 5);
  }

  loadNextWord(): void {
    if (this.currentIndex >= this.selectedWordsData.length) {
      this.renderer.setProperty(this.messageElement.nativeElement, 'innerHTML', 'Parabéns! Você completou todas as palavras!');
      this.renderer.setStyle(this.messageElement.nativeElement, 'color', 'green');
      this.renderer.setStyle(this.messageElement.nativeElement, 'display', 'block');
      return;
    }

    const currentWordData = this.selectedWordsData[this.currentIndex];
    const currentWord = currentWordData.word;

    // Limpa os containers
    this.renderer.setProperty(this.wordContainer.nativeElement, 'innerHTML', '');
    this.renderer.setProperty(this.lettersContainer.nativeElement, 'innerHTML', '');
    this.renderer.setProperty(this.imageContainer.nativeElement, 'src', currentWordData.image); // Apenas altera a imagem

    // Criação das caixas de drop (drop-boxes)
    currentWord.split('').forEach((letter, index) => {
      const dropBox = this.renderer.createElement('div');
      this.renderer.addClass(dropBox, 'drop-box');
      this.renderer.setProperty(dropBox, 'id', `drop-box-${index}`); // Adiciona um ID único a cada drop-box
      this.renderer.setProperty(dropBox, 'innerHTML', '?');
      this.renderer.listen(dropBox, 'drop', (ev) => this.drop(ev));
      this.renderer.listen(dropBox, 'dragover', (ev) => this.allowDrop(ev));
      this.renderer.appendChild(this.wordContainer.nativeElement, dropBox);
    });

    this.shuffleLetters(currentWord);
  }

  shuffleLetters(word: string): void {
    const shuffledLetters = word.split('').sort(() => 0.5 - Math.random());

    // Garante que o container esteja centralizado após embaralhar as letras
    this.renderer.setProperty(this.lettersContainer.nativeElement, 'innerHTML', '');

    shuffledLetters.forEach((letter, index) => {
      const letterBox = this.renderer.createElement('div');
      this.renderer.addClass(letterBox, 'letter-box');
      this.renderer.setProperty(letterBox, 'draggable', true);
      this.renderer.setProperty(letterBox, 'id', `letter-${index}-${letter}`); // Adiciona um ID único a cada letra
      this.renderer.setProperty(letterBox, 'innerHTML', letter);
      this.renderer.listen(letterBox, 'dragstart', (ev) => this.drag(ev)); // Evento de arrastar
      this.renderer.appendChild(this.lettersContainer.nativeElement, letterBox);
    });

    // Centraliza as letras dentro do container
    this.renderer.setStyle(this.lettersContainer.nativeElement, 'justify-content', 'center');
  }

  allowDrop(event: DragEvent): void {
    event.preventDefault();
  }

  drag(event: DragEvent): void {
    if (event.dataTransfer) {
      event.dataTransfer.setData("text", (event.target as HTMLElement).id);
    }
  }

  drop(event: DragEvent): void {
    event.preventDefault();
    const data = event.dataTransfer?.getData("text");
    if (!data) return;

    const draggedElement = document.getElementById(data);
    const targetElement = event.target as HTMLElement;

    if (!draggedElement) return;

    if (targetElement.classList.contains('drop-box') && targetElement.innerHTML.trim() === "?") {
      // Mover a letra para o drop-box
      targetElement.innerHTML = draggedElement.innerHTML || '';
      this.renderer.setStyle(draggedElement, 'visibility', 'hidden');

      this.dropToLetterMap.set(targetElement, draggedElement);

      // Adiciona o evento de clique para retornar a letra
      this.renderer.listen(targetElement, 'click', () => this.returnLetter(targetElement));
      this.checkCompletion();
    }
  }

  returnLetter(dropBox: HTMLElement): void {
    const originalLetterBox = this.dropToLetterMap.get(dropBox);
    if (originalLetterBox) {
      this.renderer.setStyle(originalLetterBox, 'visibility', 'visible');
      this.renderer.setProperty(dropBox, 'innerHTML', '?');
      this.dropToLetterMap.delete(dropBox);
    }
  }

  checkCompletion(): void {
    const dropBoxes = Array.from(this.wordContainer.nativeElement.querySelectorAll('.drop-box')) as HTMLElement[];
    const completedWord = dropBoxes.map((box: HTMLElement) => box.innerHTML.trim()).join('');
    const originalWord = this.selectedWordsData[this.currentIndex].word.trim();

    const allBoxesFilled = dropBoxes.every((box: HTMLElement) => box.innerHTML.trim() !== "?");

    if (allBoxesFilled) {
      if (completedWord === originalWord) {
        this.renderer.setProperty(this.messageElement.nativeElement, 'innerHTML', 'Parabéns! Você acertou a palavra!');
        this.renderer.setStyle(this.messageElement.nativeElement, 'color', 'green');
        this.renderer.setStyle(this.messageElement.nativeElement, 'display', 'block');
        setTimeout(() => {
          this.renderer.setStyle(this.messageElement.nativeElement, 'display', 'none');
          this.currentIndex++;
          this.loadNextWord();
        }, 2000);
      } else {
        this.renderer.setProperty(this.messageElement.nativeElement, 'innerHTML', 'Ops! Você errou. As letras serão embaralhadas novamente!');
        this.renderer.setStyle(this.messageElement.nativeElement, 'color', 'red');
        this.renderer.setStyle(this.messageElement.nativeElement, 'display', 'block');
        setTimeout(() => {
          this.renderer.setStyle(this.messageElement.nativeElement, 'display', 'none');
          this.clearDropBoxes();
          this.shuffleLetters(originalWord);
        }, 2000);
      }
    }
  }

  clearDropBoxes(): void {
    const dropBoxes = this.wordContainer.nativeElement.querySelectorAll('.drop-box');

    dropBoxes.forEach((box: HTMLElement) => {
      this.renderer.setProperty(box, 'innerHTML', '?');
    });

    this.dropToLetterMap.clear();

    // Garante que o container das letras embaralhadas seja limpo e centralizado
    this.renderer.setProperty(this.lettersContainer.nativeElement, 'innerHTML', '');

    const originalWord = this.selectedWordsData[this.currentIndex].word;
    this.shuffleLetters(originalWord);
  }
}
