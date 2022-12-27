import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { TeamService } from '../team/team.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  //private added = new BehaviorSubject<boolean>(false);
  //added$ = this.added.asObservable();
  private character = new BehaviorSubject<any>([]);
  character$ = this.character.asObservable();

  private isCharacterAdded = new BehaviorSubject<boolean>(false);
  isCharacterAdded$ = this.isCharacterAdded.asObservable();

  constructor(public teamService: TeamService) {
   // this.teamService.checkHeroInTeam()

    this.character.subscribe((res)=> {
      //console.log(res);
    })
  }

  setCharacterSelected(character: any){
    this.character.next(character);
  }

  setCharacterAdded(isAdded){
    this.isCharacterAdded.next(isAdded);
  }

}
