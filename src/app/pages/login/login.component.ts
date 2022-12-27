import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  Form:FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public authService: AuthService,
    private alertController: AlertController
    ){ }

    ngOnInit() {
      this.Form = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      })
    }

    get errorControl() {
      return this.Form.controls;
    }

    async logIn() : Promise<boolean> {
      const email = this.Form.value.email;
      const password = this.Form.value.password; 
      console.log('email: '+ email);
  
      if( this.Form.valid == false){
        return false;
      }
  
      this.authService.SignIn(email, password)
      .then(
        async (res) => {
        }, async (error)=>{
         
          const alert = await this.alertController.create({
            header: 'Login error',
            message: 'User doesnt exist.',
            buttons: ['OK'],
          });
          await alert.present();
         
        }
      )

      return true;
    }

}
