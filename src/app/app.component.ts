import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
 
import { LocationService } from './shared/location.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.component.css'],
  providers: [LocationService]
})
export class AppComponent implements OnInit{

  private map: google.maps.Map;
  private marker: google.maps.Marker;
  private position: google.maps.LatLng;

  @ViewChild("gmap")
  public gmapElementRef: ElementRef;

  constructor(
    private location: LocationService
  ) {}
  
  ngOnInit(){

    this.load();
   
  }//init

  load() {

    this.location.getLocation().subscribe(position => {
      let positionObserver = position;

      this.position = new google.maps.LatLng(
        positionObserver.coords.latitude, 
        positionObserver.coords.longitude
      );

      this.map = new google.maps.Map(this.gmapElementRef.nativeElement, {
        center: this.position,
        zoom: 13
      });

      this.marker = new google.maps.Marker({
        position: this.position,
        map: this.map
      });
  
      let service = new google.maps.places.PlacesService(this.map);
      service.textSearch({
        location: this.position,
        radius: 500,
        query: 'gas station'
      }, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {

          for (var i = 0; i < results.length; i++) {
    
            let marker = new google.maps.Marker({
              icon: results[i].icon,
              map: this.map,
              position: results[i].geometry.location
            });
            
          }
        }
      });
      
    });//location

  }//load

  getIcon(){
    
  }
  
}/*End*/
