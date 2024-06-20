"use client";
import "../../globals.css"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/sonner";
import {DropdownCombobox, ListItem} from "@/components/ui/dropdown-combobox";
import {createGenre} from "@/helpers/genre-api";
import {getBooks} from "@/helpers/book-api";
import {Book} from "@/types";

const GenreScheme = z.object({
    name: z.string().min(2, "Название жанра не может содержать менее 2 символов.").max(50, "Название жанра не может содержать более 50 символов."),
    bookIds: z.array(z.number())
})

export default function Genres() {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allBooks = await getBooks();
                setBooks(allBooks);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData()
    }, [])

    const zodForm = useForm<z.infer<typeof GenreScheme>>({
        resolver: zodResolver(GenreScheme),
        defaultValues: {
            name: "",
            bookIds: []
        }
    })

    const handleAddItem = (item: ListItem) => {
        setSelectedBooks([...selectedBooks, {id: item.id, title: item.value, authors: [], genres: []}]);
    };

    const handleRemoveItem = (bookId: number) => {
        setSelectedBooks(selectedBooks.filter((book) => book.id !== bookId));
    };

    const handleRemoveAllItems = (): void => {
        setSelectedBooks([]);
    };

    useEffect(() => {
        const bookIds = selectedBooks.map((book) => book.id);
        zodForm.setValue("bookIds", bookIds)
    }, [selectedBooks, zodForm])

    const onSubmit = (formData: z.infer<typeof GenreScheme>) => {
        const requestData = {...formData}
        console.log(formData)
        createGenre(requestData)
    }
    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <Form {...zodForm}>
                <form onSubmit={zodForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={zodForm.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Название жанра</FormLabel>
                            <FormControl>
                                <Input placeholder="Напишите здесь название жанра" {...field}/>
                            </FormControl>
                            <FormDescription>
                                Название жанра должно быть от 2 до 50 символов
                            </FormDescription>
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={zodForm.control}
                        name="bookIds"
                        render={() => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Книги автора</FormLabel>
                                <FormControl>
                                    <DropdownCombobox
                                        items={(books.map((book) => ({id: book.id, value: book.title})))}
                                        menuSubTriggerText="Выбрать книгу"
                                        searchPlaceholder="Поиск по книгам..."
                                        inputText="Добавьте книгу"
                                        notFoundText="Книга не найдена."
                                        onAddItem={handleAddItem}
                                        onRemoveItem={handleRemoveItem}
                                        onRemoveAllItems={handleRemoveAllItems}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Выберите книгу для автора
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <Button type="submit">Создать жанра</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
