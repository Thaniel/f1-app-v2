import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { doc, DocumentData, getDoc, getFirestore, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { firebaseConfig } from '../firebase.config';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  private readonly db;
  private readonly storage;

  constructor() { 
    const app = initializeApp(firebaseConfig);  // Initialize Firebase
    this.db = getFirestore(app);                // Initialize Cloud Firestore and get a reference to the service
    this.storage = getStorage(app);
  }

  // Upload Image 
  public async uploadImage(itemId: string, imageFile: File, collection: string, fieldName: string): Promise<boolean> {
    try {
      const storageRef = ref(this.storage, `${collection}_images/${itemId}/${imageFile.name}`);

      const snapshot = await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update imageUrl in document
      const raceDocRef = doc(this.db, collection, itemId);
      await updateDoc(raceDocRef, {
        [fieldName]: downloadURL,
      });

      console.log('Upload image: ' + imageFile.name);
      return true;
    } catch (error) {
      console.error("Error uploading image: ", error);
      return false;
    }
  }

    // Get user info to set into author of a new, comment or topic
    public async getAuthor(data: DocumentData) {
      if (data['author']) {
        const userDoc = await getDoc(data['author']);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          data['author'] = userData && typeof userData === 'object' ? { id: userDoc.id, ...userData } : null;
        } else {
          data['author'] = null;
        }
      }
    }
}
