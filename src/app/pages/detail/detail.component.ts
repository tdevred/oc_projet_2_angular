import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { filter, first, Observable, Subscription, tap } from 'rxjs';
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
export class DetailComponent implements OnInit, OnDestroy {
  public id: number;
  public olympic: OlympicCountry | undefined;
  public data: { name: string, series: { name: number, value: number }[] }[];
  public view: [number, number] = [700, 300];

  public numberOfJOs!: number;
  public totalNumberOfMedals!: number;
  public totalNumberOfAthletes!: number;

  private subscription!: Subscription;

  olympics$: Observable<OlympicCountry[]>;

  // mettre les ticks

  yScaleMin!: number;
  yScaleMax!: number;
  xScaleMax!: number;
  xScaleMin!: number;

  isError: boolean;

  constructor(private olympicService: OlympicService, private route: ActivatedRoute, private router: Router) {
    this.id = -1
    this.data = []

    this.olympics$ = this.olympicService.getOlympics()
    this.isError = false;
  }

  ngOnInit(): void {
    this.id = Number.parseInt(this.route.snapshot.params['id']);

    this.subscription = this.olympicService.getOlympicById(this.id).subscribe(
      (found) => {
        this.olympic = found;

        this.data = [{
          name: found.country,
          series: found.participations.map(p => ({ "name": p.year, "value": p.medalsCount }))
        }]

        this.numberOfJOs = found.participations.length;
        this.totalNumberOfAthletes = found.participations.map(p => p.athleteCount).reduce((a, b) => a + b, 0)

        const nbMedaillesParParticipation = found.participations.map(p => p.medalsCount)
        this.totalNumberOfMedals = nbMedaillesParParticipation.reduce((a, b) => a + b, 0)

        const datesJO = found.participations.map(p => p.year);

        this.computeScale(datesJO, nbMedaillesParParticipation);
      },
      _err => {
        this.isError = true;
      })
  }

  /**
   * Ajuste l'échelle du graphique 
   * */ 
  computeScale(datesJO: number[], nbMedaillesParParticipation: number[]) {
    
    this.xScaleMin = Math.min(...datesJO) - 4
    this.xScaleMax = Math.max(...datesJO) + 4

    this.yScaleMin = Math.min(...nbMedaillesParParticipation) - 5
    this.yScaleMax = Math.max(...nbMedaillesParParticipation) + 5
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
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
