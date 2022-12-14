import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  // Nueva caracteristica: los servicios estan definidos en el momento en que se contruye la app
  providedIn: 'root',
})
export class GifsService {
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  private apiKey: string = 'mpAnt0GBKoUyFdfCtXYsmLEOkKUyypAz';
  private _historial: string[] = [];

  public resultados: Gif[] = []; 

  get historial(): string[] {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultado')!) || [];
  }

  buscarGifs(query: string): void {
    query = query.trim().toLowerCase();

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http
      .get<SearchGifsResponse>(
        `${this.servicioUrl}/search`, {params}
      )
      .subscribe((response) => {
        this.resultados = response.data;
        localStorage.setItem('resultado', JSON.stringify(this.resultados));
      });
    
  }
}
