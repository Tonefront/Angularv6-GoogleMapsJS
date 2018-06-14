import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { } from '@types/googlemaps';
 
import { LocationService } from './shared/location.service';

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
  private service: google.maps.places.PlacesService;

  private htmlNewSearch = `
  <button title="New search for gas stations">New Search</button>`;
  private htmlRange = `
  <button value="Radius" title="Increase radius (at max resets to min)">Radius</button>`;

  @ViewChild("gmap")
  public gmapElementRef: ElementRef;

  constructor(
    private location: LocationService
  ) {}
  
  ngOnInit(){
    
   this.generateMap(); 
   
  }

  private generateMap(){

    this.location.getLocation().subscribe(observer => {

      this.position = observer;

      this.map = new google.maps.Map(this.gmapElementRef.nativeElement, {
        center: this.position,
        zoom: 13
      });

      let search = this.getHTMLNode(this.htmlNewSearch);

      search.addEventListener('click', () => {
        this.newSearch()
      });

      this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(search);

      let marker = new google.maps.Marker({
        position: this.position,
        map: this.map
      });

      this.service = new google.maps.places.PlacesService(this.map);

      this.searchArea();

    });
      
  }

  private getHTMLNode(htmlString: string): Node {

    let template = document.createElement('template');
    htmlString = htmlString.trim(); 
    template.innerHTML = htmlString;
    return template.content.firstChild;

  }

  private newSearch() {
    
    this.location.getLocation().subscribe(observer => {
      this.position = observer;
    });

    this.map.setCenter(this.position);

    this.markers.forEach(function(marker) {
      marker.setMap(null);
    });
    this.markers = [];

    this.searchArea();

  }

  private searchArea(){
    
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
