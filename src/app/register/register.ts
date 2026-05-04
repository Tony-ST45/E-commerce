import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  // form variables
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  terms: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  register() {

    if (!this.terms) {
      alert("Please accept Terms & Conditions");
      return;
    }

    if (this.password.length < 8) {
      alert("Password must be at least 8 characters");
      return;
    }

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: this.password
    };

    this.authService.register(userData).subscribe({
      next: (res:any) => {

        alert("Registration Successful 🎉");
        console.log(res);

        // Redirect to login page
        this.router.navigate(['/login']);

      },
      error: (err) => {
        alert(err.error?.message || "Registration Failed");
      }
    });

  }

}