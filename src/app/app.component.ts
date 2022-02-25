import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'frontend';
  intro: boolean = true
  valueBar: number = 0

  ngOnInit(): void {
    this.showIntro()
    
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


  showIntro(): void{
    const haveIntro = localStorage.getItem('intro')
    localStorage.removeItem('intro')
    if(haveIntro === null) {
     
     let interval = setInterval(() => {
        this.valueBar +=1 
        if(this.valueBar == 100) {
          window.clearInterval(interval)
          this.intro = false
        }
      }, 40)
      
    } 
    else {
      this.intro = false
    }
      
  }
  
}
