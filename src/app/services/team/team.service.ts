import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AlertController } from '@ionic/angular';
import { User } from 'firebase/auth';
import { BehaviorSubject, filter, find, from, map, Observable, Subject, Subscription, tap } from 'rxjs';
import { Character } from 'src/app/models/Character.model';
import { Team } from 'src/app/models/Team.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  public userData : any;
  team: Team;
  teamIdRef : string = null;

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

    this.members$.subscribe((res)=> {
      console.log(res);
      this.team = res;
    })

    this.getTeam();
  }

  public getTeam(): void {
    this.teamsObsv = this.teamsCollection.snapshotChanges().pipe(
      map( actions => actions.map(el => {
        console.log(el);
        
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
    this.members.next([...this.members.value, member]);
   
    if(this.checkHeroInTeam(member)){
      const save = this.onSaveTeam(this.team, this.userData.uid ).then((res) => {
        console.log(res);
      }).catch((err)=> {
        console.log(err);
        
      })
    
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
          console.log(team); 
          
            const id = userId || this.afs.createId();
            const idTeam = this.teamIdRef || this.afs.createId();
            const heroData = team[0];
            const data =  
            { 
            id: heroData.id,
            name : heroData.name,
            description: heroData.description,
            resourceURI: heroData.resourceURI,
            thumbnail: heroData.thumbnail,
            comics: heroData.comics
            };
            const idref = this.usersCollection.doc(id).collection('team').doc(idTeam);
            this.teamIdRef = idref.ref.id;
            
            const result = await idref.collection('members').doc().set(data);
            resolve(result);
        } catch (err) {
            reject(err.message)
        }
    })
  }

  updateTeamData(teamData: string, teamId?: string){
    this.teamName.next(teamData);
  }

}
