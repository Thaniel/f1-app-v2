import { Injectable } from "@angular/core";
import { getDoc, DocumentReference } from "firebase/firestore";

@Injectable({
    providedIn: 'root'
})
export class RelationResolverService {
    async resolve<T = any>(ref: DocumentReference | null | undefined): Promise<T | null> {
        let data = null;

        if (ref) {
            try {
                const snapshot = await getDoc(ref);
                if (snapshot.exists()) {

                    data = { id: snapshot.id, ...snapshot.data() } as T;
                }
            } catch (error) {
                console.error("Error resolving reference:", error);
            }
        }

        return data;
    }

    async resolveFields(data: any, fields: string[]): Promise<void> {
        await Promise.all(
            fields.map(async field => {
                if (data[field]) {
                    data[field] = await this.resolve(data[field]);
                }
            })
        );
    }
}