import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css',
})
export class TransactionComponent implements OnInit {
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
