export interface ITeam {
    id: string;
    name: string;
    fullName: string;
    teamPrincipal: string;
    titles: number;
    points: number;
    colorCode: string;
    driver1: null;
    driver2: null;
    description: string;
    carImage: File | null;
    carImageUrl: string;
    logoImage: File | null;
    logoImageUrl: string;
}