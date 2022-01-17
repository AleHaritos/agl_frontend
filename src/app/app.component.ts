import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'
import { getAnalytics } from "firebase/analytics";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';

  ngOnInit(): void {

    const firebaseConfig = {
      apiKey: "AIzaSyDe1uRFfDo2bf2p09T8oIIZ4cjDFTFKp2k",
      authDomain: "agl-e-commerce.firebaseapp.com",
      projectId: "agl-e-commerce",
      storageBucket: "agl-e-commerce.appspot.com",
      messagingSenderId: "194581941646",
      appId: "1:194581941646:web:6606da4e481d88d2eca8df",
      measurementId: "G-Z9B1PJJWKF"
    };


     firebase.initializeApp(firebaseConfig)
  //  const getAnalitic = getAnalytics(app)
  }

  
}
