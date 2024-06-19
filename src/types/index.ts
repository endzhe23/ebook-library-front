export type Author = {
    id: number,
    name: string;
    books: Book[] | [];
}

export type Genre = {
    id: number,
    name: string;
    books: Book[] | [];
}

export type Book = {
    id: number,
    authors: Author[] | [];
    genres: Genre[] | [];
    title: string;
    description?: string;
    ISBN?: string;
};