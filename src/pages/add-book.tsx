"use client";
import "../app/globals.css"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React, {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {axiosInstance} from "@/lib/axios";
import {toast, Toaster} from "sonner";
import {DropdownCombobox, ListItem} from "@/components/ui/dropdown-combobox";

type Author = {
    id: number,
    name: string
}

const BookScheme = z.object({
    authorIds: z.array(z.number()).min(1, "Пожалуйста, выберите автора."),
    title: z.string().min(2, "Название книги не может содержать менее 2 символов.").max(50, "Название книги не может содержать более 50 символов."),
    description: z.string(),
    ISBN: z.string()
})

export default function Books() {
    const [authors, setAuthors] = useState<Author[]>([]);
    const [selectedAuthors, setSelectedAuthors] = useState<Author[]>([]);

    useEffect(() => {
        axiosInstance.get('/authors').then((response) => {
            setAuthors(response.data);
        })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, [])

    const zodForm = useForm<z.infer<typeof BookScheme>>({
        resolver: zodResolver(BookScheme),
        defaultValues: {
            authorIds: [],
            title: "",
            description: "",
            ISBN: ""
        }
    })

    const handleAddItem = (item: ListItem) => {
        setSelectedAuthors([...selectedAuthors, {id: item.id, name: item.value}]);
    };

    const handleRemoveItem = (authorId: number) => {
        setSelectedAuthors(selectedAuthors.filter((author) => author.id !== authorId));
    };

    const handleRemoveAllItems = (): void => {
        setSelectedAuthors([]);
    };

    useEffect(() => {
        const authorIds = selectedAuthors.map((author) => author.id);
        zodForm.setValue("authorIds", authorIds)
    }, [selectedAuthors, zodForm])

    const onSubmit = (formData: z.infer<typeof BookScheme>) => {
        const requestData = {...formData}
        // console.log(requestData)
        axiosInstance.post("/books/add", requestData)
            .then(() => toast("Book created successfully", {
                action: {
                    label: "Close",
                    onClick: () => console.log("Closed")
                }
            }))
            .catch((error) => console.error(error))
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
                    <Button type="submit">Создать книгу</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
