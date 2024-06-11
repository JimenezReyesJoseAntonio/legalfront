import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent   {
  username: string = '';
  password: string = '';
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isAdmin = this.authService.isAdmin();

  }
 
  login() {
    this.authService.login(this.username, this.password).subscribe(
      data => {
        console.log(this.authService.isAdmin());

        this.router.navigate(['/admin/home']);
      },
      error => {
        console.error('Login error', error);
      }
    );
  }

  logout() {
   this.authService.logout();
  }
}
