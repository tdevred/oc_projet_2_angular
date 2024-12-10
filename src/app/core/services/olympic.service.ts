import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  private olympicList: Array<OlympicCountry> = [];

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        console.log('value in service is', value)
        this.olympicList = value;
        this.olympics$.next(value)
      }),
      catchError((error, caught) => {
        // TODO: improve error handling
        console.error(error);
        console.log("something went wrong")
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.error('something bad happened')
        return caught;
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable();
  }

  getOlympic(id: number): OlympicCountry | undefined {
    console.log("id is", id, "is found", this.olympicList.map(c => c.id), this.olympicList.some(c => c.id == id))
    return this.olympicList.find(c => c.id == id)
  }
}
