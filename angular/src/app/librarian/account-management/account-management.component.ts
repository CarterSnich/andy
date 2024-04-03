import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import User from '../../user';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
})
export class AccountManagementComponent implements OnInit {
  users: User[] = [];
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  currentEditUserIdNumber = '';
  searchQuery = new FormControl('');

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient
  ) {
    this.addUserForm = this.formBuilder.group({
      name: '',
      id_number: '',
      email: '',
      password: '',
      type: '',
      contact: '',
    });
    this.editUserForm = this.formBuilder.group({
      name: '',
      id_number: '',
      email: '',
      password: '',
      type: '',
      contact: '',
    });
  }

  ngOnInit(): void {
    this.getUsers();
  }

  onSubmit(): void {
    this.httpClient
      .post('http://localhost:8000/api/users/add', this.addUserForm.value)
      .subscribe({
        next: (result) => console.log(result),
        complete: () => {
          this.addUserForm.reset();
          this.getUsers();
        },
        error: (error) => console.error(error),
      });
  }

  deleteUser(id_number: string) {
    this.httpClient
      .delete(`http://localhost:8000/api/users/${id_number}/delete`)
      .subscribe({ complete: () => this.getUsers() });
  }

  searchUsers() {
    if (this.searchQuery.value) {
      this.httpClient
        .get<User[]>(
          `http://localhost:8000/api/users?query=${this.searchQuery.value}`
        )
        .subscribe((users) => {
          this.users = users;
          console.log(this.users);
        });
    } else {
      this.getUsers();
    }
  }

  getUsers() {
    this.httpClient
      .get<User[]>('http://localhost:8000/api/users')
      .subscribe((users) => {
        this.users = users;
        console.log(this.users);
      });
  }

  editUserSubmit() {
    this.httpClient
      .put(
        `http://localhost:8000/api/users/${this.currentEditUserIdNumber}/update`,
        this.editUserForm.value
      )
      .subscribe({ complete: () => this.getUsers() });
  }

  clickEditUser(id_number: string) {
    this.currentEditUserIdNumber = id_number;
    this.editUserForm = this.formBuilder.group(
      <User>this.users.find((user) => user.id_number === id_number)
    );
  }
}
