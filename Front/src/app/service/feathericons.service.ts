import { Injectable } from '@angular/core';
import * as feather from 'feather-icons';

@Injectable({
  providedIn: 'root',
})
export class FeatherIconsService {
  constructor() {}

  replace() {
    feather.replace();
  }
}
