import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { Content } from '../model/content';
import { Chapter } from '../model/chapter';

@Injectable({
  providedIn: 'root'
})
export class ChapterService {

  constructor(private afStorage: AngularFireStorage, private http: HttpClient) { }

  getImageUrl(path: string): Promise<string> {
    return this.pathToPromiseUrl('/image/' + path);
  }

  getAudioUrl(path: string): Promise<string> {
    return this.pathToPromiseUrl('/audio/' + path);
  }
  getChapterList(): Promise<Chapter[]> {
    const url = this.pathToPromiseUrl('/chapters.json');
    return this.promiseUrlToData(url);
  }

  getChapterById(id: string): Promise<Content[]> {
    const url = this.pathToPromiseUrl('/m' + id + '.json');
    return this.promiseUrlToData(url);
  }
  pathToPromiseUrl(path: string): Promise<any> {
    return this.afStorage.ref(path).getDownloadURL().toPromise();
  }
  promiseUrlToData(url: Promise<string>): Promise<any> {
    return url.then((data) => this.http.get(data).toPromise());
  }
}
