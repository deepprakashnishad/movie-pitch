import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from './loader';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<LoaderState>();
	loaderState = this.loaderSubject.asObservable();

	constructor() { }

	show(message: string = "Loading...") {
    this.loaderSubject.next(<LoaderState>{ show: true, "message": message});
	}

	hide() {
	    this.loaderSubject.next(<LoaderState>{ show: false, "message": "Loading..."});
	}

}
