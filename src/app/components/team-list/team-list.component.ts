import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, map, Observable, Subscription } from 'rxjs';
import { Team } from 'src/app/models/Team.model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TeamService } from 'src/app/services/team/team.service';

@Component({
  selector: 'app-team-list',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss']
})
export class TeamListComponent {
  teamMembers$ = this.teamService.members$;
  teamNameObsv$ = this.teamService.teamName$;
  team: Team;
  private teamSub: Subscription;
  teamId;
  teamName : string = 'MY AVENGERS';

  form : FormGroup;
  teamNameInput : FormControl;

  isLoading : boolean = false;

  membersCount$ : Observable<number> = this.teamMembers$.pipe(
    map((members) => members.length)
  );

  constructor(public teamService: TeamService,private alertCtrl: AlertController,private authService: AuthService,private router: Router){
   
    this.form = new FormGroup({
      teamNameInput : new FormControl(this.teamName)
    });
  }
  
  ngOnInit(){
  
  }


  onKeyDownEvent(event: any){
    try {
      if(event == null) return;
      else if(event.code == "Enter"){
        //this.onSearch();
      }
    }catch(err){
      console.log(err);
      
    }
  }

  updateTeamName(){

    console.log("ON SEARCH");
    const teamName = this.form.get('teamName').value;

    if(teamName){
      this.isLoading = true;

      this.teamService.onSaveTeam(teamName, this.teamId)
      .then( (res) => {
        console.log('team updated: ' + res);
        
      }) 
      .catch( (err) => {
        console.log(err);
      });

      this.isLoading = false;
    }

  }

  logout(){
    this.authService.SignOut();
    this.router.navigateByUrl(
      '/login',{ replaceUrl: true }
    )
  }

  ngOnDestroy() {
    if (this.teamSub) {
      this.teamSub.unsubscribe();
    }
  }

}
