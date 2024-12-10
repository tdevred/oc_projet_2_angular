import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, tap } from 'rxjs';
import { OlympicCountry } from 'src/app/core/models/Olympic';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [NgxChartsModule],
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.scss'
})
export class DetailComponent implements OnInit {
  public id: number;
  public olympic: OlympicCountry | undefined;
  public data: any[];
  public view: [number, number] = [700, 300];

  public numberOfJOs!: number;
  public totalNumberOfMedals!: number;
  public totalNumberOfAthletes!: number;

  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';

  olympics$: Observable<OlympicCountry[]>;

  // mettre les ticks

  yScaleMin!: number;
  yScaleMax!: number;
  xScaleMax!: number;
  xScaleMin!: number;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {
    this.id = -1
    this.data = []
    
    this.olympics$ = this.olympicService.getOlympics()
  }

  ngOnInit(): void {
    this.id = Number.parseInt(this.route.snapshot.params['id']);
    console.log("init, id is", this.id)

    this.olympics$.subscribe(
      v => {
        console.log("value in detail")
        const found = v.find(c => c.id == this.id)
        if (!found) {
          //reroute
          console.error("No country found!")
          this.router.navigate([""])
          return
        }
        this.olympic = found;
        
        this.data = [{
          "name": found.country,
          "series": found.participations.map(p => ({ "name": p.year, "value": p.medalsCount }))
        }]

        this.numberOfJOs = found.participations.length;
        this.totalNumberOfAthletes = found.participations.map(p => p.athleteCount).reduce((a, b) => a + b, 0)
        
        const nbMedaillesParParticipation = found.participations.map(p => p.medalsCount)
        this.totalNumberOfMedals = nbMedaillesParParticipation.reduce((a, b) => a + b, 0)

        const datesJO = found.participations.map(p => p.year);
        this.xScaleMin = Math.min(...datesJO) - 4
        this.xScaleMax = Math.max(...datesJO) + 4

        this.yScaleMin = Math.min(...nbMedaillesParParticipation) - 5
        this.yScaleMax = Math.max(...nbMedaillesParParticipation) + 5
      })
    // this.olympicService.getOlympics().pipe(
    //   tap(v => {
    //     const found = v.find(c => c.id == this.id)
    //     if (!found) {
    //       //reroute
    //       throw new Error("No country found!")
    //     }
    //     this.olympic = found;
        
    //     this.data = [{
    //       "name": found.country,
    //       "series": found.participations.map(p => ({ "name": p.year, "value": p.medalsCount }))
    //     }]

    //     this.numberOfJOs = found.participations.length;
    //     this.totalNumberOfAthletes = found.participations.map(p => p.athleteCount).reduce((a, b) => a + b, 0)
    //     this.totalNumberOfMedals = found.participations.map(p => p.medalsCount).reduce((a, b) => a + b, 0)
    //   })
    // ).subscribe()
  }

  onSelect(data: any): void {
    console.log('Item clicked', JSON.parse(JSON.stringify(data)));
  }


  onActivate(data: any): void {
    console.log('Activate', JSON.parse(JSON.stringify(data)));
  }

  onDeactivate(data: any): void {
    console.log('Deactivate', JSON.parse(JSON.stringify(data)));
  }

  navigateToHome(): void {
    this.router.navigate([""])
  }

  xAxisTickFormatting(data: number): string {
    return `${data}`
  }

  yAxisTickFormatting(data: number): string {
    return `${data}`
  }
}
