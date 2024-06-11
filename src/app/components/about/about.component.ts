import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { InfoService } from '../../services/info.service';
import { Informacion } from '../../models/infor.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OrganigramaService } from '../../services/organigrama.service';
import { Organigrama } from '../../models/organigrama.model';
import { Observable } from 'rxjs';
import { ImageService } from '../../services/image.service';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent  implements OnInit{
  isAdmin: boolean = false;
  informacionEmpresa: Informacion | null = null;
  informacionForm: FormGroup;
  organigramaData: Organigrama[] = [];
  imageLogo: string = '';

  imagesCard = [
    { id: 18, url: '' },
    { id: 19, url: '' },
    { id: 20, url: '' },
    { id: 21, url: '' }
  ];

  constructor(
    private authService: AuthService,
    private informacionEmpresaService: InfoService,
    private fb: FormBuilder,
    private orgaServise:OrganigramaService,
    private fileService: FileService,
    private imageServ:ImageService
  ) {
    this.isAdmin = this.authService.isAdmin();
    this.informacionForm = this.fb.group({
      about: ['' ],
      mision: [''],
      vision: ['']
    });
  }

  ngOnInit(): void {
    this.loadInformacionEmpresa();
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
  loadImages(): void {
    this.imagesCard.forEach(image => {
      this.imageServ.getImagePathById(image.id).subscribe(response => {
        image.url = response.path;
      });
    });
  }

  loadInformacionEmpresa(): void {
    const id = 1; // Asume que siempre estás obteniendo la información de la empresa con ID 1
    this.informacionEmpresaService.getInformacionEmpresa(id).subscribe(
      (data: Informacion) => {
        this.informacionEmpresa = data;
        this.informacionForm.patchValue(data);
      },
      error => {
        console.error('Error al obtener la información de la empresa', error);
      }
    );
  }

  updateInformacionEmpresa(): void {
    if (this.informacionForm.valid) {
      const updatedInfo = this.informacionForm.value;
      this.informacionEmpresaService.updateInformacionEmpresa(1, updatedInfo).subscribe(
        () => {
          this.loadInformacionEmpresa(); // Recargar la información después de actualizar
        },
        error => {
          console.error('Error al actualizar la información de la empresa', error);
        }
      );
    }
  }

  loadPublications(): void {
    this.orgaServise.getPublications().subscribe(publications => {
      this.organigramaData = publications;
    });
  }

  updatePublication(id: number, updateData: Partial<Organigrama>): Observable<Organigrama> {
    return this.orgaServise.updatePublication(id, updateData);
  }

  editPublication(publication: Organigrama): void {
    if (this.isAdmin && publication) {
      this.updatePublication(publication.id, {
        nombre: publication.nombre,
        puesto: publication.puesto,
      }).subscribe(response => {
        console.log('Publicación actualizada:', response);
        this.loadPublications(); // Recargar las publicaciones para mostrar la información actualizada
      });
    }
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

      this.loadImages();
    });
  }

}
