"use client";
import {useEffect, useState} from "react";
import {Author} from "@/types";
import {getAuthorById} from "@/helpers/author-api";
import Link from "next/link";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const authorId: number = params.id;
    const [author, setAuthor] = useState<Author>();

    useEffect(() => {
        async function fetchData() {
            try {
                const authorData = await getAuthorById(authorId);
                setAuthor(authorData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [authorId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>{author?.name}</div>
            {author?.books?.map((book) => (
                <ul key={book.id}>
                    <Link href={`/books/${book.id}`}>{book.title}</Link>
                    <li>{book.description}</li>
                    <li>{book.ISBN}</li>
                </ul>
            ))}
        </main>
    );
}