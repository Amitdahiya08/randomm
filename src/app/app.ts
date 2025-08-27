import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  template: `<router-outlet />`,
  styleUrl: './app.scss'
})
export class App {
  // protected readonly title = signal('huangular2022');
}
