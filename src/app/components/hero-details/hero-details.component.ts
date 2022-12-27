import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { ImageVariant } from 'src/app/models/Image.model';
import { MarvelAPIProviderService } from 'src/app/providers/marvel-apiprovider.service';
import { CharacterService } from 'src/app/services/character/character.service';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-hero-details',
  templateUrl: './hero-details.component.html',
  styleUrls: ['./hero-details.component.scss']
})
export class HeroDetailsComponent {
  thumbnail : string;
  comics = [];

  @Input() characterData;
  added = false;
  addedSubscription = new Subscription();

  constructor(public modalCtrl : ModalController, public marvelApi : MarvelAPIProviderService, public teamService: TeamService, private characterService: CharacterService){
    this.addedSubscription = this.characterService.isCharacterAdded$.subscribe(
      (res) => console.log(res)
    );

    
  }

  ngOnInit() : void {
    console.log(this.characterData);

    this.isAddedInTeam(this.characterData.name);
    this.getImage(this.characterData);
    this.comics = this.characterData.comics.items.slice(0, 3);
  }

  getImage(character: any) {
    const response = this.marvelApi.getImage(character.thumbnail, ImageVariant.portrait_incredible);
    this.thumbnail = response;
  }

  async getComics(){
    await this.marvelApi.getComicsOfCharacter(this.characterData.name).subscribe((res)=>{
      this.comics = res;
      console.log("Comics :" + res);
    })
  }

  isAddedInTeam(member: any){
    this.teamService.checkHeroInTeam(member.name)
    .subscribe((res)=> {
      this.added = res;
    });
  }

  addMember(member: any){
    this.isAddedInTeam(member);

    if(!this.added && this.teamService.members_count <= this.teamService.max_chars ) {
      this.teamService.addHero(member);
    }
  }

  removeMember(member: any){
    this.isAddedInTeam(member);
    if(this.added){
      this.teamService.removeHero(member);
    }
  }

  ngOnDestroy(){
    this.addedSubscription.unsubscribe();
  }

 
  close(){
    this.modalCtrl.dismiss();
  }

}
