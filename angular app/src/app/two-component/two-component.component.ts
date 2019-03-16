import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders ,HttpParams,HttpRequest} from '@angular/common/http';
import { saveAs } from 'file-saver'

let headers: HttpHeaders = new HttpHeaders();
headers = headers.append('authorization','Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTI3ODIwNzMsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTI3NDYwNzN9.zT6ibmBwLw7FvDMU0_MJq_QkyntsOdlpo_h4jt2PylY')
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

  file_type :string
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

  fileDownload(key : string, mimeType: string){
    let params = new HttpParams().append("Key",key)
    
  this.http.get('http://localhost:4000/api/downloadfile',{responseType: 'blob',headers:headers,params:params}).subscribe(data=>{
      var blob = new Blob([data], { type: mimeType})
      saveAs(blob, key);
    },error=>{
      console.log(error)
    })
  }
  divval:boolean=true
  getAllVersion(key :string,index:any){
    console.log(`clicked ${index}`)
    
    this.divval=false
  }
}
