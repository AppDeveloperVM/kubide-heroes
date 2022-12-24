import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap } from 'rxjs';
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

  constructor(private httpClient: HttpClient) { }

  getAllCharacters(page = 0): Observable<any> {
    return this.httpClient.get<Results>(`${this.url}/characters?${this.options}&offset=${page}`);
  }
  
  getCharacterInfo(character: string): Observable<Character[]> {
    return this.httpClient.get(`${this.url}/characters/${character}?${this.options}`)
    .pipe(
      tap(users => console.log('Character list retrieved!')),
      catchError(this.handleError<Character[]>('Get characters', []))
    );
  }

  getComicsOfCharacter(character: string): Observable<Comic[]> {
    return this.httpClient.get(`${this.url}/characters/${character}/comics?${this.options}`)
    .pipe(
      tap(users => console.log('Comics list retrieved!')),
      catchError(this.handleError<Character[]>('Get comics', []))
    );
  }

  getImage(thumbnail: ImageThumbnail, variant: ImageVariant = ImageVariant.full) {
    return thumbnail && `${thumbnail.path}/${variant}.${thumbnail.extension}`;
  }

  handleError<T>(arg0: string, arg1: undefined[]): (err: any, caught: Observable<unknown>) => import("rxjs").ObservableInput<any> {
    throw new Error('Method not implemented.');
  }

}
