import { Component, Input, OnChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-barras',
  standalone: true,
  imports: [],
  templateUrl: './grafico-barras.component.html',
  styleUrl: './grafico-barras.component.css',
})
export class GraficoBarrasComponent implements OnChanges, AfterViewInit {
  @Input() etiquetas: string[] = [];
  @Input() valores: number[] = [];
  @Input() etiquetaSerie = 'Datos';

  @ViewChild('canvasRef') canvasRef!: ElementRef<HTMLCanvasElement>;
  private chart?: Chart;
  private vistaLista = false;

  ngAfterViewInit(): void {
    this.vistaLista = true;
    this.dibujar();
  }

  ngOnChanges(): void {
    if (this.vistaLista) {
      this.dibujar();
    }
  }

  private dibujar(): void {
    if (!this.canvasRef || this.etiquetas.length === 0) return;

    this.chart?.destroy();

    this.chart = new Chart(this.canvasRef.nativeElement, {
      type: 'bar',
      data: {
        labels: this.etiquetas,
        datasets: [
          {
            label: this.etiquetaSerie,
            data: this.valores,
            backgroundColor: '#d4ff3d',
            borderRadius: 4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: { color: '#8b8b8b', stepSize: 1 },
            grid: { color: '#3d3d3d' },
          },
          x: {
            ticks: { color: '#8b8b8b' },
            grid: { display: false },
          },
        },
      },
    });
  }
}