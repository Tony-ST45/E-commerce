import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  email: string = '';
  password: string = '';
  remember: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login() {

    if (!this.email || !this.password) {
      alert("Please enter email and password");
      return;
    }

    const userData = {
      email: this.email,
      password: this.password
    };

    this.authService.login(userData).subscribe({

      next: (res: any) => {

        console.log("Login Response:", res);

        const user = {
          firstName: res.firstName || res.user?.firstName,
          email: res.email || res.user?.email
        };

        // Save user for navbar
        localStorage.setItem("user", JSON.stringify(user));

        // Optional remember flag
        if (this.remember) {
          localStorage.setItem("rememberUser", "true");
        }

        // 🔔 Notify navbar instantly
        window.dispatchEvent(new Event("userUpdated"));

        alert("Login Successful 🎉");

        // Redirect
        this.router.navigate(['/home']);

      },

      error: (err) => {
        alert(err.error?.message || "Login Failed");
      }

    });

  }

}