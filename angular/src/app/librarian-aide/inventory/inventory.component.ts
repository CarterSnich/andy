import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import Book from '../../book';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.css',
})
export class InventoryComponent implements OnInit {
  books: Book[] | undefined;
  isEditting: string = '';

  editTitleInput: string = '';
  editAuthorInput: string = '';
  editPublisherInput: string = '';
  editPriceInput: number = 0;

  addBookForm: FormGroup = this.formBuilder.group<Book>({
    title: '',
    author: '',
    price: 0,
    publisher: '',
  });

  constructor(
    private httpClient: HttpClient,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks() {
    this.httpClient
      .get<Book[]>('http://localhost:8000/api/books')
      .subscribe((books) => (this.books = books));
  }

  addBook() {
    this.httpClient
      .post('http://localhost:8000/api/books/add', this.addBookForm.value)
      .subscribe(() => {
        this.addBookForm.reset();
        this.getBooks();
      });
  }

  deleteBook(id: string | undefined) {
    if (id == undefined) return;
    this.httpClient
      .delete(`http://localhost:8000/api/books/${id}/delete`)
      .subscribe(() => {
        this.getBooks();
      });
  }

  clickEditBook(book: Book) {
    this.isEditting = <string>book.id;
    this.editTitleInput = book.title;
    this.editAuthorInput = book.author;
    this.editPublisherInput = book.publisher;
    this.editPriceInput = book.price;
  }

  clickDoneBook() {
    this.httpClient
      .put(`http://localhost:8000/api/books/${this.isEditting}/update`, {
        title: this.editTitleInput,
        author: this.editAuthorInput,
        publisher: this.editPublisherInput,
        price: this.editPriceInput,
      })
      .subscribe(() => {
        this.isEditting = '';
        this.getBooks();
      });
  }
}
