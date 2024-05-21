"use client";
import {useEffect, useState} from "react";
import {axiosInstance} from "@/lib/axios";

type Author = {
    id: number,
    name: string;
    books: Book[];
}

type Book = {
    id: string,
    title: string;
    description: string;
    ISBN: string;
};

export default function Authors() {
    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        axiosInstance.get('/authors').then((response) => {
            setAuthors(response.data);
        })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            {authors.map((author) => (
                <ul key={author.id}>
                    <li>Название автора: {author.name}</li>
                    <li>Книги автора: {author.books.map((book) => (<ul key={book.id}>
                        <li>{book.title}</li>
                    </ul>))}</li>
                </ul>
            ))}
        </main>
    );
}
