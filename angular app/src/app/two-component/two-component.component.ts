import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams,HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs'


let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTI0MzUxNTgsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTIzOTkxNTh9.PnJQxDfnPCI-108OJNd9A8arDKUEdvgbLcEjqwIOQ2c')
headers=headers.append('Content-Type','application/json');
@Component({
  selector: 'app-two-component',
  templateUrl: './two-component.component.html',
  styleUrls: ['./two-component.component.css']
})
export class TwoComponentComponent implements OnInit {

visibility:boolean=true;
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
    
    this.visibility=false;
   },error=>{

    console.log(`error in req ${error}`)
   });
    
  }

  downloadFile(key : string){
    let params = new HttpParams().append("Key",key)
    
this.http.get('http://localhost:4000/api/downloadfile',{responseType: 'arraybuffer',headers:headers,params:params}).subscribe(data=>{
  console.log(data);
  this.downLoadFile(data, "application/any")
},error=>{
  console.log(error)
})

  }
  downLoadFile(data: any, type: string) {
    var blob = new Blob([data], { type: type});
    var url = window.URL.createObjectURL(blob);
    var pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
        alert( 'Please disable your Pop-up blocker and try again.');
    }
}
  
//https://stackoverflow.com/questions/51682514/how-download-a-file-from-httpclient
}
