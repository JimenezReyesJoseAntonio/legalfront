import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Publication } from '../../models/publication.model';
import { PublicacionService } from '../../services/publicacion.service';
import { ImageService } from '../../services/image.service';
import { FileService } from '../../services/file.service';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent implements OnInit {
  isAdmin: boolean = false;
  searchTerm: string = ''; // Propiedad para almacenar el término de búsqueda
  imageLogo: string = '';

  publications: Publication[] = [];

  selectedPublication: Publication | null = null;
  selectedImageUrl: string | null = null;

  imagesCard = [
    { id: 6, url: '' },
    { id: 7, url: '' },
    { id: 8, url: '' },
    { id: 9, url: '' },
    { id: 10, url: '' },
    { id: 11, url: '' }
  ];

  constructor(
    private authService: AuthService,
    private publicationService: PublicacionService,
    private fileService: FileService,
    private imageServ:ImageService


  ) {
    this.isAdmin = this.authService.isAdmin();
  }
  ngOnInit(): void {
    this.loadPublications();
    this.loadImages();
    this.loadImageLogo(22);
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

  openModal(publication: Publication): void {
    this.selectedPublication = publication;
    const imageIndex = publication.id - 1;
  
    this.selectedImageUrl = this.imagesCard[imageIndex]?.url || null;

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
    this.publicationService.updatePublication(id, { image: newPath }).subscribe(response => {
      console.log('Image path updated:', response);

      this.loadPublications(); // Recargar las publicaciones para mostrar la imagen actualizada
    });
  }

  updatePublication(id: number, updateData: Partial<Publication>): Observable<Publication> {
    return this.publicationService.updatePublication(id, updateData);
  }

  editPublication(publication: Publication): void {
    if (this.isAdmin && publication) {
      this.updatePublication(publication.id, {
        title: publication.title,
        author: publication.author,
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
