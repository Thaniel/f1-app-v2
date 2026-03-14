import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, Timestamp, updateDoc } from 'firebase/firestore';
import { ReloadableService } from '../../base/reloadable.service';
import { ImageService } from '../../feature/image.service';
import { firestore } from '../../firebase/firebase.provider';
import { IRace } from '../../interfaces/race.interface';
import { urlToFile } from '../../utils';

@Injectable({
  providedIn: 'root'
})
export class RacesService extends ReloadableService {
  private static readonly COLLECTION_NAME = "races";

  constructor(
    private readonly imageService: ImageService
  ) {
    super();
  }

  /*
   * Create Race
   */
  public async create(race: IRace): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(firestore, RacesService.COLLECTION_NAME), {
        grandPrix: race.grandPrix,
        circuit: race.circuit,
        country: race.country,
        firstPracticeDate: new Date(race.firstPracticeDate),
        secondPracticeDate: new Date(race.secondPracticeDate),
        thirdPracticeDate: new Date(race.thirdPracticeDate),
        qualifyingDate: new Date(race.qualifyingDate),
        date: new Date(race.date),
        appearance: race.appearance,
        distance: race.distance,
        laps: race.laps,
        record: race.record,
        length: race.length,
        description: race.description,
      });

      if (race.image) {
        const updateRace: Partial<IRace> = {};
        updateRace.imageUrl = await this.imageService.uploadImage(RacesService.COLLECTION_NAME, docRef.id, race.image);
        await updateDoc(docRef, updateRace);
      }
      
      this.triggerReload();

      console.log("Race written with ID: ", docRef.id);
      return true;
    } catch (error) {
      console.error("Error adding race: ", error);
      return false;
    }
  }

  /*
   * Update Race
   */
  public async update(id: string, updatedData: Partial<IRace>, raceImageFile: File | null): Promise<boolean> {
    try {
      const raceDocRef = doc(firestore, RacesService.COLLECTION_NAME, id);

      if (raceImageFile) {
        const downloadURL = await this.imageService.replaceImage(RacesService.COLLECTION_NAME, id, raceImageFile);

        // Update the Firestore document with the race image URL
        updatedData.imageUrl = downloadURL;
      }

      await updateDoc(raceDocRef, updatedData);

      this.triggerReload();

      console.log("Race updated with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error updating race: ", error);
      return false;
    }
  }

  /*
   * Delete Race
   */
  public async delete(id: string): Promise<boolean> {
    try {
      const raceDocRef = doc(firestore, RacesService.COLLECTION_NAME, id);

      await this.imageService.deleteFolder(RacesService.COLLECTION_NAME, id);

      await deleteDoc(raceDocRef);

      this.triggerReload();
      
      console.log("Race deleted with ID: ", id);
      return true;
    } catch (error) {
      console.error("Error deleting race: ", error);
      return false;
    }
  }

  /*
   * Get all Races
   */
  public async getAll(): Promise<IRace[]> {
    try {
      const querySnapshot = await getDocs(collection(firestore, RacesService.COLLECTION_NAME));
      const races: IRace[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        this.timestamp2Date(data);

        // Get race image
        data['image'] = await urlToFile(data['imageUrl']);

        races.push({ id: doc.id, ...data } as IRace);
      }));

      races.sort((a, b) => a.date.getTime() - b.date.getTime());

      return races;
    } catch (error) {
      console.error("Error getting races: ", error);
      return [];
    }
  }

  /*
   * Get Race by Id 
   */
  public async getById(id: string): Promise<IRace | null> {
    try {
      const raceDocRef = doc(firestore, RacesService.COLLECTION_NAME, id);
      const docSnap = await getDoc(raceDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        this.timestamp2Date(data);

        // Get race image
        data['image'] = await urlToFile(data['imageUrl']);

        return { id: docSnap.id, ...data } as IRace;
      } else {
        console.error("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting race:", error);
      return null;
    }
  }

  // Convert timestamp to Date
  private timestamp2Date(data: DocumentData) {
    if (data['firstPracticeDate'] instanceof Timestamp) {
      data['firstPracticeDate'] = data['firstPracticeDate'].toDate();
    }

    if (data['secondPracticeDate'] instanceof Timestamp) {
      data['secondPracticeDate'] = data['secondPracticeDate'].toDate();
    }

    if (data['thirdPracticeDate'] instanceof Timestamp) {
      data['thirdPracticeDate'] = data['thirdPracticeDate'].toDate();
    }

    if (data['qualifyingDate'] instanceof Timestamp) {
      data['qualifyingDate'] = data['qualifyingDate'].toDate();
    }

    if (data['date'] instanceof Timestamp) {
      data['date'] = data['date'].toDate();
    }
  }
}
