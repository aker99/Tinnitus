import { Component, OnInit } from '@angular/core';
import { Chapter } from 'src/app/model/chapter';
import { ChapterService } from 'src/app/services/chapter.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Bookmark } from 'src/app/model/bookmark';
import { url } from 'inspector';

@Component({
  selector: 'app-chapters',
  templateUrl: './chapters.page.html',
  styleUrls: ['./chapters.page.scss'],
})
export class ChaptersPage implements OnInit {

  constructor(private chapterService: ChapterService, private route: Router) {
  }

  protected chapterList: Chapter[];
  protected bookmarkChapter: Chapter;
  ngOnInit() {
    this.chapterList = JSON.parse(localStorage.getItem('chapterList'));
    if (this.chapterList === null) {
      this.chapterService.getChapterList()
      .then((data) => {
        this.chapterList = data;
        localStorage.setItem('chapterList', JSON.stringify(data));
      })
      .catch((err) => console.log('err', err));
    }
    this.route.events.subscribe((data) => {
      if (this.route.isActive('/chapters', true)) {
        this.updateBookmark();
      }
    });
  }

  openChapter(chapter: Chapter) {
    const uri = 'chapter/' + chapter.id;
    this.route.navigate([uri]);
  }

  updateBookmark() {
    const bookmark: Bookmark = JSON.parse(localStorage.getItem('bookmark'));
    console.log('Check1-Bookmark: ', bookmark);
    if (bookmark !== null && this.chapterList !== null) {
      this.bookmarkChapter = Chapter.findByIdInArray(this.chapterList, bookmark.id);
      console.log('Check1-1-this.Bookmark: ', this.bookmarkChapter);
    }
  }
}
