import { Injectable } from "@angular/core";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase/firebase.provider";

@Injectable({
    providedIn: 'root'
})
export class ImageService {
    /*
     * Upload image and return download URL
     */
    public async uploadImage(collection: string, docId: string, file: File): Promise<string> {
        const imageRef = ref(storage, `${collection}_images/${docId}/${file.name}`);

        const snapshot = await uploadBytes(imageRef, file);

        return await getDownloadURL(snapshot.ref);
    }

    /*
     * Replace all images in a folder
     */
    public async replaceImage(collection: string, docId: string, file: File) {

        await this.deleteFolder(collection, docId);

        return await this.uploadImage(collection, docId, file);
    }

    /*
     * Delete all images inside a document folder
     */
    public async deleteFolder(collection: string, docId: string) {
        const folderRef = ref(storage, `${collection}_images/${docId}`);

        try {
            const files = await listAll(folderRef);
            const deletePromises = files.items.map(fileRef =>
                deleteObject(fileRef)
            );
            await Promise.all(deletePromises);
        } catch {
            console.error("Folder doesnt exist");
        }
    }

    /*
     * Delete image by URL
     */
    public async deleteByUrl(url: string): Promise<void> {
        const imageRef = ref(storage, url);
        await deleteObject(imageRef);
        console.log('Image deleted: ', url);
    }
}