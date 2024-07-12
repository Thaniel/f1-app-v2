export interface INew {
    id: string;
    title: string;
    date: Date;
    summary: string;
    image: File | null;
    imageUrl: string;
    text: string;
    comments: IComment[] | null;
}

export interface IComment {
    id: string;
    author: string;
    text: string;
    date: Date;
    isEditing: boolean;
}