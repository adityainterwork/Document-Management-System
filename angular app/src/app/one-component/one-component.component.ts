import {
  Component,
  OnInit
} from '@angular/core';

import {
  FileUploader,
  FileSelectDirective
} from 'ng2-file-upload/ng2-file-upload';

const URL = 'http://localhost:4000/api/upload';


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1NTI2ODU4NTEsInVzZXJuYW1lIjoiSmltIiwib3JnTmFtZSI6Ik9yZzEiLCJpYXQiOjE1NTI2NDk4NTF9.Z36HxitVqdH8wRSZ3-ml496iBcV_r3BMtrWMryT-LLM'


@Component({
  selector: 'app-one-component',
  templateUrl: './one-component.component.html',
  styleUrls: ['./one-component.component.css']
})

export class OneComponentComponent implements OnInit {

  fileToUpload: File = null;
  public uploader: FileUploader = new FileUploader({
    url: URL,
    headers: [{
      name: 'authorization',
      value: 'Bearer ' + token
    }],
    itemAlias: 'file',
    maxFileSize: 5 * 1024 * 1024
  });


  ngOnInit() {
    this.uploader.onBeforeUploadItem = (file) => {

    }
    this.uploader.onAfterAddingFile = (file) => {

      file.withCredentials = false;
    };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      console.log('ImageUpload:uploaded:', item, status, response);
     
    };

  
  }

}
