"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {deleteBook, getBooks} from "@/helpers/book-api";
import {Book} from "@/types/intex";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/sonner";

export default function Page() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        getBooks((books) => {
            setBooks(books)
        })
    }, [])

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const bookId = Number(event.currentTarget.id)
        setBooks(books.filter((book) => book.id !== bookId))
        deleteBook(bookId)
    }

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
                    <Button id={book.id.toString()} onClick={handleDelete}>Удалить книгу</Button>
                </ul>
            ))}
            <Toaster/>
        </main>
    );
}
