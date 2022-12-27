import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { User } from 'src/app/models/User.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userData: any;
  //Collections
  usersObsv: Observable<User[]>;
  uidGenerated = null;
  private usersCollection: AngularFirestoreCollection<User>;
  gotUserData = false;

  constructor(
    public afStore: AngularFirestore,
    public ngFireAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone,
    private alertController: AlertController
  ) {
    this.usersCollection = afStore.collection<User>('users');

    this.ngFireAuth.authState.subscribe((user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user'));
      } else {
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Returns true when user is looged in
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null ? true : false;
  }
  

  getUserByEmail(email: string) {
    return this.afStore
    .collection('users')
    .doc(email).valueChanges()
  }

  // Login in with email/password
  SignIn(email, password) : Promise<any> {

    return new Promise( (resolve,reject) => {

      this.ngFireAuth.signInWithEmailAndPassword(email, password)
      .then(async (response) => {
        console.log(response);

        this.getUserByEmail( response.user.email )
        .subscribe( res => {
          resolve(res);
          this.router.navigate(['/home']);  
        });

      }).catch((err)=>  {
        reject(err);
      })

    });
  }

  // Store user in localStorage
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afStore.doc(
      `users/${user.uid}`
    );
    const userData: User = {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    return userRef.set(userData, {
      merge: true,
    });
  }

  // Sign-out
  SignOut() {
    return this.ngFireAuth.signOut().then(() => {
      localStorage.removeItem('user');
      this.router.navigate(['login']);
    });
  }

}
