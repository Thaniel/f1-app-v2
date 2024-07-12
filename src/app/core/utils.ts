import { Timestamp } from "firebase/firestore";

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
export async function urlToFile(url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
    const fileType = blob.type || 'image/jpeg';  // Default to 'image/jpeg' if no type is provided
    const fileName = extractFilePart(url);

    if (fileName != null) {
        return new File([blob], fileName, { type: fileType });
    } else {
        return new File([blob], "marvel-spider.jpg", { type: fileType });
    }
}