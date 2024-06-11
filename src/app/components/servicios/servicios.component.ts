import { Component } from '@angular/core';
import { Servicio } from '../../models/servicio.model';
import { AuthService } from '../../services/auth.service';
import { PublicacionService } from '../../services/publicacion.service';
import { FileService } from '../../services/file.service';
import { ImageService } from '../../services/image.service';
import { Observable } from 'rxjs';
import { ServicioService } from '../../services/servicio.service';

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrl: './servicios.component.css'
})
export class ServiciosComponent {
  isAdmin: boolean = false;
  searchTerm: string = ''; // Propiedad para almacenar el término de búsqueda

  publications: Servicio[] = [];

  selectedPublication: Servicio | null = null;
  selectedImageUrl: string | null = null;
  imageLogo: string = '';

  imagesCard = [
    { id: 12, url: '' },
    { id: 13, url: '' },
    { id: 14, url: '' },
    { id: 15, url: '' },
    { id: 16, url: '' },
    { id: 17, url: '' }
  ];

  constructor(
    private authService: AuthService,
    private publicationService: ServicioService,
    private fileService: FileService,
    private imageServ:ImageService


  ) {
    this.isAdmin = this.authService.isAdmin();
  }
  ngOnInit(): void {
    this.loadPublications();
    this.loadImages();
    this.loadImageLogo(22); // Suponiendo que deseas cargar la imagen con ID 1

  }

  loadImageLogo(id: number): void {
    this.imageServ.getImagePathById(id).subscribe(response => {
        this.imageLogo = response.path;
        console.log(response.path);
     
    });
  } 

  loadPublications(): void {
    this.publicationService.getPublications().subscribe(publications => {
      this.publications = publications;
    });
  }

  shouldHighlight(text: string): boolean {
    const searchTermLower = this.searchTerm.toLowerCase();
    return searchTermLower !== '' && (text.toLowerCase().startsWith(searchTermLower) || text.toLowerCase().includes(` ${searchTermLower}`));
  }
  
  

  loadImages(): void {
    this.imagesCard.forEach(image => {
      this.imageServ.getImagePathById(image.id).subscribe(response => {
        image.url = response.path;
      });
    });
  }

  openModal(publication: Servicio): void {
    this.selectedPublication = publication;
    console.log(this.selectedPublication.id);
    const imageIndex = publication.id;
    this.selectedImageUrl = this.imagesCard[imageIndex-1]?.url || null;
    console.log('numero de imagen'+imageIndex);
  }

  closeModal(): void {
    this.selectedPublication = null;
    this.selectedImageUrl = null;

  }

  onFileChange(event: any, id: number): void {
    const file = event.target.files[0];
    if (file) {
      this.fileService.uploadFile(file).subscribe(response => {
        console.log('Archivo subido:', response.filePath);
        this.updateImagePathChange(id, response.filePath);
      });
    }
  }

  updateImagePathChange(id: number, newPath: string): void {
    this.imageServ.updateImageById(id, newPath).subscribe(response => {
      console.log('Image path updated:', response);
      this.closeModal();

      this.loadImages();
    });
  }


  updateImagePath(id: number, newPath: string): void {
    console.log('update image'+id);
    this.publicationService.updatePublication(id, { image: newPath }).subscribe(response => {
      console.log('Image path updated:', response);

      this.loadPublications(); // Recargar las publicaciones para mostrar la imagen actualizada
    });
  }

  updatePublication(id: number, updateData: Partial<Servicio>): Observable<Servicio> {
    return this.publicationService.updatePublication(id, updateData);
  }

  editPublication(publication: Servicio): void {
    if (this.isAdmin && publication) {
      this.updatePublication(publication.id, {
        title: publication.title,
        shortText: publication.shortText,
        fullText: publication.fullText

      }).subscribe(response => {
        console.log('Publicación actualizada:', response);
        this.closeModal();
        this.loadPublications(); // Recargar las publicaciones para mostrar la información actualizada
      });
    }
  }
}
