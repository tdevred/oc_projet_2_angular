import { Component, OnDestroy, OnInit } from '@angular/core';
import { filter, first, Observable, of, Subscription, tap } from 'rxjs';
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
export class HomeComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;

  isError: boolean;

  countries: OlympicCountry[] = [];

  chartData: PieChartData[] = [];
  view: [number, number] = [700, 400];

  stats!: { name: string, value: number }[];

  public olympics$: Observable<OlympicCountry[]> = of();

  constructor(private olympicService: OlympicService, private router: Router) {
    this.olympics$ = this.olympicService.getOlympics();
    this.countries = []
    this.chartData = []
    this.isError = false;
  }

  ngOnInit(): void {
    this.subscription = this.olympics$.pipe(filter(v => v.length > 0), first()).subscribe(
      v => {
        const ovs = v.map(c => ({
          "name": c.country,
          "value": c.participations.map(e => e.medalsCount)
            .reduce((a, b) => a + b, 0)
        }));

        this.countries = v;
        this.chartData = ovs;

        const allYears = v.flatMap(vv => vv.participations.map(vvv => vvv.year));
        const allUniqueYears = [... new Set(allYears)];

        this.stats = [
          { name: "Number of JOs", value: allUniqueYears.length },
          { name: "Number of countries", value: v.length }
        ]
      },
      _err => {
        this.isError = true;
      });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
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
