import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './navbar.html',
})
export class Navbar implements OnInit, OnDestroy {

  isMenuOpen = false;
  cartCount = 0;
  user: any = null;
  scrolled = false; // For modern floating effect

  // Define listeners as arrow functions to maintain 'this' context
  private storageListener = () => {
    this.loadCartCount();
    this.loadUser();
  };

  private cartUpdateListener = () => this.loadCartCount();
  private userUpdateListener = () => this.loadUser();

  constructor(private router: Router) {
    // Auto-close mobile menu on route change
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.isMenuOpen = false;
    });
  }

  // ================= SCROLL DETECTION =================
  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Trigger shadow effect after 20px of scrolling
    this.scrolled = window.scrollY > 20;
  }

  // ================= INIT =================
  ngOnInit(): void {
    this.loadCartCount();
    this.loadUser();

    // Browser-level events for real-time reactivity
    window.addEventListener('storage', this.storageListener);
    window.addEventListener('cartUpdated', this.cartUpdateListener);
    window.addEventListener('userUpdated', this.userUpdateListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('storage', this.storageListener);
    window.removeEventListener('cartUpdated', this.cartUpdateListener);
    window.removeEventListener('userUpdated', this.userUpdateListener);
  }

  // ================= NAVIGATION/MENU =================
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // ================= DATA LOADING =================
  private loadCartCount(): void {
    const savedCart = localStorage.getItem('cart');
    if (!savedCart) {
      this.cartCount = 0;
      return;
    }

    try {
      const cart = JSON.parse(savedCart);
      // Ensure quantity is summed correctly across all unique items
      this.cartCount = cart.reduce((total: number, item: any) => total + (item.quantity || 0), 0);
    } catch {
      this.cartCount = 0;
    }
  }

  private loadUser(): void {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      this.user = null;
      return;
    }

    try {
      this.user = JSON.parse(savedUser);
    } catch {
      this.user = null;
    }
  }

  // ================= AUTH ACTIONS =================
  logout(): void {
    localStorage.removeItem('user');
    
    // Clear state locally
    this.user = null;

    // Notify other components (and this one) instantly
    window.dispatchEvent(new Event('userUpdated'));

    this.router.navigate(['/login']);
  }
}