export const environment = {
  production: false,
  maintenanceMode:false,
  //local
  // domain: "https://placement.careerhive.com.au/",
  SERVER: "http://localhost:4000/",
  SERVER_URL: "http://localhost:4000/",

  // dev
  // domain: "https://placement.careerhive.com.au/",
  // SERVER: "https://placementapi.careerhive.com.au/",
  // SERVER_URL: "https://placementapi.careerhive.com.au/",
  
  // prod
  // domain: "https://eca.careerhive.com.au/",
  // SERVER: "https://apieca.careerhive.com.au/",
  // SERVER_URL: "https://apieca.careerhive.com.au/",

  // Testing
  domain: "https://testing1.topgradsacademy.com/",
  // SERVER: "https://testing1api.topgradsacademy.com/",
  // SERVER_URL: "https://testing1api.topgradsacademy.com/",

  tinyMCEApiKey: "zcwi1f81304uers1lcszh0iq2lbhcaxl5cj6ez0v89wr25z3",

  auth: {
     domain:"dev-umqd3dpikeuan3n0.au.auth0.com",
    //  clientId:"CMgNh0maUKpBDgjoH21p5puaR0TTuzBV",
     clientId:"0oap49exyaS1qLYAh1d7",
     // ...(audience && audience !== "{yourApiIdentifier}" ? { audience } : null),
    //  redirectUri: window.location.origin+'/login/callback',
     redirectUri: 'https://monash.careerhive.com.au/login/callback',
     errorPath:"/error",
     scopes: ["openid",
      "profile",
      "email",
      "address",
      "phone",
      "offline_access",
      "device_sso"],
     issuer: 'https://loginanyoneqa3.monash.edu/oauth2/default',
     pkce: true,
      tokenManager: { storage: 'localStorage' } 
   },

  okta: {
    issuer: 'https://loginanyoneqa3.monash.edu/oauth2/default',
    clientId: '0oap49exyaS1qLYAh1d7',
    redirectUri: 'https://monash.careerhive.com.au/login/callback',
    postLogoutRedirectUri: 'https://monash.careerhive.com.au/',
    scopes: ['openid', 'profile', 'email'],
    responseType: 'code',  // use PKCE flow
  },

   httpInterceptor: {
     allowedList: [`https://monash.careerhive.com.au/*`],
   },
};
