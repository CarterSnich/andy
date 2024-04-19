import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { AlertComponent } from '../../alert/alert.component';
import { AuthService } from '../../shared/auth.service';
import User from '../../user';

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, AlertComponent],
  templateUrl: './account-management.component.html',
  styleUrl: './account-management.component.css',
})
export class AccountManagementComponent implements OnInit {
  @ViewChild(AlertComponent) alertComponent!: AlertComponent;

  users: User[] = [];
  addUserForm: FormGroup;
  editUserForm: FormGroup;
  currentEditUserIdNumber = '';
  searchQuery = new FormControl('');
  previousUrl: string | null = null;
  activationUser: User | undefined;

  constructor(
    private formBuilder: FormBuilder,
    private httpClient: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {
    this.addUserForm = this.formBuilder.group<User>({
      firstname: '',
      lastname: '',
      id_number: '',
      email: '',
      password: '',
      type: 'borrower',
      contact: '',
    });
    this.editUserForm = this.formBuilder.group<User>({
      firstname: '',
      lastname: '',
      id_number: '',
      email: '',
      password: '',
      type: '',
      contact: '',
    });
  }

  ngOnInit(): void {
    this.getUsers();
    this.authService.profileUser().subscribe({
      error: (err) => {
        if (err.status == 401) {
          this.router.navigate(['']);
          return;
        }

        console.error(err);
        this.alertComponent.addAlert('Failed to fetch user profile.', 'danger');
      },
    });
  }

  onSubmit(): void {
    console.log(this.addUserForm.value);
    this.httpClient
      .post('http://localhost:8000/api/users/add', this.addUserForm.value)
      .subscribe({
        complete: () => {
          this.addUserForm.reset();
          this.getUsers();
          this.alertComponent.addAlert('User added successfully.', 'success');
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to add user.${err_msg}`,
            'danger'
          );
        },
      });
  }

  searchUsers() {
    if (this.searchQuery.value) {
      this.httpClient
        .get<User[]>(
          `http://localhost:8000/api/users?query=${this.searchQuery.value}`
        )
        .subscribe({
          next: (users: User[]) => {
            this.users = users;
          },
          error: (err) => {
            console.error(err);

            let err_msg = '';
            if (err.error.message) {
              err_msg = ` ${err.error.message}`;
            }
            this.alertComponent.addAlert(
              `Failed to fetch users.${err_msg}`,
              'danger'
            );
          },
        });
    } else {
      this.getUsers();
    }
  }

  getUsers() {
    this.httpClient.get<User[]>('http://localhost:8000/api/users').subscribe({
      next: (users: User[]) => {
        this.users = users;
      },
      error: (err) => {
        console.error(err);

        let err_msg = '';
        if (err.error.message) {
          err_msg = ` ${err.error.message}`;
        }
        this.alertComponent.addAlert(
          `Failed to fetch users.${err_msg}`,
          'danger'
        );
      },
    });
  }

  editUserSubmit() {
    this.httpClient
      .put(
        `http://localhost:8000/api/users/${this.currentEditUserIdNumber}/update`,
        this.editUserForm.value
      )
      .subscribe({
        complete: () => {
          this.getUsers();
          this.alertComponent.addAlert('User updated successfully.', 'success');
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to update user.${err_msg}`,
            'danger'
          );
        },
      });
  }

  clickEditUser(id_number: string) {
    this.currentEditUserIdNumber = id_number;
    this.editUserForm = this.formBuilder.group(
      <User>this.users.find((user) => user.id_number === id_number)
    );
  }

  clickActivationUser() {
    this.httpClient
      .put(
        `http://localhost:8000/api/users/${this.activationUser?.id_number}/activation`,
        {
          activation: !this.activationUser?.is_deactivated,
        }
      )
      .subscribe({
        complete: () => {
          this.alertComponent.addAlert(
            `User ${
              !this.activationUser?.is_deactivated ? 'deactivated' : 'activated'
            } successfully.`,
            'success'
          );
          this.getUsers();
        },
        error: (err) => {
          console.error(err);

          let err_msg = '';
          if (err.error.message) {
            err_msg = ` ${err.error.message}`;
          }
          this.alertComponent.addAlert(
            `Failed to delete user.${err_msg}`,
            'danger'
          );
        },
      });
  }
}
