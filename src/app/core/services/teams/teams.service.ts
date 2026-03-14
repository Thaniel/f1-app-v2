import { Injectable } from '@angular/core';
import { addDoc, collection, deleteDoc, doc, DocumentReference, getDoc, getDocs, updateDoc } from 'firebase/firestore';
import { ReloadableService } from '../../base/reloadable.service';
import { ImageService } from '../../feature/image.service';
import { firestore } from '../../firebase/firebase.provider';
import { ITeam } from '../../interfaces/team.interface';
import { sortTeamsByPoints, urlToFile } from '../../utils';
import { RelationResolverService } from '../relation-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class TeamsService extends ReloadableService {
  private static readonly COLLECTION_NAME = "teams";

  constructor(
    private readonly imageService: ImageService,
    private readonly relationResolverService: RelationResolverService
  ) {
    super();
  }

  /*
   * Create Team
   */
  public async create(team: ITeam): Promise<boolean> {
    try {
      const docRef = await addDoc(collection(firestore, TeamsService.COLLECTION_NAME), {
        name: team.name,
        fullName: team.fullName,
        teamPrincipal: team.teamPrincipal,
        titles: team.titles,
        points: team.points,
        colorCode: team.colorCode,
        driver1: doc(firestore, `drivers/${team.driver1}`),
        driver2: doc(firestore, `drivers/${team.driver2}`),
        description: team.description,
      });

      const updateTeam: Partial<ITeam> = {};
      const uploads: Promise<void>[] = [];

      if (team.carImage) {
        uploads.push(
          this.imageService.uploadImage(TeamsService.COLLECTION_NAME, docRef.id, team.carImage)
            .then(url => { updateTeam.carImageUrl = url; })
        );
      }

      if (team.logoImage) {
        uploads.push(
          this.imageService.uploadImage(TeamsService.COLLECTION_NAME, docRef.id, team.logoImage)
            .then(url => { updateTeam.logoImageUrl = url; })
        );
      }

      await Promise.all(uploads);

      if (Object.keys(updateTeam).length > 0) {
        await updateDoc(docRef, updateTeam);
      }

      this.triggerReload();

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
      const teamDocRef = doc(firestore, TeamsService.COLLECTION_NAME, id);

      if (carImageFile && logoImageFile) {
        let downloadURL = await this.imageService.replaceImage(TeamsService.COLLECTION_NAME, id, carImageFile);
        // Update the Firestore document with the car image URL
        updatedData.carImageUrl = downloadURL;

        downloadURL = await this.imageService.uploadImage(TeamsService.COLLECTION_NAME, id, logoImageFile);
        // Update the Firestore document with the logo image URL
        updatedData.logoImageUrl = downloadURL;
      }

      // Update drivers references
      if (updatedData.driver1 && typeof updatedData.driver1 === 'string') {
        updatedData.driver1 = doc(firestore, `drivers/${updatedData.driver1}`);
      }
      if (updatedData.driver2 && typeof updatedData.driver2 === 'string') {
        updatedData.driver2 = doc(firestore, `drivers/${updatedData.driver2}`);
      }

      await updateDoc(teamDocRef, updatedData);

      this.triggerReload();

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
      const teamDocRef = doc(firestore, TeamsService.COLLECTION_NAME, id);

      await this.imageService.deleteFolder(TeamsService.COLLECTION_NAME, id);

      await deleteDoc(teamDocRef);
      
      this.triggerReload();

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
      const querySnapshot = await getDocs(collection(firestore, TeamsService.COLLECTION_NAME));
      const teams: ITeam[] = [];

      // Wait for all async operations
      await Promise.all(querySnapshot.docs.map(async (doc) => {
        const data = doc.data();

        // Get drivers
        data['driver1'] = await this.relationResolverService.resolve(data['driver1']);
        data['driver2'] = await this.relationResolverService.resolve(data['driver2']);

        // Get images
        data['carImage'] = await urlToFile(data['carImageUrl']);
        data['logoImage'] = await urlToFile(data['logoImageUrl']);

        teams.push({ id: doc.id, ...data } as ITeam);
      }));

      sortTeamsByPoints(teams);

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
      const teamDocRef = doc(firestore, TeamsService.COLLECTION_NAME, id);
      const docSnap = await getDoc(teamDocRef);

      if (docSnap.exists()) {
        const data = docSnap.data();

        // Get drivers
        data['driver1'] = await this.relationResolverService.resolve(data['driver1']);
        data['driver2'] = await this.relationResolverService.resolve(data['driver2']);

        // Get images
        data['carImage'] = await urlToFile(data['carImageUrl']);
        data['logoImage'] = await urlToFile(data['logoImageUrl']);

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
}
