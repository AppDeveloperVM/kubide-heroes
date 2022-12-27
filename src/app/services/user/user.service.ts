import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreCollectionGroup } from '@angular/fire/compat/firestore';
import { getAuth, updateProfile } from "firebase/auth";
import { map, Observable } from 'rxjs';
import { User } from 'src/app/models/User.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  users : any;
  private dbPath = '/users';
  //Collections
  usersObsv: Observable<User[]>;
  private usersRef: AngularFirestoreCollection<User>;

  constructor(private readonly afs: AngularFirestore) {
    this.usersRef = afs.collection<User>(this.dbPath);
  }

  getUsers(): void {
    this.usersRef.snapshotChanges().pipe(
    map( changes => 
      changes.map( a => 
        a.payload.doc.data() as User)
    )).subscribe( data => {
      this.users = data;
    });
  }

  getUserById(userId: string) {
    return this.afs
    .collection('users')
    .doc(userId)
    .valueChanges()
  }
  
  create(user: User): any {
    return this.usersRef.add({...user});
  }

  update(id: string, data: any): Promise<void> {
    return this.usersRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.usersRef.doc(id).delete();
  }

}
