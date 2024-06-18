import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {
  constructor() {}

  hideSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.display = 'none';
    }
  }

  showSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.display = 'block';
    }
  }

  // Method to handle the sidebar after the component initialization
  initializeSidebar(visible: boolean) {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      sidebar.style.display = visible ? 'block' : 'none';
    }
  }
}
