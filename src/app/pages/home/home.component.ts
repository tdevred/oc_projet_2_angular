import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

type PieChartData = {
  name: string, value: number
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public isError: boolean;

  public countries: OlympicCountry[] = [];

  public chartData$!: Observable<PieChartData[]>;
  
  public view: [number, number] = [700, 400];

  public stats!: { name: string, value: number }[];

  public olympics$: Observable<OlympicCountry[]> = of();


  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
    this.countries = []
    this.isError = false;
    this.chartData$ = of([]);
  }

  ngOnInit(): void {
    this.chartData$ = this.olympics$.pipe(tap(countries => {
      this.countries = countries;

      const allYears = countries.flatMap(vv => vv.participations.map(vvv => vvv.year));
      const allUniqueYears = [... new Set(allYears)];

      this.stats = [
        { name: "Number of JOs", value: allUniqueYears.length },
        { name: "Number of countries", value: countries.length }
      ]
    }), map(
      countries => countries.map(c => ({
        "name": c.country,
        "value": c.participations.map(e => e.medalsCount)
          .reduce((a, b) => a + b, 0)
      }))), catchError(err => {
        this.isError = true;
        return of([]);
      }));
  }

  onSelect(data: PieChartData): void {
    let id = this.countries.filter(v => v.country == data.name)[0].id;
    this.routeToDetail(id)
  }

  routeToDetail(id: number): void {
    this.router.navigate(['detail', id])
  }

  formatLabels(data: { data: PieChartData }): string {
    return `${data.data.name} <br/> ${data.data.value} 🏅`
  }
}
