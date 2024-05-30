"use client";
import React, {useEffect, useState} from "react";
import {Book} from "@/types/intex";
import {getBookById} from "@/helpers/book-api";
import Link from "next/link";

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Page({params}: PageProps) {
    const bookId: number = params.id;
    const [book, setBook] = useState<Book>();

    useEffect(() => {
        getBookById(bookId, (book) => {
            setBook(book);
        })
    }, [bookId])

    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <div>Название книги: {book?.title}</div>
            <div>Описание книги: {book?.description}</div>
            <div>ISBN книги: {book?.ISBN}</div>
            {book?.authors?.map((author) => (
                <ul key={author.id}>
                    <Link href={`/authors/${author.id}`}>{author.name}</Link>
                </ul>
            ))}
        </main>
    );
}