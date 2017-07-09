import firebase from 'firebase'
export const LOGIN_ENDPOINT = BASE_URL+'user/login'
export const SIGNUP_ENDPOINT = BASE_URL+'user/signup'

 var config = {
    apiKey: "AIzaSyD-5NICLbMCb3907DY0-gtqVhZ50LZjHAk",
    authDomain: "ticketlynx-5a17f.firebaseapp.com",
    databaseURL: "https://ticketlynx-5a17f.firebaseio.com",
    projectId: "ticketlynx-5a17f",
    storageBucket: "ticketlynx-5a17f.appspot.com",
    messagingSenderId: "1033841643849"
  };
firebase.initializeApp(config);
const BASE_URL = 'http://localhost:5001/'
global.Promise = require('bluebird')
console.log('config running')
export const reportRef = firebase.database().ref('reports')
export const onSaleRef = firebase.database().ref('onSale')
export const workRef = firebase.database().ref('work-to-do')
export const artistRef = firebase.database().ref('artists')
export const queryRef = firebase.database().ref('queries')
export const albumRef = firebase.database().ref('albums')
export const codeBankRef = firebase.database().ref('codeBank')
export const scoresRef = firebase.database().ref('scores')
export const topCitiesRef = firebase.database().ref('top-cities')
export const topCountriesRef = firebase.database().ref('top-countries')
export const pollstarRef = firebase.database().ref('pollstarData')