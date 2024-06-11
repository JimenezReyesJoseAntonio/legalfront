import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FileService } from '../../services/file.service';
import { ImageService } from '../../services/image.service';
import { SlickCarouselComponent } from 'ngx-slick-carousel';
import { Noticia } from '../../models/noticia.model';
import { NoticiaService } from '../../services/noticia.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  isAdmin: boolean = false;
  imageSrc: string = '';
  imageLogo: string = '';

  image1: string = '';
  image2: string = '';
  image3: string = '';
  image4: string = '';
  image5: string = '';

  publications: Noticia[] = [];

  selectedNoticia: Noticia | null = null;
  selectedNoticiaIz: Noticia | null = null;

  selectedImageUrl: string | null = null;
  currentIndex = 0;

  carouselImages = [
    { id: 2, url: '' },
    { id: 3, url: '' },
    { id: 4, url: '' },
    { id: 5, url: '' },
  ];


  constructor(
    private authService: AuthService,
    private fileService: FileService,
    private imageServ:ImageService,
    private notiServ:NoticiaService,


  ) {
    this.isAdmin = this.authService.isAdmin();
  }


  intervalId: any;

  

  

  ngOnInit(): void {
    console.log('hola'+this.imageSrc);

    this.loadImage(1); // Suponiendo que deseas cargar la imagen con ID 1
    this.loadImageLogo(22); // Suponiendo que deseas cargar la imagen con ID 1

    this.loadCarouselImages();
    this.loadPublications();
    this.startAutoSlide();


  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.intervalId = setInterval(() => {
      this.nextSlide();
    }, 6000); // Cambia de imagen cada 3 segundos
  }

  stopAutoSlide() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  loadPublications(): void {
    this.notiServ.getPublications().subscribe(publications => {
      this.publications = publications;
    });
  }

  loadCarouselImages(): void {
    this.carouselImages.forEach((image, index) => {
      this.loadImage2(image.id, index);
    });
  }

  loadImage2(id: number, index: number): void {
    this.imageServ.getImagePathById(id).subscribe(response => {
      this.carouselImages[index].url = response.path;
    });
  }

  loadImage(id: number): void {
    this.imageServ.getImagePathById(id).subscribe(response => {
        this.imageSrc = response.path;
     
    });
  }  

  
  loadImageLogo(id: number): void {
    this.imageServ.getImagePathById(id).subscribe(response => {
        this.imageLogo = response.path;
        console.log(response.path);
     
    });
  }  

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.carouselImages.length;
  }

  onFileChange(event: any, index: number): void {
    const file = event.target.files[0];
    if (file) {
      this.fileService.uploadFile(file).subscribe(response => {
        console.log('Archivo subido:', response.filePath);
        this.updateImagePathChange(this.carouselImages[index].id, response.filePath);
      });
    }
  }

  updateImagePathChange(id: number, newPath: string): void {
    this.imageServ.updateImageById(id, newPath).subscribe(response => {
      console.log('Image path updated:', response);
      this.loadImage2(id, this.carouselImages.findIndex(image => image.id === id));
      this.closeModal();
    });
  }

  uploadFile(event: any) {
    const file = event.target.files[0];
    this.fileService.uploadFile(file).subscribe(response => {
      console.log('Archivo subido:', response.filePath);
      //this.getFile(response.filePath);
      this.updateImagePath(1, response.filePath); // Actualiza la imagen con ID 1

    });
  }

  uploadFileLogo(event: any){
    const file = event.target.files[0];
    this.fileService.uploadFile(file).subscribe(response => {
      console.log('Archivo subido:', response.filePath);
      //this.getFile(response.filePath);
      this.updateImagePathLogo(22, response.filePath); // Actualiza la imagen con ID 1

    });
  }

  updateImagePath(id: number, newPath: string): void {
    this.imageServ.updateImageById(id, newPath).subscribe(response => {
      console.log('Image path updated:', response);
      this.loadImage(id); // Recargar la imagen actualizada
      this.loadImageLogo(22); // Suponiendo que deseas cargar la imagen con ID 1

    });
  }

  updateImagePathLogo(id: number, newPath: string): void {
    this.imageServ.updateImageById(id, newPath).subscribe(response => {
      console.log('Image path updated:', response);
      this.loadImageLogo(22); // Suponiendo que deseas cargar la imagen con ID 1

    });
  }
  

  openModal(id:any ): void {
    this.selectedNoticia = this.publications[id];
    const imageIndex = id ;
    this.selectedImageUrl = this.carouselImages[imageIndex]?.url || null;

    console.log('imageIndex'+imageIndex);
    console.log('noticia'+this.selectedNoticia.id);


  }

  openModalIz(): void {
    this.selectedNoticiaIz = this.publications[4];

    console.log('noticia izquierda');


  }

  closeModal(): void {
    this.selectedNoticia = null;
  }

  closeModalIz(): void {
    this.selectedNoticiaIz = null;
  }

  updatePublication(id: number, updateData: Partial<Noticia>): Observable<Noticia> {
    return this.notiServ.updatePublication(id, updateData);
  }

  editPublication(publication: Noticia): void {
    console.log('update'+publication.id)
    if (this.isAdmin && publication) {
      this.updatePublication(publication.id, {
        title: publication.title,
        fullText: publication.fullText
      }).subscribe(response => {
        console.log('Publicación actualizada:', response);
        this.closeModal();
        this.closeModalIz();

        this.loadPublications(); // Recargar las publicaciones para mostrar la información actualizada
      });
    }
  }

}
