import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeScreenComponent } from './home-screen/home-screen.component';
import { WordScrambleComponent } from './word-scramble/word-scramble.component';
import { WordListsComponent } from './word-lists/word-lists.component';
import { ContextComponent } from './context/context.component';
import { AboutComponent } from './about/about.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeScreenComponent,
    WordScrambleComponent,
    WordListsComponent,
    ContextComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideHttpClient(
      withFetch() // Configura o HttpClient para usar a API Fetch
    )
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
