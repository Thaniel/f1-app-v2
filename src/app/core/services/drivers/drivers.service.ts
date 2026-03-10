import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { Subject } from 'rxjs';
import { ImageService } from '../../feature/image.service';
import { firestore } from '../../firebase/firebase.provider';
import { IDriver } from '../../interfaces/driver.interface';
import { sortDriversByPoints, urlToFile } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class DriversService {
  private readonly reloadSubject = new Subject<void>();
  private static readonly COLLECTION_NAME = "drivers";

  constructor(
    private readonly imageService: ImageService
  ) { }

  /*
  * Create Driver
  */
  public async create(driver: IDriver): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(firestore, DriversService.COLLECTION_NAME), {
        firstName: driver.firstName,
        lastName: driver.lastName,
        birthDate: driver.birthDate,
        country: driver.country,
        points: driver.points,
        titles: driver.titles,
        team: doc(firestore, `teams/${driver.team}`),
      });

      if (driver.image){
        const updateDriver: Partial<IDriver> = {};
        updateDriver.imageUrl = await this.imageService.uploadImage(DriversService.COLLECTION_NAME, docRef.id, driver.image);
        await updateDoc(docRef, updateDriver);
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
      const driverDocRef = doc(firestore, DriversService.COLLECTION_NAME, id);

      if (imageFile) {
        const downloadURL = await this.imageService.replaceImage(DriversService.COLLECTION_NAME, id, imageFile);

        // Update the Firestore document with the driver image URL
        updatedData.imageUrl = downloadURL;
      }

      if (updatedData.team && typeof updatedData.team === 'string') {
        updatedData.team = doc(firestore, `teams/${updatedData.team}`);
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
      const driverDocRef = doc(firestore, DriversService.COLLECTION_NAME, id);

      await this.imageService.deleteFolder(DriversService.COLLECTION_NAME, id);

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
      const querySnapshot = await getDocs(collection(firestore, DriversService.COLLECTION_NAME));
      const drivers: IDriver[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        this.getTeam(data);

        // Get driver image
        data['image'] = await urlToFile(data['imageUrl']);

        drivers.push({ id: doc.id, ...data } as IDriver);
      }));

      sortDriversByPoints(drivers);

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
      const driverDocRef = doc(firestore, DriversService.COLLECTION_NAME, id);
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

  // Get team info to set into driver
  private async getTeam(data: DocumentData) {
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
