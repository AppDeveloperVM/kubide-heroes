import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { BehaviorSubject, filter, find, from, map, Observable, Subject, Subscription, tap } from 'rxjs';
import { Team } from 'src/app/models/Team.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  public userData : any;
  team: Team;

  private members = new BehaviorSubject<any[]>([]);
  members$ = this.members.asObservable(); 
  membersCount$ : Observable<number>= this.members$.pipe(
    map((res)=> res.length)
  );
  teamName = new BehaviorSubject<string>('AVENGERS');
  teamName$ = this.teamName.asObservable();
  teamsObsv: Observable<Team>;

  //Collections
  private usersCollection : AngularFirestoreCollection<User>;
  private teamsCollection : AngularFirestoreCollection<Team>;

  CountSubscription = new Subscription();
  members_count = 0;
  max_chars = 6;

  isLoading = false;

  constructor(
    private readonly afs: AngularFirestore,
    private authFire : AngularFireAuth,
    private alertCtrl: AlertController,
    private userService : UserService
    ) {
    this.userService.getUsers();
    this.isLoading = true;

    //auth data
    this.authFire.currentUser.then( (res) => {
      this.userData = res;
      console.log(res);
      
    })

    this.authFire.authState.subscribe((user) => {  
      this.userData = user;
      console.log(user);

      this.isLoading = false;
    }); 
    //

    //get members from Firebase DB
    this.usersCollection = afs.collection<User>('users')
    this.teamsCollection = afs.collection<Team>('teams');

    this.CountSubscription = this.members$
    .pipe( 
      map((members) => this.members_count = members.length + 1)
    ).subscribe();


    this.getTeam();
  }

  public getTeam(): void {
    this.teamsObsv = this.teamsCollection.snapshotChanges().pipe(
      map( actions => actions.map(el => {
        const data = el.payload.doc.data() as Team;
        const elId = el.payload.doc.id;
        return { elId, ...data}
      }))
    )
  }

  getTeamById(cosplayId: string) {
    return this.afs
    .collection('teams')
    .doc(cosplayId)
    .valueChanges()
  }

  checkHeroInTeam(memberName: string) : Observable<boolean>{
    let has_member = this.members$.pipe(
      map(members => {
        return members.some(x => x.name === memberName)
      })
    );
    return has_member;
  }

  saveTeamFirebase(){
    
  }


  addHero(member: any) : void {
    if(this.checkHeroInTeam(member)){
      //this.onSaveTeam

      this.members.next([...this.members.value, member])
    }
  }

  removeHero(memberToDelete) : void {
    if(this.checkHeroInTeam(memberToDelete)){
      this.members.next(this.members.value.filter((member) => member !== memberToDelete ));
    }
  }

  onSaveTeam(team: Team, userId: string): Promise<void> {
    return new Promise( async (resolve, reject) => {
        try {
            const id = userId || this.afs.createId();
            const data = {id, ... team};
            const result = await this.usersCollection.doc(id).collection('team').doc().set(data);
            resolve(result);
        } catch (err) {
            reject(err.message)
        }
    })
  }

  updateTeamName(teamName: string, teamId?: string){
    //check for string format
    
    //

    this.teamName.next(teamName);
  }

}
