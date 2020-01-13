import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChapterService } from 'src/app/services/chapter.service';
import { Content } from 'src/app/model/content';
import { ContentType } from 'src/app/model/contenttype';
import { Chapter } from 'src/app/model/chapter';
import { promise } from 'protractor';
import { IonContent } from '@ionic/angular';
import { Bookmark } from 'src/app/model/bookmark';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit, AfterViewInit {
  constructor(private chapterService: ChapterService,
              private route: Router,
              private currentRoute: ActivatedRoute,
              private http: HttpClient) {
  }

  @ViewChild(IonContent, {static: false}) ionContent: IonContent;
  protected chapterList: Chapter[] = [];
  protected chapter: Chapter = new Chapter();
  protected contents: Content[] = [];
  protected id: string;
  protected index: number;
  private audio: any;

  ngOnInit() {
    new Promise( (resolve, reject) => {
      const chapterList = JSON.parse(localStorage.getItem('chapterList'));
      console.log('chapterList',this.chapterList);
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
      return this.chapterService.getChapterById(this.id).then(chapterContent => ({chapterContent, parsed: false}));
    })
    .then(data => {
      if (data.parsed) {
        return data.chapterContent;
      }
      this.contents = data.chapterContent;
      return this.urlparser(data.chapterContent);
    })
    .then((chapterContent) => {
      this.contents = chapterContent;
      localStorage.setItem('m' + this.id, JSON.stringify(this.contents));
    })
    .catch( err => console.log('err: ', err))
    .finally( () => {
    });
  }

  ngAfterViewInit() {
    this.currentRoute.paramMap.subscribe(params => {
      this.id = params.get('id');
      this.checkBookmark();
    });
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
  checkBookmark() {
    const bookmark: Bookmark = JSON.parse(localStorage.getItem('bookmark'));
    console.log('Bookmark Check-1:',bookmark);
    if (bookmark !== null && bookmark.id === this.id) {
      console.log('Bookmark Check-2-y:',bookmark.y);
      this.ionContent.scrollToPoint(bookmark.x, bookmark.y, 2000);
    } else {
      console.log('Bookmark Check-2-id:',this.id);
      this.logScrollEnd();
    }
  }
  logScrollEnd() {
    console.log('logScrollEnd:');
    this.ionContent.getScrollElement().then( data => {
      const bookmark: Bookmark = { id: this.id, x: data.scrollWidth, y: data.scrollTop};
      console.log('Bookmark', bookmark);
      localStorage.setItem('bookmark', JSON.stringify(bookmark));
    });
  }
}


