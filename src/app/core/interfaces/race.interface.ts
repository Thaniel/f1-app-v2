export interface IRace {
    id: string;
    grandPrix: string;
    circuit: string;
    country: string;
    firstPracticeDate: Date;
    secondPracticeDate: Date;
    thirdPracticeDate: Date;
    classificationDate: Date;
    date: Date;
    appearance: number;
    distance: number;
    laps: number;
    record: string;
    length: number;
    description: string;
    image: File | null;
    imageUrl: string;
}