import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChapterService } from 'src/app/services/chapter.service';
import { Content } from 'src/app/model/content';
import { ContentType } from 'src/app/model/contenttype';
import { Chapter } from 'src/app/model/chapter';
import { promise } from 'protractor';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit {
  constructor(private chapterService: ChapterService,
              private route: Router,
              private currentRoute: ActivatedRoute,
              private http: HttpClient) {

     new Promise( (resolve, reject) => {
      const chapterList = JSON.parse(localStorage.getItem('chapterList'));
      if (chapterList !== null) {
        this.chapterList = chapterList;
        return resolve(this.chapterList);
      }
      this.chapterService.getChapterList()
      .then(data => {
        this.chapterList = data;
        localStorage.setItem('chapterList', JSON.stringify(data));
        return resolve(this.chapterList);
       })
       .catch( err => reject(err));
    })
    .then(() => {
      return new Promise((resolve) => {
        this.currentRoute.paramMap.subscribe((params) => {
          this.id = params.get('id');
          resolve(this.id);
        });
      });
    })
    .then(() => {
      this.chapter = Chapter.findByIdInArray(this.chapterList, this.id);
      this.index =  Chapter.findIndexInArray(this.chapterList, this.chapter.id);
      return this.id;
    })
    .then(() => {
      const chapterContent = JSON.parse(localStorage.getItem('m' + this.id));
      if (chapterContent !== null) {
        return { chapterContent, parsed: true };
      }
      return chapterService.getChapterById(this.id).then(chapterContent => ({chapterContent, parsed: false}));
    })
    .then(data => {
      if (data.parsed) {
        return data.chapterContent;
      }
      return this.urlparser(data.chapterContent);
    })
    .then((chapterContent) => {
      this.contents = chapterContent;
      localStorage.setItem('m' + this.id, JSON.stringify(this.contents));
    })
    .catch( err => console.log('err: ', err))
    .finally( () => {
      // console.log('ChapterList: ',this.chapterList,'Chapter: ',this.chapter,'Content:',this.contents);
    });
  }

  protected chapterList: Chapter[] = [];
  protected chapter: Chapter = new Chapter();
  protected contents: Content[] = [];
  protected id: string;
  protected index: number;
  private audio: any;

  ngOnInit() {
  }

  returnContentType(content: Content) {
    return content.type;
  }

  getContentType() {
    return ContentType;
  }

  returnPreviousModule() {
    this.route.navigate(['/chapter', this.chapterList[this.index - 1 ].id]);
  }

  returnNextModule() {
    this.route.navigate(['/chapter', this.chapterList[this.index + 1 ].id]);
  }

  returnModules() {
    this.route.navigate(['chapters']);
  }

  getImagePath(img: string) {
    return this.chapterService.getImageUrl(img);
  }

  getAudioPath(audio: string) {
    return this.chapterService.getAudioUrl(audio);
  }
  urlparser(contents: Content[]): Promise<Content[]> {
    const contentsNew: Content[] = [];
    const promiseArrayMain = [];
    contents.forEach( (content, index, array) => {

      const promiseArray = [];
      array[index].sub.forEach((sub, index, array) => {
        if (sub.type === ContentType.IMAGE) {
          promiseArray.push(
          this.getImagePath(sub.data)
          .then((data) => array[index].data = data));
        } else if (sub.type === ContentType.AUDIO) {
          promiseArray.push(
          this.getAudioPath(sub.data)
          .then((data) => array[index].data = data));
        }
      });
      promiseArrayMain.push(Promise.all(promiseArray));
    });
    return Promise.all(promiseArrayMain).then(() => {
      return contents;
    });
  }
}


