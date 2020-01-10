import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChaptersPage } from './chapters.page';

describe('ChaptersPage', () => {
  let component: ChaptersPage;
  let fixture: ComponentFixture<ChaptersPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaptersPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChaptersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
