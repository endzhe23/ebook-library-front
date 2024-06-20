"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {deleteBook, getBooks} from "@/helpers/book-api";
import {Book} from "@/types";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/sonner";
import Link from "next/link";

export default function Page() {
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allBooks = await getBooks();
                setBooks(allBooks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData().then()
    }, [])

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const bookId = Number(event.currentTarget.id)
        setBooks(books.filter((book) => book.id !== bookId))
        deleteBook(bookId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            {books?.map((book) => (
                <ul key={book.id}>
                    <li>Название книги: <Link href={`/books/${book.id}`}>{book.title}</Link></li>
                    <li>Авторы книги:</li>
                    {book.authors?.map((author) => (
                        <ul key={`/authors/${author.id}`}>
                            <li><Link href={`/authors/${author.id}`}>{author.name}</Link></li>
                        </ul>
                    ))}
                    <li>Жанры книг:</li>
                    {book.genres?.map((genre) => (
                        <ul key={`/genres/${genre.id}`}>
                            <li><Link href={`/genres/${genre.id}`}>{genre.name}</Link></li>
                        </ul>
                    ))}
                    <Link href={`/books/edit/${book.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                    <Button id={book.id.toString()} onClick={handleDelete}>Удалить книгу</Button>
                </ul>
            ))}
            <Toaster/>
        </main>
    );
}
