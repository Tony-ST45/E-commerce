import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
})
export class Home implements OnInit, OnDestroy {

  // ================= SLIDER =================

  images: string[] = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1000'
  ];

  currentImageIndex = 0;
  private slideInterval: any;
  isPaused = false;

  // ================= SUBSCRIBE =================

  subscriberEmail = '';
  subscribeError = '';
  isSubscribing = false;
  showToast = false;

  private API_URL = 'http://localhost:3000/api/subscribe';
  private subscription!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoSlide();
    }
  }

  // ================= SLIDER =================

  startAutoSlide(): void {
    this.stopAutoSlide();

    this.slideInterval = setInterval(() => {
      if (!this.isPaused) this.nextSlide();
    }, 3000);
  }

  stopAutoSlide(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
  }

  nextSlide(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.images.length;
  }

  prevSlide(): void {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.images.length) % this.images.length;
  }

  pauseSlider(): void {
    this.isPaused = true;
  }

  resumeSlider(): void {
    this.isPaused = false;
  }

  goToSlide(index: number): void {
    this.currentImageIndex = index;
  }

  // ================= EMAIL VALIDATION =================

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ================= SUBSCRIBE =================

  subscribe() {
    this.subscribeError = '';

    if (!this.isValidEmail(this.subscriberEmail)) {
      this.subscribeError = 'Please enter a valid email';
      return;
    }

    this.isSubscribing = true;

    this.subscription = this.http.post<any>(this.API_URL, {
      email: this.subscriberEmail
    }).subscribe({

      next: (res) => {

        if (res?.success || res?.message === 'Subscribed successfully') {

          // ✅ SHOW TOAST (MODERN)
          this.showToast = true;

          setTimeout(() => this.showToast = false, 3000);

          this.subscriberEmail = '';
        } else {
          this.subscribeError = 'Something went wrong. Try again.';
        }

        this.isSubscribing = false;
      },

      error: () => {
        this.subscribeError = 'Server error. Please try later.';
        this.isSubscribing = false;
      }
    });
  }

  // ================= CLEANUP =================

  ngOnDestroy(): void {
    this.stopAutoSlide();
    if (this.subscription) this.subscription.unsubscribe();
  }
}