import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-read-file',
  templateUrl: './read-file.component.html',
  styleUrls: ['./read-file.component.css']
})
export class ReadFileComponent implements OnInit {

  file: any;
  fileUrl: any;
  params: string[] = [];
  inst1:string = '';
  inst2:string = '';
  msg:string ='';
  stringLengths: string[] = [];
  generateFile:boolean = false;
  downloadableFile = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
  }

  obtainParamsFromFile = (e:any) => {
    this.file = e.target.files[0];

    let fileReader = new FileReader();

    let m1=0;
    let m2=0;
    let n=0;

    fileReader.onload = (e) => {
      this.params = fileReader.result!.toString().split(/[\r\n]+/g);
    }
    fileReader.readAsText(this.file);

    fileReader.onloadend = (i) => {
        this.stringLengths = this.params[0].split(' ');

        this.inst1 = this.params[1];
        this.inst2 = this.params[2];
        this.msg = this.params[3];

        m1 = parseInt(this.stringLengths[0]);
        m2 = parseInt(this.stringLengths[1]);
        n = parseInt(this.stringLengths[2]);

        console.log(n)
        if( (n>=3 && n<=5000) && (m1>=2 && m1<=50) && (m2>=2 && m2<=50) )
        {
          this.reviewingMessage();

          this.downloadableFile = true;
        }
        else
        {
          Swal.fire({
            title: '¡Error!',
            text: 'El numero de caracteres de mensaje debe estar entre 3 y 5000, el numero de instrucciones debe estar entre 2 y 50 ',
            icon: 'error',
            confirmButtonText: 'Cool'
          })
          return;
        }
        e.target.value = "";
    }
  }

  reviewingMessage = () =>{
    
    let stringToAnalize = this.msg;
    stringToAnalize = stringToAnalize.replace(/(.)\1+/gmi, "$1");
    let inst1IsPresent = false;
    let inst2IsPresent = false;

    inst1IsPresent = this.existsInstruction(stringToAnalize, 1);
    inst2IsPresent = this.existsInstruction(stringToAnalize, 2);
    
    this.generateDownloableFile(inst1IsPresent, inst2IsPresent);
  }

  existsInstruction = (stringToAnalize:string, instruction:number) =>{

    return instruction == 1? stringToAnalize.includes(this.inst1) : stringToAnalize.includes(this.inst2);
  }

  generateDownloableFile = (inst1:boolean, inst2:boolean) =>{

    this.generateFile = true;

    let outputInfo = `${inst1? 'SI' : 'NO'} ${inst2? 'SI' : 'NO'}`;
    
    const blob = new Blob([outputInfo], { type: 'application/octet-stream' });

    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  checkIfDownloadableFileExists = () =>{
    if(!this.downloadableFile)
    {
      return;
    }
    this.downloadableFile = false;
  }

}
