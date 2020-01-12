import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/model/chapter';
import { ChapterService } from 'src/app/services/chapter.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {

  constructor(private chapterService: ChapterService, private route: Router) {
    this.chapterList = JSON.parse(localStorage.getItem('chapterList'));
    if (this.chapterList === null) {
      this.chapterService.getChapterList()
      .then((data) => {
        this.chapterList = data;
        localStorage.setItem('chapterList', JSON.stringify(data));
      })
      .catch((err) => console.log('err', err));
    }
  }

  protected chapterList: Chapter[];
  ngOnInit() {

  }

  openChapter(chapter: Chapter) {
    const uri = 'chapter/' + chapter.id;
    this.route.navigate([uri]);
  }
}
