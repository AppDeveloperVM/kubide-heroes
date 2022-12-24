import { Component } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { MarvelAPIProviderService } from 'src/app/providers/marvel-apiprovider.service';

@Component({
  selector: 'app-hero-collection',
  templateUrl: './hero-collection.component.html',
  styleUrls: ['./hero-collection.component.scss']
})
export class HeroCollectionComponent {
  Object = Object;
  characters = [];
  currentPage = 0;

  constructor(public marvelAPI : MarvelAPIProviderService, private loadingCtrl : LoadingController){

  }

  ngOnInit() {
    this.loadCharacters();
  }

  async loadCharacters() {
    const loading = await this.loadingCtrl.create({
      message: 'Loading',
      spinner: 'bubbles'
    });
    await loading.present();

    this.marvelAPI.getAllCharacters(this.currentPage).subscribe( res => {
      const characters = res.data.results;
      loading.dismiss();
      this.characters = [...this.characters, ...characters];
      console.log(characters);
      
    })
  }
}
