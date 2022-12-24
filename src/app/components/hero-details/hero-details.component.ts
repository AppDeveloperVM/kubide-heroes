import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ImageVariant } from 'src/app/models/Image.model';
import { MarvelAPIProviderService } from 'src/app/providers/marvel-apiprovider.service';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss']
})
export class HeroDetailsComponent {
  @Input() added: Boolean = true;
  @Input() characterData : any;
  thumbnail : string;

  constructor(public modalCtrl : ModalController, public marvelApi : MarvelAPIProviderService){ }

  ngOnInit(){
    this.getImage(this.characterData);
  }

  getImage(character: any) {
    const response = this.marvelApi.getImage(character.thumbnail, ImageVariant.portrait_incredible);
    this.thumbnail = response;
  }

  close(){
    this.modalCtrl.dismiss();
  }

}
