import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
})
export class AlertComponent implements OnInit {
  wrapper: HTMLElement | null = null;

  ngOnInit(): void {
    this.wrapper = document.getElementById('alert-wrapper');
  }

  addAlert(message: string, type: string) {
    const newAlert = document.createElement('div');
    newAlert.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="alert"
          aria-label="Close"
        ></button>
      </div>`;

    this.wrapper?.append(newAlert);
  }
}
