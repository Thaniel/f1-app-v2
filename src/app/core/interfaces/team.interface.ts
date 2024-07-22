import { DocumentReference } from "firebase/firestore";
import { IDriver } from "./driver.interface";

export interface ITeam {
    id: string;
    name: string;
    fullName: string;
    teamPrincipal: string;
    titles: number;
    points: number;
    colorCode: string;
    driver1: DocumentReference | IDriver | null;
    driver2: DocumentReference | IDriver | null;
    description: string;
    carImage: File | null;
    carImageUrl: string;
    logoImage: File | null;
    logoImageUrl: string;
}