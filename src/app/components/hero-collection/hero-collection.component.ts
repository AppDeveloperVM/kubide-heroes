import { Component, Directive, ElementRef, HostBinding, HostListener, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { InfiniteScrollCustomEvent, LoadingController } from '@ionic/angular';
import { catchError, EMPTY, Observable } from 'rxjs';
import { MarvelAPIProviderService } from 'src/app/providers/marvel-apiprovider.service';

@Component({
  selector: 'app-hero-collection',
  templateUrl: './hero-collection.component.html',
  styleUrls: ['./hero-collection.component.scss']
})
export class HeroCollectionComponent {
  Object = Object;
  characters = [];
  hero_collection$ = this.marvelAPI.CharactersResults$;
  currentPage = 0;

  form : FormGroup;
  heroName : FormControl;
  errorMessage = "";

  constructor(
    public marvelAPI : MarvelAPIProviderService,
    private loadingCtrl : LoadingController,
    private el: ElementRef,
    private renderer: Renderer2){
    this.form = new FormGroup({
      heroName: new FormControl('')
    });
  }

  ngOnInit() {
    this.loadCharacters();
  }

  async loadCharacters(event? : InfiniteScrollCustomEvent, params? : string) {
    
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      spinner: 'bubbles'
    });
    if(!params){ await loading.present(); }

    this.marvelAPI.getCharacters(this.currentPage, params)
    .subscribe( res => {
      console.log("Page : " + this.currentPage);

      loading.dismiss();
      this.characters.push(...res);
      //console.log(res);
    })
     
  } 

  loadMore(event){
    console.log(event);
    
    this.currentPage++;
    this.loadCharacters(event);
    event?.target.complete();
  }
  

  async searchByName(name: string){
    console.log(name);
    this.marvelAPI.getCharacters(null,`nameStartsWith=${name}&`);
  }

  onSearch(){
    console.log("ON SEARCH");

    if(this.form.get('heroName').value){

      const heroName = this.form.get('heroName').value;
      console.log(heroName);

      //this.characters = null;
      
        this.searchByName(heroName);

      }

  }

  onKeyDownEvent(event: any){
    try {
      if(event == null) return;
      else if(event.code == "Enter"){
        this.onSearch();
      }
    }catch(err){
      console.log(err);
      
    }
  }
  
  handleError(err){

    switch(err){
      case 404 :
        this.errorMessage = "Usuario no encontrado";
        break;
      case 403 : 
        this.errorMessage = "límite de peticiones";
        break;
      default :
        this.errorMessage = "error desconocido";
        break;
    }

  }

}

