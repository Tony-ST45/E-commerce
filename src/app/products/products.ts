import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './products.html',
})
export class Products implements OnInit {
  // --- Data States ---
  products: any[] = [];
  allProducts: any[] = [];
  categories: any[] = [];

  // --- Filter & UI States ---
  selectedCategory: string = '';
  searchText: string = '';
  selectedSort: string = '';
  isLoading = false;
  showToast = false;

  // --- Professional Detail View State ---
  // This replaces the simple modal with a full-page view state
  viewMode: 'list' | 'detail' = 'list'; 
  selectedProduct: any = null;
  selectedImage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadCache();
    this.fetchProducts();
    this.fetchCategories();
  }

  // ================= NAVIGATION LOGIC =================

  /**
   * Switches to the professional detail view
   */
  openProductPage(product: any) {
    this.selectedProduct = product;
    this.selectedImage = product.thumbnail;
    this.viewMode = 'detail';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Returns to the main product gallery
   */
  goBackToList() {
    this.viewMode = 'list';
    this.selectedProduct = null;
  }

  // ================= DATA FETCHING =================

  loadCache() {
    const cachedData = localStorage.getItem('products_cache');
    if (cachedData) {
      this.allProducts = JSON.parse(cachedData);
      this.products = [...this.allProducts];
      this.isLoading = false;
    } else {
      this.isLoading = true;
    }
  }

  fetchProducts() {
    this.http.get<any>('https://dummyjson.com/products?limit=100')
      .subscribe({
        next: (res) => {
          this.allProducts = res.products || [];
          localStorage.setItem('products_cache', JSON.stringify(this.allProducts));
          this.applyFilters();
          this.isLoading = false;
        },
        error: () => this.isLoading = false
      });
  }

  fetchCategories() {
    this.http.get<any>('https://dummyjson.com/products/categories')
      .subscribe({
        next: (res) => {
          this.categories = res.map((cat: any) => (
            typeof cat === 'string' 
              ? { slug: cat, name: cat.charAt(0).toUpperCase() + cat.slice(1) }
              : { slug: cat.slug, name: cat.name }
          ));
        }
      });
  }

  // ================= FILTERS & ACTIONS =================

  applyFilters() {
    let filtered = [...this.allProducts];

    if (this.searchText?.trim()) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(p => p.title.toLowerCase().includes(search));
    }

    if (this.selectedCategory) {
      filtered = filtered.filter(p => p.category === this.selectedCategory);
    }

    if (this.selectedSort === 'priceLow') filtered.sort((a, b) => a.price - b.price);
    else if (this.selectedSort === 'priceHigh') filtered.sort((a, b) => b.price - a.price);
    else if (this.selectedSort === 'name') filtered.sort((a, b) => a.title.localeCompare(b.title));

    this.products = filtered;
  }

  addToCart(product: any) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find((p: any) => p.id === product.id);
    existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // UI Feedback
    this.showToast = true;
    setTimeout(() => this.showToast = false, 3000);
    window.dispatchEvent(new Event('cartUpdated'));
  }

  toggleWishlist(product: any) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const index = wishlist.findIndex((p: any) => p.id === product.id);
    index > -1 ? wishlist.splice(index, 1) : wishlist.push(product);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }

  // ================= UTILS =================

  trackById(index: number, item: any) { return item.id; }
  onSearchChange() { this.applyFilters(); }
  onCategoryChange() { this.applyFilters(); }
  resetFilters() {
    this.searchText = '';
    this.selectedCategory = '';
    this.selectedSort = '';
    this.products = [...this.allProducts];
  }
}