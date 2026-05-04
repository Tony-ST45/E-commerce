import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface OrderItem {
  id?: number;
  name?: string;
  title?: string;
  quantity: number;
  price: number;
  image?: string;
  thumbnail?: string;
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'Pending' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
}

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './history.html',
  styleUrls: ['./history.css'],
})
export class History implements OnInit {

  orders: Order[] = [];

  // ================= INIT =================
  ngOnInit(): void {
    this.loadOrders();

    // 🔄 auto update when new order placed
    window.addEventListener('cartUpdated', this.handleUpdate);
  }

  ngOnDestroy(): void {
    window.removeEventListener('cartUpdated', this.handleUpdate);
  }

  handleUpdate = () => {
    this.loadOrders();
  };

  // ================= LOAD =================
  loadOrders() {
    try {
      const data = localStorage.getItem('orders');
      this.orders = data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Order load error:', error);
      this.orders = [];
    }
  }

  // ================= CLEAR =================
  clearHistory() {
    if (confirm('Are you sure you want to clear all orders?')) {
      localStorage.removeItem('orders');
      this.orders = [];
    }
  }

  // ================= REORDER =================
  reorder(order: Order) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');

    const updatedCart = [
      ...cart,
      ...order.items.map(item => ({
        id: item.id || Date.now(),
        title: item.title || item.name,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail || item.image
      }))
    ];

    localStorage.setItem('cart', JSON.stringify(updatedCart));

    window.dispatchEvent(new Event('cartUpdated'));

    alert('🛒 Items added to cart!');
  }

  // ================= STATUS COLOR =================
  getStatusClass(status: string) {
    return {
      'bg-green-100 text-green-600': status === 'Delivered',
      'bg-yellow-100 text-yellow-600': status === 'Pending',
      'bg-red-100 text-red-600': status === 'Cancelled'
    };
  }

}