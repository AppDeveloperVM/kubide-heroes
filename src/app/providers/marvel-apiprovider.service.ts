import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Character } from '../models/Character.model';
import { Comic } from '../models/Comic.model';
import { ImageThumbnail, ImageVariant } from '../models/Image.model';

export interface Results {
  offset: number;
  limit: number;
  total: number;
  count: number;
  results: any[];
}

@Injectable({
  providedIn: 'root'
})
export class MarvelAPIProviderService {
  url = environment.marvelAPI.endpointURL;
  ts = environment.marvelAPI.ts;
  publickey = environment.marvelAPI.publicKey;
  hash = environment.marvelAPI.hash;
  options = `ts=${this.ts}&apikey=${this.publickey}&hash=${this.hash}`;

  private CharactersResults  = new BehaviorSubject<any[]>([]);
  CharactersResults$ : Observable<any[]> = this.CharactersResults.asObservable();
  chars = [];

  constructor(private httpClient: HttpClient) {
    
  }

  getAllCharacters(page = 0, extraParams : string = '') : Observable<any> {
    return this.httpClient.get<Results>(`${this.url}/characters?${extraParams}${this.options}&offset=${page}`);  
  }

  getCharacters(page?, extraParams?) : Observable<any[]>{
    this.getAllCharacters(page, extraParams)
    .pipe(
      map( (res) => res.data.results )
    ).subscribe((res) =>
      this.CharactersResults.next(res)
    );

    return this.CharactersResults$;
  }
  
  getCharacterInfo(character: string): Observable<Character[]> {
    return this.httpClient.get(`${this.url}/characters/${character}?${this.options}`)
    .pipe(
      tap(users => console.log('Character list retrieved!')),
      catchError(this.handleError<Character[]>('Get characters', []))
    );
  }

  getComicsOfCharacter(character: string): Observable<any> {
    return this.httpClient.get<Results>(`${this.url}/characters/${character}/comics?limit=5&${this.options}`);
  }

  getImage(thumbnail: ImageThumbnail, variant: ImageVariant = ImageVariant.full) {
    return thumbnail && `${thumbnail.path}/${variant}.${thumbnail.extension}`;
  }

  handleError<T>(arg0: string, arg1: undefined[]): (err: any, caught: Observable<unknown>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }

}
