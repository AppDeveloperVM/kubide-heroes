import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Character } from 'src/app/models/Character.model';
import { ImageThumbnail, ImageVariant } from 'src/app/models/Image.model';
import { MarvelAPIProviderService } from 'src/app/providers/marvel-apiprovider.service';
import { CharacterService } from 'src/app/services/character/character.service';
import { HeroDetailsComponent } from '../hero-details/hero-details.component';

@Component({
  selector: 'app-character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss']
})
export class CharacterItemComponent {
  @Input() name: any;
  @Input() added: Boolean = true;
  thumbnail_url : string;

  constructor(public modalCtrl : ModalController, public marverlApi: MarvelAPIProviderService, public characterService : CharacterService){

  }

  getImage(character: any) {
    const response = this.marverlApi.getImage(character.thumbnail, ImageVariant.portrait_xlarge);
    this.thumbnail_url = response;
    return response;
  }

  openHeroDetails(char: any){

    this.modalCtrl.create({component: HeroDetailsComponent, componentProps : {
      cssClass: 'custom-modal',
      characterData: char,
      added: true
    }}).then(modalEl => {
      modalEl.present();
    });
  }

}
