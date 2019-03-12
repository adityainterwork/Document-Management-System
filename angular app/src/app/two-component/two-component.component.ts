import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTI0MDEzNDAsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTIzNjUzNDB9.CeXuTYYTFVMawZlJVbEUi2yinffxRnrNwXSmzhzC4MA')
headers=headers.append('Content-Type','application/json');
@Component({
  selector: 'app-two-component',
  templateUrl: './two-component.component.html',
  styleUrls: ['./two-component.component.css']
})
export class TwoComponentComponent implements OnInit {


  documents:any;

data= {
    "peers": ["peer0.org1.example.com","peer0.org2.example.com"],
    "fcn":"queryDocumentByOwner",
    "args":["Aditya"]
  }
  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.callServer()
  }

  callServer() {
    let request = this.http.post( 'http://localhost:4000/api/alldocuments', this.data, {
      headers: headers
   });
   request.subscribe(data=>{
    this.documents=data
    console.log(data);
   },error=>{

    console.log(`error in req ${error}`)
   });
    
  }

}
