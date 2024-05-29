"use client";
import {useEffect, useState} from "react";
import {getBooks} from "@/helpers/book-api";
import {Book} from "@/types/intex";

export default function Page() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        getBooks((books) => {
            setBooks(books)
        })
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            {books.map((book) => (
                <ul key={book.id}>
                    <li>Название книги:{book.title}</li>
                    <li>Описание книги: {book.description}</li>
                    <li>ISBN книги: {book.ISBN}</li>
                    <li>Авторы книги: {book.authors?.map((author) => (<ul key={author.id}>
                        <li>{author.name}</li>
                    </ul>))}</li>
                </ul>
            ))}
        </main>
    );
}
