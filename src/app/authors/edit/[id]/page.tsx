"use client";
import "../../../globals.css"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Toaster} from "@/components/ui/sonner";
import {DropdownCombobox, ListItem} from "@/components/ui/dropdown-combobox";
import {getAuthorById} from "@/helpers/author-api";
import {getBooks} from "@/helpers/book-api";
import {Author, Book} from "@/types";

const AuthorScheme = z.object({
    name: z.string().min(2, "Название автора не может содержать менее 2 символов.").max(50, "Название автора не может содержать более 50 символов."),
    bookIds: z.array(z.number())
})

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}

export default function Authors({params}: PageProps) {
    const authorId: number = params.id
    const [author, setAuthor] = useState<Author>();
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedBooks, setSelectedBooks] = useState<Book[]>([]);

    const zodForm = useForm<z.infer<typeof AuthorScheme>>({
        resolver: zodResolver(AuthorScheme),
        defaultValues: {
            name: "",
            bookIds: []
        }
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const authorData = await getAuthorById(authorId);
                setAuthor(authorData);
                setSelectedBooks(authorData.books);

                const allBooks = await getBooks();
                setBooks(allBooks);

                zodForm.reset({
                    name: authorData.name,
                    bookIds: authorData.books.map(book => book.id)
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        fetchData();
    }, [authorId, zodForm]);

    const handleAddItem = (item: ListItem) => {
        const book = books.find(book => book.id === item.id);
        if (book) {
            setSelectedBooks(prev => [...prev, book]);
        }
    };

    const handleRemoveItem = (bookId: number) => {
        setSelectedBooks(prev => prev.filter((book) => book.id !== bookId));
    };

    const handleRemoveAllItems = (): void => {
        setSelectedBooks([]);
    };

    useEffect(() => {
        const bookIds = selectedBooks.map((book) => book.id);
        zodForm.setValue("bookIds", bookIds)
    }, [selectedBooks, zodForm])

    const onSubmit = (formData: z.infer<typeof AuthorScheme>) => {
        console.log(formData)
        // updateAuthor(formData)
    }

    if (!author) {
        return <div>Loading...</div>;
    }

    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <Form {...zodForm}>
                <form onSubmit={zodForm.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={zodForm.control} name="name" render={({field}) => (
                        <FormItem>
                            <FormLabel>Имя автора</FormLabel>
                            <FormControl>
                                <Input placeholder="Напишите здесь имя автора" {...field}/>
                            </FormControl>
                            <FormDescription>
                                Имя автора должно быть от 2 до 50 символов
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
                                        defaultItems={(selectedBooks.map((book) => ({
                                            id: book.id,
                                            value: book.title
                                        })))}
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
                    <Button type="submit">Создать автора</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
