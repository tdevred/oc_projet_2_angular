import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, filter, first, map, tap } from 'rxjs/operators';
import { OlympicCountry } from '../models/Olympic';

@Injectable({
  providedIn: 'root',
})
export class OlympicService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<OlympicCountry[]>([]);

  constructor(private http: HttpClient) { }

  loadInitialData() {
    return this.http.get<OlympicCountry[]>(this.olympicUrl).pipe(
      tap((value) => {
        this.olympics$.next(value)
      }),
      catchError((error, caught) => {
        console.error(error);
        // can be useful to end loading state and let the user know something went wrong
        this.olympics$.error('something bad happened')
        return caught;
      })
    );
  }

  getOlympics(): Observable<OlympicCountry[]> {
    return this.olympics$.asObservable().pipe(filter(v => v.length > 0), first());
  }

  getOlympicById(id: number): Observable<OlympicCountry> {
    return this.olympics$.asObservable().pipe(filter(v => v.length > 0), first(), map(
      (v) => {
        const found = v.find(c => c.id == id)
        if (!found) {
          throw new Error("not found")
        }
        return found;
      }))
  }
}
