// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  marvelAPI: {
    endpointURL: 'http://gateway.marvel.com/v1/public',
    publicKey: '7bd7fa347868d4f3a81c481b28ed379c',
    privateKey: '3ed8b89d8792486960af0d36c0c4485898c50f4c',
    hash: 'cf222b322cd704d652ea62d4a225cd76',
    ts: '1000'
  },
  production: false
};

export const firebaseConfig = {
  projectId: 'kubide-heroes',
  appId: '1:833258792063:web:2c8b37d6219722cba20b4a',
  storageBucket: 'kubide-heroes.appspot.com',
  locationId: 'europe-west',
  apiKey: 'AIzaSyC4XTjWsGD4FpmiAnzXCeatVmQxazNSg5Y',
  authDomain: 'kubide-heroes.firebaseapp.com',
  messagingSenderId: '833258792063',
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
