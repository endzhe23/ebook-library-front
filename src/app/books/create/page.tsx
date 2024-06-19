"use client";
import "../../globals.css"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Toaster} from "sonner";
import {DropdownCombobox, ListItem} from "@/components/ui/dropdown-combobox";
import {Author, Genre} from "@/types";
import {createBook} from "@/helpers/book-api";
import {getAuthors} from "@/helpers/author-api";
import {getGenres} from "@/helpers/genre-api";

const BookScheme = z.object({
    authorIds: z.array(z.number()).min(1, "Пожалуйста, выберите автора."),
    genreIds: z.array(z.number()).min(1, "Пожалуйста, выберите жанр."),
    title: z.string().min(2, "Название книги не может содержать менее 2 символов.").max(50, "Название книги не может содержать более 50 символов."),
    description: z.string(),
    ISBN: z.string()
})

export default function Books() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [genres, setGenres] = useState<Genre[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const allAuthors = await getAuthors();
                const allGenres = await getGenres();
                setAuthors(allAuthors);
                setGenres(allGenres)
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [])

    const zodForm = useForm<z.infer<typeof BookScheme>>({
        resolver: zodResolver(BookScheme),
        defaultValues: {
            authorIds: [],
            genreIds: [],
            title: "",
            description: "",
            ISBN: ""
        }
    })

    const handleAddAuthor = (item: ListItem) => {
        setSelectedAuthors([...selectedAuthors, {id: item.id, name: item.value, books: []}]);
    };

    const handleRemoveAuthor = (authorId: number) => {
        setSelectedAuthors(selectedAuthors.filter((author) => author.id !== authorId));
    };

    const handleRemoveAllAuthors = (): void => {
        setSelectedAuthors([]);
    };

    const handleAddGenre = (item: ListItem) => {
        setSelectedGenres([...selectedGenres, {id: item.id, name: item.value, books: []}]);
    };

    const handleRemoveGenre = (genreId: number) => {
        setSelectedGenres(selectedGenres.filter((genre) => genre.id !== genreId));
    };

    const handleRemoveAllGenres = (): void => {
        setSelectedGenres([]);
    };


    useEffect(() => {
        const authorIds = selectedAuthors.map((author) => author.id)
        const genreIds = selectedGenres.map((genre) => genre.id)
        zodForm.setValue("genreIds", authorIds)
        zodForm.setValue("authorIds", genreIds)
    }, [selectedAuthors, selectedGenres, zodForm])

    const onSubmit = (formData: z.infer<typeof BookScheme>) => {
        const requestData = {...formData}
        // console.log(requestData)
        createBook(requestData)
    }

    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <Form {...zodForm}>
                <form onSubmit={zodForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={zodForm.control}
                        name="authorIds"
                        render={() => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Автор</FormLabel>
                                <FormControl>
                                    <DropdownCombobox
                                        items={(authors.map((author) => ({id: author.id, value: author.name})))}
                                        menuSubTriggerText="Выбрать автора"
                                        searchPlaceholder="Поиск автора..."
                                        inputText="Добавьте автора"
                                        notFoundText="Автор не найден."
                                        onAddItem={handleAddAuthor}
                                        onRemoveItem={handleRemoveAuthor}
                                        onRemoveAllItems={handleRemoveAllAuthors}
                                    />
                                </FormControl>
                                <FormField
                                    control={zodForm.control}
                                    name="authorIds"
                                    render={() => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Жанр</FormLabel>
                                            <FormControl>
                                                <DropdownCombobox
                                                    items={(genres.map((genre) => ({id: genre.id, value: genre.name})))}
                                                    menuSubTriggerText="Выбрать жанр"
                                                    searchPlaceholder="Поиск жанра..."
                                                    inputText="Добавьте жанр"
                                                    notFoundText="Жанр не найден."
                                                    onAddItem={handleAddGenre}
                                                    onRemoveItem={handleRemoveGenre}
                                                    onRemoveAllItems={handleRemoveAllGenres}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <FormDescription>
                                    Выберите жанр для книги
                                </FormDescription>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField control={zodForm.control} name="title" render={({field}) => (
                        <FormItem>
                            <FormLabel>Название книги</FormLabel>
                            <FormControl>
                                <Input placeholder="Напишите здесь название книги" {...field}/>
                            </FormControl>
                            <FormDescription>
                                Название книги должно быть от 2 до 50 символов
                            </FormDescription>
                        </FormItem>
                    )}
                    />
                    <FormField control={zodForm.control} name="description" render={({field}) => (
                        <FormItem>
                            <FormLabel>Описание книги</FormLabel>
                            <FormControl>
                                <Input placeholder="Напишите здесь описание книги" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <FormField control={zodForm.control} name="ISBN" render={({field}) => (
                        <FormItem>
                            <FormLabel>ISBN книги</FormLabel>
                            <FormControl>
                                <Input placeholder="Напишите здесь ISBN книги" {...field}/>
                            </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button type="submit">Создать книгу</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
