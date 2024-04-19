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
    newAlert.classList.value = `alert alert-${type} alert-dismissible fade show`;
    newAlert.role = 'alert';
    newAlert.innerHTML = `
      ${message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    `;

    this.wrapper?.append(newAlert);
    setTimeout(() => {
      (<HTMLButtonElement>newAlert.childNodes[1]).click();
    }, 10000);
  }
}
