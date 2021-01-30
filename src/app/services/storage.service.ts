import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {



  constructor(private afs: AngularFireStorage) { 

  }

  downloadMovie() {


    /*var storage = firebase.storage();
    console.log(storage)
    var storageRef = storage.ref('900x1600-3.png');*/

    this.afs.storage.ref('900x1600-3.png').getDownloadURL().then(
      (url) => {
        // `url` is the download URL for 'images/stars.jpg'
    
        // This can be downloaded directly:
        /*var xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        xhr.onload = (event) => {
          var blob = xhr.response;
        };
        xhr.open('GET', url);
        xhr.send();*/
  
        // Or inserted into an <img> element
        /*var img = document.getElementById('myimg');
        img.setAttribute('src', url);*/

        console.log(url);
      })
      .catch((error) => {
        // Handle any errors
      });

  }

}
