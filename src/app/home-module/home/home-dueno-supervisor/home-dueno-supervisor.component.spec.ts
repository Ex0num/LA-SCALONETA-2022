import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { HomeDuenoSupervisorComponent } from './home-dueno-supervisor.component';

describe('HomeDuenoSupervisorComponent', () => {
  let component: HomeDuenoSupervisorComponent;
  let fixture: ComponentFixture<HomeDuenoSupervisorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeDuenoSupervisorComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeDuenoSupervisorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
