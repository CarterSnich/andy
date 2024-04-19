import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-lost-and-damage',
  standalone: true,
  imports: [],
  templateUrl: './lost-and-damage.component.html',
  styleUrl: './lost-and-damage.component.css',
})
export class LostAndDamageComponent implements OnInit {
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe({
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['']);
          return;
        }
        console.error(err);
      },
    });
  }
}
