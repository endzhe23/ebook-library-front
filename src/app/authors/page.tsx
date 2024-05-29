"use client";
import {useEffect, useState} from "react";
import {Author} from "@/types/intex";
import {getAuthors} from "@/helpers/author-api";
import Link from "next/link";

export default function Page() {
    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        getAuthors((authors) => {
            setAuthors(authors);
        })
    }, [])

    return (
        <main className="flex min-h-screen flex-col items-left justify-self-auto p-24">
            {authors.map((author) => (
                <ul key={author.id}>
                    <li>Имя автора: <Link href={`/authors/${author.id}`}>{author.name}</Link></li>
                    <li>Книги автора: {author.books?.map((book) => (<ul key={book.id}>
                        <li>{book.title}</li>
                    </ul>))}</li>
                </ul>
            ))}
        </main>
    );
}
