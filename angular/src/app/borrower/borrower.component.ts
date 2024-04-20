import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import Book from '../book';
import { AuthService } from '../shared/auth.service';
import { GenerateQrPipe } from './generate-qr.pipe';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, GenerateQrPipe],
  templateUrl: './borrower.component.html',
  styleUrl: './borrower.component.css',
})
export class BorrowerComponent implements OnInit {
  books: Book[] = [];

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

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

    this.getBooks();
  }

  getBooks() {
    this.httpClient
      .get<Book[]>('http://localhost:8000/api/books')
      .subscribe((books) => {
        this.books = books;
      });
  }

  onEnter(event: any) {
    event.target.children[0].classList.remove('d-none');
    event.target.children[1].classList.add('invisible');
  }

  onLeave(event: any) {
    event.target.children[0].classList.add('d-none');
    event.target.children[1].classList.remove('invisible');
  }

  logout() {
    this.authService.signout().subscribe({
      complete: () => {
        this.router.navigate(['']);
      },
    });
  }
}
