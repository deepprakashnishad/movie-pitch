import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {OpenAiService} from './openai.service';
import { LoaderService } from './shared/loader.service';
import { FormsModule } from '@angular/forms';
import { SafePipe } from './safe.pipe';
import { AppModule } from './app.module';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, AppModule, SafePipe],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = '';

  girl_speech="Give me a one-sentence concept and I'll give you an eye-catching title, a synopsis the studios will love, a movie poster...AND choose the cast!"

  userInput: string="";

  synopsis: string="";

  characterNames: Array<any> = [];

  selectedImageUrl: string="https://w0.peakpx.com/wallpaper/986/34/HD-wallpaper-radha-govind-dev-ji-krishna-lord.jpg";

  characterStars: any = {"char1": "Tom Cruise", "char2": "Deepika Podukone"};

  stars: string="";

  constructor(
    private openaiService: OpenAiService,
    private loaderService: LoaderService
  ){
  }

  inputSubmitted(){
    // this.getImages(this.userInput);
    this.fetchMovieSynopsis();
  }

  getStars(){
    var keys = Object.keys(this.characterStars);
    this.stars = keys.map(key=>this.characterStars[key]).join(", ");
  }

  getTitleForMovie(){
    this.girl_speech = "Ok. Please wait for a while...I am working on your titles";

    this.loaderService.show("Fetching movie title");
    this.openaiService.getTitleForMovie(this.synopsis).subscribe(response=>{
      this.girl_speech = `Here they are as follows: \n ${response}`
      this.title = response.trim();
      this.loaderService.hide();
      setTimeout(()=>this.fetchImagePrompt(this.title, this.synopsis), 70000);
    })
  }

  fetchMovieSynopsis(){
    this.girl_speech = "Ok. Please wait for a while...I am working on your titles"
    this.loaderService.show("Fetching movie title");
    this.openaiService.getSynopsisFromOneLine(this.userInput).subscribe(response=>{
      this.loaderService.hide();
      this.synopsis = response;
      this.getTitleForMovie();
      setTimeout(()=>this.fetchStars(), 1000);
    })
  }

  fetchStars(){
    this.loaderService.show("Fetching movie stars");
    this.openaiService.getStarsPlayingRoles(this.synopsis).subscribe(response=>{
      this.loaderService.hide();
      this.characterStars = JSON.parse(response.trim());
      this.getStars();
    });
  }

  fetchImagePrompt(title: string, synopsis: string){
    this.loaderService.show("Fetching Image prompt for synopsis");
    this.openaiService.fetchImagePrompt(title, synopsis).subscribe(response=>{
      this.loaderService.hide();
      console.log(response);
      setTimeout(()=>this.getImages(response), 5000);
    })
  }  

  /*fetchImagePrompts(title: string, synopsis: string){
    this.openaiService.fetchImagePrompts(title, synopsis).subscribe(response=>{
      console.log(response);
    })
  }*/

  getImages(imagePrompt: string, imageCount: number=1, size: string="256X256"){
    this.loaderService.show("Fetching Image prompt for synopsis");
    this.openaiService.generateImageUsingAI(imagePrompt, imageCount, size).subscribe((url: string)=>{
      this.loaderService.hide();
      this.selectedImageUrl = url;
    });
  }
}
