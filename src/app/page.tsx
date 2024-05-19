"use client";
import {useEffect, useState} from "react";
import {axiosInstance} from "@/lib/axios";

type Author = {
    id: number,
    name: string;
}

type Book = {
    id: string,
    authors: Author[];
    title: string;
    description: string;
    ISBN: string;
};

export default function Home() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        axiosInstance.get('/books').then((response) => {
            setBooks(response.data);
        })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            {books.map((book) => (
                <ul key={book.id}>
                    <li>Название книги:{book.title}</li>
                    <li>Описание книги: {book.description}</li>
                    <li>ISBN книги: {book.ISBN}</li>
                    <li>Авторы книги: {book.authors.map((author: { name: any; }) => (author.name))}</li>
                </ul>
            ))}
        </main>
    );
}
