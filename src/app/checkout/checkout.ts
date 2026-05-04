import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

declare var Razorpay: any;

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {

  cart: any[] = [];
  total = 0;
  loading = false;

  paymentMethod = "ONLINE";

  address = {
    name: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  };

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      this.cart = JSON.parse(savedCart);

      this.total = this.cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
    }

    if (this.cart.length === 0) {
      this.router.navigate(['/products']);
    }

  }

  checkout() {

    if (!this.address.name || !this.address.phone || !this.address.address) {
      alert("Please fill shipping details");
      return;
    }

    this.payOnline();

  }

  payOnline() {

    this.loading = true;

    this.http.post<any>("http://localhost:3000/api/payment/create-order", {
      amount: this.total
    }).subscribe({

      next: (res) => {

        const order = res.order;

        const options = {

          key: "rzp_test_SQbLzWOmkswJEl",

          amount: order.amount,
          currency: "INR",

          name: "Cartify",
          description: "Order Payment",

          order_id: order.id,

          handler: (response: any) => {

            alert("Payment Successful 🎉");

            this.placeOrder("ONLINE");

          },

          prefill: {
            name: this.address.name,
            contact: this.address.phone
          },

          theme: {
            color: "#000"
          }

        };

        const rzp = new Razorpay(options);

        rzp.open();

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        alert("Payment initialization failed");

        this.loading = false;

      }

    });

  }

  placeOrder(method: string) {

    const order = {
      items: this.cart,
      total: this.total,
      payment: method,
      address: this.address,
      date: new Date()
    };

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    orders.push(order);

    localStorage.setItem("orders", JSON.stringify(orders));

    localStorage.removeItem("cart");

    window.dispatchEvent(new Event("cartUpdated"));

    this.router.navigate(['/order-success']);

  }

}