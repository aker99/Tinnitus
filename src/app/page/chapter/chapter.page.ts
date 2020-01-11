import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ChapterService } from 'src/app/services/chapter.service';
import { Content } from 'src/app/modals/content';
import { ContentType } from 'src/app/modals/contenttype';
import { Chapter } from 'src/app/modals/chapter';
import { database } from 'firebase';

@Component({
  selector: 'app-chapter',
  templateUrl: './chapter.page.html',
  styleUrls: ['./chapter.page.scss'],
})
export class ChapterPage implements OnInit {


  constructor(private chapterService: ChapterService, private route: Router, private curRoute: ActivatedRoute, private http: HttpClient) {

    this.chapterService.getChapterList()
    .then(data => {
      this.chapterList = data;
    });

    this.curRoute.paramMap
    .toPromise()
    .then(params => {
      this.id = params.get('id');
      this.chapter = Chapter.findByIdInArray(this.chapterList, this.id);
      this.index =  Chapter.findIndexInArray(this.chapterList, this.chapter.id);
      return this.id;
    })
    .then(data => this.chapterService.getChapterById(data))
    .then(data => this.contents = data);
  }

  protected chapterList: Chapter[];
  protected chapter: Chapter;
  protected contents: Content[];
  protected id: string;
  protected index: number;
  private audio: any;
  //protected chapter;
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

  async getImagePath(img: string): Promise<string> {
    return await this.chapterService.getImageUrl(img);
  }

  async getAudioPath(audio: string): Promise<string> {
    return await this.chapterService.getAudioUrl(audio);
  }
}


