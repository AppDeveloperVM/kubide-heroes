import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { BehaviorSubject, map, Subscription } from 'rxjs';
import { Character } from 'src/app/models/Character.model';
import { ImageThumbnail, ImageVariant } from 'src/app/models/Image.model';
import { MarvelAPIProviderService } from 'src/app/providers/marvel-apiprovider.service';
import { CharacterService } from 'src/app/services/character/character.service';
import { TeamService } from 'src/app/services/team/team.service';
import { HeroDetailsComponent } from '../hero-details/hero-details.component';

@Component({
  selector: 'app-character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss']
})
export class CharacterItemComponent {
  @Input() hero: any;
  added = false;
  thumbnail_url : string;
  teamMembersCount$ = this.teamService.membersCount$;

  constructor(public modalCtrl : ModalController, public marverlApi: MarvelAPIProviderService, public characterService : CharacterService, public teamService: TeamService){
    
  }

  ngOnInit(){
    this.isAddedInTeam(this.hero);
  }

  getImage(character: any) {
    const response = this.marverlApi.getImage(character.thumbnail, ImageVariant.portrait_xlarge);
    this.thumbnail_url = response;
    return response;
  }

  openHeroDetails(char: any){
    console.log(char);
    
    if (char != null) {
      this.modalCtrl.create({component: HeroDetailsComponent, componentProps : {
        cssClass: 'custom-modal',
        characterData: char,
        added: true
      }}).then(modalEl => {
        modalEl.present();
      });
    }  
  }


  isAddedInTeam(member: any){
    this.teamService.checkHeroInTeam(member.name)
    .subscribe((res)=> {
      this.added = res;
    });
  }

  addTeamMember(member: any){
     this.isAddedInTeam(member);
    
    if(!this.added && this.teamService.members_count <= this.teamService.max_chars ) {
      this.teamService.addHero(member);
    }

    console.log(this.teamMembersCount$);
    
      
  }

  removeMember(member: any){
    this.isAddedInTeam(member);

    if(this.added){
      this.teamService.removeHero(member);
    }
    
  }


}
