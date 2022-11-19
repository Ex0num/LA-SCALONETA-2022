import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Firestore, doc, docData, updateDoc } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';


@Injectable({
  providedIn: 'root'
})
export class PushNotificationsService {
  
  private user;

  constructor(
     private srvAuth: AuthService,  
     private platform: Platform, 
     private firestore: Firestore, 
     private http: HttpClient) {}
  
  async inicializar(): Promise<void> {
    this.addListeners();
    // Verificamos que este en un dispositivo y no en una PC y tambien que el usuario no tegna seteado el token
    if (this.platform.is('capacitor') && this.user.token === '') {
      const result = await PushNotifications.requestPermissions();
      if (result.receive === 'granted') {
        await PushNotifications.register();
      }
    }
  }

  getUser(): void {
    const aux = doc(this.firestore, `usuarios/${this.srvAuth.dataUsuarioLogeado.id}`);
    docData(aux, { idField: 'id' }).subscribe(async (user) => {
      this.user = user;
      this.inicializar();
    });
  }

  sendPushNotification(req): Observable<any> {
    console.log("push notification");
    return this.http.post<Observable<any>>(environment.fcmUrl, req, {
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        Authorization: `key=${environment.fcmServerKey}`,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    });
  }
  
  private async addListeners(): Promise<void> {
    console.log("asdad");
    //Ocurre cuando el registro de las push notifications finaliza sin errores
    await PushNotifications.addListener(
      'registration',
      async (token: Token) => {
        //AcÃ¡ deberiamos asociar el token a nuestro usario en nuestra bd
        console.log('Registration token: ', token.value);
        const aux = doc(this.firestore, `usuarios/${this.user.id}`);
        await updateDoc(aux, {
          token: token.value,
        });
      }
    );

    //Ocurre cuando el registro de las push notifications finaliza con errores
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });

    //Ocurre cuando el dispositivo recive una notificacion push
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        //Este evento solo se activa cuando tenemos la app en primer plano
        console.log('Push notification received: ', notification);
        console.log('data: ', notification.data);
        //Esto se hace en el caso de que querramos que nos aparezca la notificacion en la task bar del celular ya que por
        //defecto las push en primer plano no lo hacen, de no ser necesario esto se puede sacar.
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: new Date().getMilliseconds(),
              extra: {
                data: notification.data,
              },
            },
          ],
        });
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion push
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        //Este evento solo se activa cuando tenemos la app en segundo plano y presionamos sobre la notificacion
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.notification
        );
      }
    );

    //Ocurre cuando se realiza una accion sobre la notificacion local
    await LocalNotifications.addListener(
      'localNotificationActionPerformed',
      (notificationAction) => {
        console.log('action local notification', notificationAction);
      }
    );
  }
}
