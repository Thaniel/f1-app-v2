import { Injectable } from '@angular/core';
import { CommonService } from '../common/common.service';
import { Subject } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase-config';
import { addDoc, collection, deleteDoc, doc, DocumentReference, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { ITeam } from '../../interfaces/team.interface';
import { urlToFile } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {
  private db;
  private storage;
  private reloadSubject = new Subject<void>();
  private static readonly COLLECTION_NAME = "teams";

  constructor(
    private commonService: CommonService,
  ) {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
    this.storage = getStorage(app);
  }

  /*
   * Create Team
   */
  public async create(team: ITeam): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(this.db, TeamsService.COLLECTION_NAME), {
        name: team.name,
        fullName: team.fullName,
        teamPrincipal: team.teamPrincipal,
        titles: team.titles,
        points: team.points,
        colorCode: team.colorCode,
        driver1: team.driver1,
        driver2: team.driver2,
        description: team.description,
      });

      if (team.carImage) {
        const imageUploadSuccess = await this.commonService.uploadImage(docRef.id, team.carImage, TeamsService.COLLECTION_NAME, 'carImageUrl');
        if (!imageUploadSuccess) {
          console.error('Error uploading image');
          return false;
        }
      }

      if (team.logoImage) {
        const imageUploadSuccess = await this.commonService.uploadImage(docRef.id, team.logoImage, TeamsService.COLLECTION_NAME, 'logoImageUrl');
        if (!imageUploadSuccess) {
          console.error('Error uploading image');
          return false;
        }
      }

      console.log("Team written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding team: ", error);
      return false;
    }
  }


  /*
   * Update Team
   */
  public async update(id: string, updatedData: Partial<ITeam>, carImageFile: File | null, logoImageFile: File | null): Promise<boolean> {
    try {
      console.log(id);
      const teamDocRef = doc(this.db, TeamsService.COLLECTION_NAME, id);

      if (carImageFile && logoImageFile) {
        const folderRef = ref(this.storage, `${TeamsService.COLLECTION_NAME}_images/${id}`);

        // List and delete all files in the folder
        const files = await listAll(folderRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);

        // Upload the car image
        let imageRef = ref(this.storage, `${TeamsService.COLLECTION_NAME}_images/${id}/${carImageFile.name}`);
        let snapshot = await uploadBytes(imageRef, carImageFile);
        let downloadURL = await getDownloadURL(snapshot.ref);

        // Update the Firestore document with the car image URL
        updatedData.carImageUrl = downloadURL;

        // Upload the logo image
        imageRef = ref(this.storage, `${TeamsService.COLLECTION_NAME}_images/${id}/${logoImageFile.name}`);
        snapshot = await uploadBytes(imageRef, logoImageFile);
        downloadURL = await getDownloadURL(snapshot.ref);

        // Update the Firestore document with the logo image URL
        updatedData.logoImageUrl = downloadURL;
      }

      await updateDoc(teamDocRef, updatedData);
      console.log("Team updated with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error updating team: ", error);
      return false;
    }
  }

  /*
   * Delete Team
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const teamDocRef = doc(this.db, TeamsService.COLLECTION_NAME, id);

      this.deleteImagesFromTeam(teamDocRef);

      await deleteDoc(teamDocRef);
      console.log("Team deleted with ID: ", id);

      return true;
    } catch (error) {
      console.error("Error deleting team: ", error);
      return false;
    }
  }

  /*
   * Get all Teams
   */
  public async getAll(): Promise<ITeam[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, TeamsService.COLLECTION_NAME));
      const teams: ITeam[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Get car image
        if (data['carImageUrl']) {
          data['carImage'] = await urlToFile(data['carImageUrl']);
        } else {
          data['carImage'] = null;
        }

        // Get logo image
        if (data['logoImageUrl']) {
          data['logoImage'] = await urlToFile(data['logoImageUrl']);
        } else {
          data['logoImage'] = null;
        }

        teams.push({ id: doc.id, ...data } as ITeam);
      }));

      return teams;
    } catch (error) {
      console.error("Error getting teams: ", error);
      return [];
    }
  }

  /*
   * Get Team by Id
   */
  public async getById(id: string): Promise<ITeam | null> {
    try {
      const teamDocRef = doc(this.db, TeamsService.COLLECTION_NAME, id);
      const docSnap = await getDoc(teamDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Get car image
        if (data['carImageUrl']) {
          data['carImage'] = await urlToFile(data['carImageUrl']);
        } else {
          data['carImage'] = null;
        }

        // Get logo image
        if (data['logoImageUrl']) {
          data['logoImage'] = await urlToFile(data['logoImageUrl']);
        } else {
          data['logoImage'] = null;
        }

        return { id: docSnap.id, ...data } as ITeam;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting team:", error);
      return null;
    }
  }

  // Delete the car and logo image from Firebase Storage
  private async deleteImagesFromTeam(teamDocRef: DocumentReference) {
    const docSnap = await getDoc(teamDocRef);

    let carImageUrl = null;
    let logoImageUrl = null;
    if (docSnap.exists()) {
      carImageUrl = docSnap.data()['carImageUrl'];
      logoImageUrl = docSnap.data()['logoImageUrl'];
    }

    if (carImageUrl && logoImageUrl) {
      let imageRef = ref(this.storage, carImageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted: ', carImageUrl);

      imageRef = ref(this.storage, logoImageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted: ', logoImageUrl);
    }
  }

  loadTeams(): void {
    this.reloadSubject.next();
  }

  get reload$() {
    return this.reloadSubject.asObservable();
  }
}
