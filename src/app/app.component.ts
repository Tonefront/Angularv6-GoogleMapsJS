import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
 
import { LocationService } from './shared/location.service';
import { markParentViewsForCheck } from '@angular/core/src/view/util';

@Component({
  selector: 'app-root',
  template: `
    <div #gmap style="height:400px;width:100%;"></div>
    `,
  providers: [LocationService]
})
export class AppComponent implements OnInit{

  private markers = [];
  private map: google.maps.Map;
  private position: google.maps.LatLng;
  private userMarker: google.maps.Marker;
  private service: google.maps.places.PlacesService;

  private htmlNewSearch = `
  <button title="New search for gas stations">New Search</button>`;

  @ViewChild("gmap")
  public gmapElementRef: ElementRef;

  constructor(
    private location: LocationService
  ) {}
  
  ngOnInit(){
    
   this.generateMap(); 
   
  }

  private generateMap(){

    // Watches until coordinates are given to locates user
    this.location.getLocation().subscribe(observer => {

      // Then contructs map, search, and markers
      this.position = observer;

      this.map = new google.maps.Map(this.gmapElementRef.nativeElement, {
        center: this.position,
        zoom: 13
      });

      // Add on-click controls to button
      let search = this.getHTMLNode(this.htmlNewSearch);

      search.addEventListener('click', () => {
        this.newSearch()
      });

      // embed button into map
      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(search);

      // Mark users position
      let userMarker = new google.maps.Marker({
        position: this.position,
        map: this.map,
        title: "You are here"
      });

      this.service = new google.maps.places.PlacesService(this.map);

      this.searchArea();

    });
      
  }

  private getHTMLNode(htmlString: string): Node {

    // Takes a string and turns into a HTML Element
    let template = document.createElement('template');
    htmlString = htmlString.trim(); 
    template.innerHTML = htmlString;
    return template.content.firstChild;

  }

  private newSearch() {
    
    // Re-finds users location
    this.location.getLocation().subscribe(observer => {
      this.position = observer;
    });

    this.map.setCenter(this.position);

    // Remove all markers
    this.userMarker.setMap(null);

    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.markers = [];

    this.userMarker = new google.maps.Marker({
      position: this.position,
      map: this.map,
      title: "You are here"
    });

    this.searchArea();

  }

  private searchArea(){
    
    // Search provided by google maps docs 
    //https://developers.google.com/maps/documentation/javascript/places#TextSearchRequests 
    this.service.textSearch({
      location: this.position,
      radius: 500,
      query: 'gas station'
    }, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK) {

        for (var i = 0; i < results.length; i++) {

          this.markers[i] = new google.maps.Marker({
            icon: results[i].icon,
            title: results[i].name,
            map: this.map,
            position: results[i].geometry.location
          });
          
        }
      }
    });
  }

}/*End*/
