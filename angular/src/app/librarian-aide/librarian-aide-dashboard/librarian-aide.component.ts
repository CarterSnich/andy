import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-librarian-aide',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './librarian-aide.component.html',
  styleUrl: './librarian-aide.component.css',
})
export class LibrarianAideComponent implements OnInit {
  user: User | undefined;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.profileUser().subscribe((user) => (this.user = user));
  }
}
