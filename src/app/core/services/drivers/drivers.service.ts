import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, getFirestore, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { Subject } from 'rxjs';
import { IDriver } from '../../interfaces/driver.interface';
import { urlToFile } from '../../utils';
import { CommonService } from '../common/common.service';
import { firebaseConfig } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  private db;
  private storage;
  private reloadSubject = new Subject<void>();
  private static readonly COLLECTION_NAME = "drivers";

  constructor(
    private commonService: CommonService,
  ) {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
    this.storage = getStorage(app);
  }

  /*
  * Create Driver
  */
  public async create(driver: IDriver): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(this.db, DriversService.COLLECTION_NAME), {
        firstName: driver.firstName,
        lastName: driver.lastName,
        birthDate: driver.birthDate,
        country: driver.country,
        points: driver.points,
        titles: driver.titles,
        team: doc(this.db, `teams/${driver.team}`),
      });

      if (driver.image) {
        const imageUploadSuccess = await this.commonService.uploadImage(docRef.id, driver.image, DriversService.COLLECTION_NAME, 'imageUrl');
        if (!imageUploadSuccess) {
          console.error('Error uploading image');
          return false;
        }
      }

      console.log("Driver written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding driver: ", error);
      return false;
    }
  }


  /*
   * Update Driver
   */
  public async update(id: string, updatedData: Partial<IDriver>, imageFile: File | null): Promise<boolean> {
    try {
      const driverDocRef = doc(this.db, DriversService.COLLECTION_NAME, id);

      if (imageFile) {
        const folderRef = ref(this.storage, `${DriversService.COLLECTION_NAME}_images/${id}`);

        // List and delete all files in the folder
        const files = await listAll(folderRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);

        // Upload the driver image
        let imageRef = ref(this.storage, `${DriversService.COLLECTION_NAME}_images/${id}/${imageFile.name}`);
        let snapshot = await uploadBytes(imageRef, imageFile);
        let downloadURL = await getDownloadURL(snapshot.ref);

        // Update the Firestore document with the driver image URL
        updatedData.imageUrl = downloadURL;
      }
      
      if (updatedData.team) {
        updatedData.team = doc(this.db, `teams/${updatedData.team}`);
      }

      await updateDoc(driverDocRef, updatedData);
      console.log("Driver updated with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error updating driver: ", error);
      return false;
    }
  }

  /*
   * Delete Driver
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const driverDocRef = doc(this.db, DriversService.COLLECTION_NAME, id);

      await this.deleteImagesFromDriver(driverDocRef);

      await deleteDoc(driverDocRef);
      console.log("Driver deleted with ID: ", id);

      return true;
    } catch (error) {
      console.error("Error deleting driver: ", error);
      return false;
    }
  }

  /*
   * Get all Drivers
   */
  public async getAll(): Promise<IDriver[]> {
    try {
      const querySnapshot = await getDocs(collection(this.db, DriversService.COLLECTION_NAME));
      const drivers: IDriver[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();
        
        this.getTeam(data);

        // Get driver image
        data['image'] = await urlToFile(data['imageUrl']);

        drivers.push({ id: doc.id, ...data } as IDriver);
      }));

      return drivers;
    } catch (error) {
      console.error("Error getting drivers: ", error);
      return [];
    }
  }

  /*
   * Get Driver by Id
   */
  public async getById(id: string): Promise<IDriver | null> {
    try {
      const driverDocRef = doc(this.db, DriversService.COLLECTION_NAME, id);
      const docSnap = await getDoc(driverDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        
        this.getTeam(data);

        // Get driver image
        data['image'] = await urlToFile(data['imageUrl']);
        
        return { id: docSnap.id, ...data } as IDriver;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting driver:", error);
      return null;
    }
  }

  // Delete the driver image from Firebase Storage
  private async deleteImagesFromDriver(driverDocRef: DocumentReference) {
    const docSnap = await getDoc(driverDocRef);

    let imageUrl = null;
    if (docSnap.exists()) {
      imageUrl = docSnap.data()['imageUrl'];
    }

    if (imageUrl) {
      let imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted: ', imageUrl);
    }
  }

  // Get team info to set into driver
  private async getTeam(data: DocumentData){
    if (data['team']) {
      const teamDoc = await getDoc(data['team']);
      if (teamDoc.exists()) {
        const teamData = teamDoc.data();
        data['team'] = teamData && typeof teamData === 'object' ? { id: teamDoc.id, ...teamData } : null;
      } else {
        data['team'] = null;
      }
    }
  }

  loadDrivers(): void {
    this.reloadSubject.next();
  }

  get reload$() {
    return this.reloadSubject.asObservable();
  }
}
