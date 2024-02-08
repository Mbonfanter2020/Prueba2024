// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  name: 'dev',
  firebase:{
    Config : {
      apiKey: "AIzaSyDTU1L0cU9xQMIidw1xic93k2JTHqGBXhI",
      authDomain: "proyecto-inv-front.firebaseapp.com",
      projectId: "proyecto-inv-front",
      storageBucket: "proyecto-inv-front.appspot.com",
      messagingSenderId: "1057807888395",
      appId: "1:1057807888395:web:074dfba7b81ab7c2cb570e"
    }
  },
  url:'http://127.0.0.1:8000/',
  urlfront: 'http://localhost:5200/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
