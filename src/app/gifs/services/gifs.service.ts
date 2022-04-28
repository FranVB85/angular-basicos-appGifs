import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SearchGifsResponse, Gif } from '../interface/gifs.interface';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'lKMNMG2AZCF7d9QXo6EtnvRcvAkCPhHS';
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';
  
  private _historial: string[] = [];
  //TODO: Cambiar any por su tipo 
  public resultados: Gif[] = [];

  get historial(){
    //Se puede hacer return this.historial; pero se hace así para romper la referencia
    return [...this._historial];
  }

  constructor( private http: HttpClient){

    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];

    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];
    // if(localStorage.getItem('historial')){
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }

  }

  buscarGifs( query: string){

    query = query.trim().toLocaleLowerCase();
    //Para insertar al inicio unshift
    
    if(!this._historial.includes( query )){
      this._historial.unshift( query );
      this._historial = this._historial.splice(0,10);

      //Par grabar de manera local los titulos, enviar (set)
      localStorage.setItem('historial', JSON.stringify(this._historial));
    }
    const params = new HttpParams()
      .set('apiKey', this.apiKey)
      .set('limit', '10')
      .set('q', query);
      
    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe( (resp  ) => {
        this.resultados = resp.data;
        //Para grabar de manera local las imagenes, enviar una vez obtenidos los resultados (set)
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }


}
