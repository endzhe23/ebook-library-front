"use client";
import {useEffect, useState} from "react";
import {Genre} from "@/types";
import {getGenreById} from "@/helpers/genre-api";
import Link from "next/link";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const genreId: number = params.id;
    const [genre, setGenre] = useState<Genre>();

    useEffect(() => {
        async function fetchData() {
            try {
                const genreData = await getGenreById(genreId);
                setGenre(genreData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [genreId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>{genre?.name}</div>
            {genre?.books?.map((book) => (
                <ul key={book.id}>
                    <Link href={`/books/${book.id}`}>{book.title}</Link>
                    <li>{book.description}</li>
                    <li>{book.ISBN}</li>
                </ul>
            ))}
        </main>
    );
}