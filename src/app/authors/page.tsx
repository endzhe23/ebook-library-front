"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {Author} from "@/types";
import {deleteAuthor, getAuthors} from "@/helpers/author-api";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/sonner";

export default function Page() {
    const [authors, setAuthors] = useState<Author[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const allAuthors = await getAuthors();
                setAuthors(allAuthors);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const authorId = Number(event.currentTarget.id)
        setAuthors(authors.filter((author) => author.id !== authorId))
        deleteAuthor(authorId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-self-auto p-24">
            {authors.map((author) => (
                <ul key={author.id}>
                    <li>Имя автора: <Link href={`/authors/${author.id}`}>{author.name}</Link></li>
                    <li>Книги автора:</li>
                    {author.books?.map((book) => (
                        <ul key={`/books/${book.id}`}>
                            <li><Link href={`/books/${book.id}`}>{book.title}</Link></li>
                        </ul>
                    ))}
                    <Link href={`/authors/edit/${author.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                    <Link href={`/authors`}>
                        <Button id={author.id.toString()} onClick={handleDelete}>Удалить автора</Button>
                    </Link>
                </ul>
            ))}
            <Toaster/>
        </main>
    );
}
