"use client";
import React, {MouseEvent, useEffect, useState} from "react";
import {Genre} from "@/types";
import {deleteGenre, getGenres} from "@/helpers/genre-api";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/sonner";

export default function Page() {
    const [genres, setGenres] = useState<Genre[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const allGenres = await getGenres();
                setGenres(allGenres);
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const handleDelete = (event: MouseEvent<HTMLElement>) => {
        const genreId = Number(event.currentTarget.id)
        setGenres(genres.filter((genre) => genre.id !== genreId))
        deleteGenre(genreId)
    }

    return (
        <main className="flex min-h-screen flex-col items-left justify-self-auto p-24">
            {genres.map((genre) => (
                <ul key={genre.id}>
                    <li>Название жанра: <Link href={`/genres/${genre.id}`}>{genre.name}</Link></li>
                    <li>Книги жанра:</li>
                    {genre.books?.map((book) => (
                        <ul key={`/books/${book.id}`}>
                            <li><Link href={`/books/${book.id}`}>{book.title}</Link></li>
                        </ul>
                    ))}
                    <Link href={`/genres/edit/${genre.id}`}>
                        <Button>Обновить данные</Button>
                    </Link>
                </ul>
            ))}
            <Toaster/>
        </main>
    );
}
