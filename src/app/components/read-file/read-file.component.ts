import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

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
  generateFile:boolean = false;

  constructor(private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    
  }

  obtainParamsFromFile = (e:any) => {
    this.file = e.target.files[0];

    let fileReader = new FileReader();

    fileReader.onload = (e) => {
      this.params = fileReader.result!.toString().split(/[\r\n]+/g);
    }
    fileReader.readAsText(this.file);

    fileReader.onloadend = (i) => {

        this.inst1 = this.params[1];
        this.inst2 = this.params[2];
        this.msg = this.params[3];
        this.reviewingMessage();

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

}
