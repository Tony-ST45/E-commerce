import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Navbar } from "./navbar/navbar";
import { Home } from "./home/home";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  imports: [Navbar, FormsModule, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('E-Commerce');
}
