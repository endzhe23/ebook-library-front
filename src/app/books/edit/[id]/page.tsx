"use client";
import "../../../globals.css"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {Toaster} from "sonner";
import {DropdownCombobox, ListItem} from "@/components/ui/dropdown-combobox";
import {Author, Book} from "@/types";
import {getBookById, updateBook} from "@/helpers/book-api";
import {getAuthors} from "@/helpers/author-api";

const BookScheme = z.object({
    authorIds: z.optional(z.array(z.number()).min(1, "Пожалуйста, выберите автора.")),
    title: z.optional(z.string().min(2, "Название книги не может содержать менее 2 символов.").max(50, "Название книги не может содержать более 50 символов.")),
    description: z.optional(z.string()),
    ISBN: z.optional(z.string())
})

type PageParams = {
    id: number
}

type PageProps = {
    params: PageParams
}


export default function Books({params}: PageProps) {
    const bookId: number = params.id
    const [book, setBook] = useState<Book>();
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);

    const zodForm = useForm<z.infer<typeof BookScheme>>({
        resolver: zodResolver(BookScheme),
        defaultValues: {
            authorIds: [],
            title: "",
            description: "",
            ISBN: ""
        }
    })

    useEffect(() => {
        async function fetchData() {
            try {
                const bookData = await getBookById(bookId);
                setBook(bookData);
                setSelectedAuthors(bookData.authors);

                const allAuthors = await getAuthors();
                setAuthors(allAuthors);

                zodForm.reset({
                    authorIds: bookData.authors.map(author => author.id),
                    title: bookData.title,
                    description: bookData.description,
                    ISBN: bookData.ISBN
                });
            } catch (error) {
                console.error('Error fetching data:', error)
            }
        }

        fetchData()
    }, [bookId, zodForm])


    const handleAddItem = (item: ListItem) => {
        const author = authors.find(author => author.id === item.id);
        if (author) {
            setSelectedAuthors(prev => [...prev, author]);
        }
    };

    const handleRemoveItem = (authorId: number) => {
        setSelectedAuthors(prev => prev.filter((author) => author.id !== authorId));
    };

    const handleRemoveAllItems = (): void => {
        setSelectedAuthors([]);
    };

    useEffect(() => {
        const authorIds = selectedAuthors.map((author) => author.id);
        zodForm.setValue("authorIds", authorIds)
    }, [selectedAuthors, zodForm])

    const onSubmit = (formData: z.infer<typeof BookScheme>) => {
        // console.log(formData)
        updateBook(bookId, formData)
    }

    if (!book) {
        return <div>Loading...</div>;
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
                                        defaultItems={(selectedAuthors.map((author) => ({
                                            id: author.id,
                                            value: author.name
                                        })))}
                                        menuSubTriggerText="Выбрать автора"
                                        searchPlaceholder="Поиск автора..."
                                        inputText="Добавьте автора"
                                        notFoundText="Автор не найден."
                                        onAddItem={handleAddItem}
                                        onRemoveItem={handleRemoveItem}
                                        onRemoveAllItems={handleRemoveAllItems}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Выберите автора для книги
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
                    <Button type="submit">Обновить</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
