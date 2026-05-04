import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Services } from './services/services';
import { Products } from './products/products';
import { Cart } from './cart/cart';
import { Lookbook } from './lookbook/lookbook';
import { Login } from './login/login';
import { Register } from './register/register';
import { Profile } from './profile/profile';
import { About } from './about/about';
import { Checkout } from './checkout/checkout';
import { AuthGuard } from './services/auth.guard'; 
import { History } from './history/history';

export const routes: Routes = [
  { path: '', component: Home },

  { path: 'products', component: Products },
  { path: 'services', component: Services },

  // 🔒 PROTECTED ROUTES
  { path: 'cart', component: Cart, canActivate: [AuthGuard] },
  { path: 'checkout', component: Checkout, canActivate: [AuthGuard] },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'history', component: History, canActivate: [AuthGuard] },

  // 🌐 PUBLIC ROUTES
  { path: 'lookbook', component: Lookbook },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'about', component: About },

  { path: '**', redirectTo: '' }
];