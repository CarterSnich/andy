import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import Book from '../book';
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

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
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
}
