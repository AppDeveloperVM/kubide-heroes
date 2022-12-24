import { TestBed } from '@angular/core/testing';

import { MarvelAPIProviderService } from './marvel-apiprovider.service';

describe('MarvelAPIProviderService', () => {
  let service: MarvelAPIProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarvelAPIProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
