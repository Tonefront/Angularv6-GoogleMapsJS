import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { } from '@types/googlemaps';

@Injectable({
    providedIn: 'root',
})
export class LocationService {

    constructor(){}

    getLocation():Observable<google.maps.LatLng> {
        return Observable.create(observer => {
            if (window.navigator && window.navigator.geolocation) {
                window.navigator.geolocation.getCurrentPosition((position) => {
                        let coords = new google.maps.LatLng(
                            position.coords.latitude,
                            position.coords.longitude
                        );
                        observer.next(coords);
                        observer.complete();
                    }, (error) => observer.error(error)
                );
            } else {
                observer.error('Unsupported Browser');
            }

        });
    }

}