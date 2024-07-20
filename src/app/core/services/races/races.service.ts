import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { addDoc, collection, deleteDoc, doc, DocumentData, DocumentReference, getDoc, getDocs, getFirestore, Timestamp, updateDoc } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage';
import { Subject } from 'rxjs';
import { IRace } from '../../interfaces/race.interface';
import { urlToFile } from '../../utils';
import { CommonService } from '../common/common.service';
import { firebaseConfig } from "../firebase.config";

@Injectable({
  providedIn: 'root'
})
export class RacesService {
  private db;
  private storage;
  private reloadSubject = new Subject<void>();
  private static readonly COLLECTION_NAME = "races";

  constructor(
    private commonService: CommonService
  ) {
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
    this.storage = getStorage(app);
  }

  /*
   * Create Race
   */
  public async create(race: IRace): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(this.db, RacesService.COLLECTION_NAME), {
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
        const imageUploadSuccess = await this.commonService.uploadImage(docRef.id, race.image, RacesService.COLLECTION_NAME, "imageUrl");
        if (!imageUploadSuccess) {
          console.error('Error uploading image');
          return false;
        }
      }

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
      console.log(id);
      const raceDocRef = doc(this.db, RacesService.COLLECTION_NAME, id);

      if (raceImageFile) {
        const folderRef = ref(this.storage, `${RacesService.COLLECTION_NAME}_images/${id}`);

        // List and delete all files in the folder
        const files = await listAll(folderRef);
        const deletePromises = files.items.map(fileRef => deleteObject(fileRef));
        await Promise.all(deletePromises);

        // Upload the race image
        const imageRef = ref(this.storage, `${RacesService.COLLECTION_NAME}_images/${id}/${raceImageFile.name}`);
        const snapshot = await uploadBytes(imageRef, raceImageFile);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the Firestore document with the race image URL
        updatedData.imageUrl = downloadURL;
      }

      await updateDoc(raceDocRef, updatedData);
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
      const raceDocRef = doc(this.db, RacesService.COLLECTION_NAME, id);

      await this.deleteImageFromRace(raceDocRef);

      await deleteDoc(raceDocRef);
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
      const querySnapshot = await getDocs(collection(this.db, RacesService.COLLECTION_NAME));
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
      const raceDocRef = doc(this.db, RacesService.COLLECTION_NAME, id);
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

  // Delete the image from Firebase Storage
  private async deleteImageFromRace(raceDocRef: DocumentReference) {
    const docSnap = await getDoc(raceDocRef);

    let imageUrl = null;
    if (docSnap.exists()) {
      imageUrl = docSnap.data()['imageUrl'];
    }

    if (imageUrl) {
      const imageRef = ref(this.storage, imageUrl);
      await deleteObject(imageRef);
      console.log('Image deleted: ', imageUrl);
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

  loadRaces(): void {
    this.reloadSubject.next();
  }

  get reload$() {
    return this.reloadSubject.asObservable();
  }
}
