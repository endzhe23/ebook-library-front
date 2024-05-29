export type Author = {
    id: number,
    name: string;
    books?: Book[];
}

export type Book = {
    id: number,
    authors?: Author[];
    title: string;
    description?: string;
    ISBN?: string;
};