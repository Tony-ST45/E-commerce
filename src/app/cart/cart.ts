import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  thumbnail?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: string;
  items: CartItem[];
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.html',
})
export class Cart implements OnInit, OnDestroy {

  @Output() close = new EventEmitter<void>();

  cart: CartItem[] = [];

  // ================= INIT =================
  ngOnInit(): void {
    this.loadCart();
    window.addEventListener('cartUpdated', this.handleCartUpdate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('cartUpdated', this.handleCartUpdate);
  }

  handleCartUpdate = () => {
    this.loadCart();
  };

  // ================= LOAD =================
  loadCart() {
    try {
      const savedCart = localStorage.getItem('cart');

      if (!savedCart) {
        this.cart = [];
        return;
      }

      const parsed = JSON.parse(savedCart);

      this.cart = parsed.map((item: any) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        thumbnail: item.thumbnail || item.images?.[0] || ''
      }));

    } catch (error) {
      console.error('Cart load error:', error);
      this.cart = [];
    }
  }

  // ================= SAVE =================
  saveCart() {
    localStorage.setItem('cart', JSON.stringify(this.cart));
    window.dispatchEvent(new Event('cartUpdated'));
  }

  // ================= CLOSE =================
  closeCart() {
    this.close.emit();
  }

  // ================= QUANTITY =================
  increaseQty(item: CartItem) {
    item.quantity += 1;
    this.saveCart();
  }

  decreaseQty(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      this.removeFromCart(item);
      return;
    }
    this.saveCart();
  }

  // ================= REMOVE =================
  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter(p => p.id !== item.id);
    this.saveCart();
  }

  // ================= CLEAR =================
  clearCart() {
    this.cart = [];
    this.saveCart();
  }

  // ================= TOTAL =================
  getTotal(): number {
    const total = this.cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return Math.round(total);
  }

  // ================= CHECKOUT (🔥 MAIN FEATURE) =================
  checkout() {

    if (this.cart.length === 0) {
      alert('🛒 Your cart is empty!');
      return;
    }

    const existingOrders: Order[] = JSON.parse(localStorage.getItem('orders') || '[]');

    const newOrder: Order = {
      id: '#ORD' + Date.now(),
      date: new Date().toLocaleDateString('en-IN'),
      total: this.getTotal(),
      status: 'Pending',
      items: [...this.cart] // clone to avoid reference issues
    };

    existingOrders.unshift(newOrder);

    localStorage.setItem('orders', JSON.stringify(existingOrders));

    // Clear cart
    this.clearCart();

    // Optional UX
    alert('✅ Order placed successfully!');

    // Auto close cart (optional)
    this.closeCart();
  }

  // ================= EXTRA (🔥 PRO FEATURES) =================

  getItemCount(): number {
    return this.cart.reduce((count, item) => count + item.quantity, 0);
  }

}