import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {

  user: any = null;

  constructor(private router: Router) {}

  ngOnInit(): void {

    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      this.user = JSON.parse(savedUser);
    } else {
      // redirect if not logged in
      this.router.navigate(['/login']);
    }

  }

  logout() {

    localStorage.removeItem('user');

    // notify navbar to update instantly
    window.dispatchEvent(new Event('userUpdated'));

    this.router.navigate(['/login']);

  }

}