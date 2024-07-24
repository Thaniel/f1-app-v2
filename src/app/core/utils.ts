import { Timestamp } from "firebase/firestore";
import { IDriver } from "./interfaces/driver.interface";
import { ITeam } from "./interfaces/team.interface";

/*
 * Convert database date type to Angular date
 */
export function convertTimestamp2Date(data: any) {
    if (data['date'] instanceof Timestamp) {
        data['date'] = data['date'].toDate();
    }
}


/*
 * Get the name and extension of a file from a URL
 */
export function extractFilePart(url: string): string | null {
    const pattern = /\/[^/]*_images%2F[^%]*%2F([^?]+)/;
    const match = RegExp(pattern).exec(url);

    if (match?.[1]) {
        return match[1];
    } else {
        console.error("No valid file part found in the URL");
        return null;
    }
}

/*
 * Convert an URL from Firebase storage into a Fle
 */
export async function urlToFile(url: string): Promise<File | null> {
    let file : File | null = null;

    if (url != null){
        const response = await fetch(url);
        const blob = await response.blob();
        const fileType = blob.type || 'image/jpeg';  // Default to 'image/jpeg' if no type is provided
        const fileName = extractFilePart(url);
    
        if (fileName != null) {
            file = new File([blob], fileName, { type: fileType });
        }
    }

    return file;
}

export async function sortTeamsByPoints(teams: ITeam[]) {
    teams.sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        } else if (a.points < b.points) {
          return 1;
        } else {
          return 0;
        }
      });
}

export async function sortDriversByPoints(drivers: IDriver[]) {
    drivers.sort((a, b) => {
        if (a.points > b.points) {
          return -1;
        } else if (a.points < b.points) {
          return 1;
        } else {
          return 0;
        }
      });
}