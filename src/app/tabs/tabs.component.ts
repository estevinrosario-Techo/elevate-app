import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule, IonicModule, RouterModule],
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
})
export class TabsComponent {
  constructor(public router: Router) {}

  go(tab: string) {
    this.router.navigate(['/tabs/' + tab]);
  }

  isActive(tab: string): boolean {
    return this.router.url.includes('/tabs/' + tab);
  }
}
