import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


const  token="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTIwNzc4OTEsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTIwNDE4OTF9.ix-hiM6j7l6TuAL5B3JaZnh8HFN6YDFwpd6z9QsQfYk"
const URL = 'http://localhost:4000/api/alldocuments';


@Component({
  selector: 'app-two-component',
  templateUrl: './two-component.component.html',
  styleUrls: ['./two-component.component.css']
})
export class TwoComponentComponent implements OnInit {

data=
  {
    "peers": ["peer0.org1.example.com","peer0.org2.example.com"],
    "fcn":"queryDocumentByOwner",
    "args":["Aditya"]
  }
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.callServer()
  }

  callServer() {
    // const headers = new HttpHeaders()
    //       .set('Authorization', "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTIwNzc4OTEsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTIwNDE4OTF9.ix-hiM6j7l6TuAL5B3JaZnh8HFN6YDFwpd6z9QsQfYk")
    //       .set('Content-Type', 'application/json');

    this.http.get(URL)
    .subscribe(data => {
      console.log(data);
    });
  }

}
