import { Component, OnInit } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Participation } from 'src/app/core/models/Participation';
import { OlympicCountry, OlympicResume } from 'src/app/core/models/Olympic';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  countries: OlympicCountry[] = [];

  single: any[] = [];
  view: [number, number] = [700, 400]; // TODO à modifier quand l'écran est modifié

  gradient: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;

  numberOfCountries!: number;
  numberOfJOs!: number;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  public olympics$: Observable<OlympicCountry[]> = of();

  constructor(private olympicService: OlympicService, private router: Router) {
    console.log("hello")
    this.olympics$ = this.olympicService.getOlympics();
    this.countries = []
    this.single = []
  }

  ngOnInit(): void {
    console.log("home init called")
    console.log("single is", this.single)

    this.olympics$.subscribe(
      v => {
        console.log(v)
        this.single = [{ "name": "test", "value": 3000 }]

        console.log("value is", v)

        const ovs = v.map(c => ({
          "name": c.country,
          "value": c.participations.map(e => e.medalsCount)
            .reduce((a, b) => a + b, 0)
        }));

        console.log("object value is", ovs)

        this.countries = v;
        this.single = ovs;

        this.numberOfCountries = v.length

        const allYears = v.flatMap(vv => vv.participations.map(vvv => vvv.year));
        const allUniqueYears = [... new Set(allYears)];

        this.numberOfJOs = allUniqueYears.length
      });
    // register olympics and once completed, submit this.single value

    // this.single = [{"name": "test", "value": 3000}]

    // this.olympics$.pipe(tap(v => {
    //   console.log("tapped", v)

    // })).subscribe()
    // this.olympics$.pipe(
    //   tap(e => {
    //     console.log(e);
    //     this.olympicsMapped.push({
    //         name: e!.country,
    //         value: e!.participations
    //           .map((e: { medalsCount: any; }) => e.medalsCount)
    //           .reduce((a, b) => { a + b })
    //       })
    //   })
    // )
  }

  onSelect(data: { name: string, value: string }): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
    // route to item

    let id = this.countries.filter(v => v.country == data.name)[0].id;
    this.routeTo(id)
  }

  routeTo(id: number): void {
    console.log("routing to path", id, "!")
    this.router.navigate(['detail', id])
  }

  onActivate(data: any): void {
    // console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    // console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  formatLabels(data: { data: { name: string, value: number } }): string {
    return `${data.data.name} <br/> ${data.data.value} 🏅`
  }
}
