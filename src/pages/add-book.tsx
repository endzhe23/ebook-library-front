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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";

type Author = {
    id: number,
    name: string
}

const BookShema = z.object({
    // authorIds: z.array(z.number()) - так должно быть, но пока костыль
    authorId: z.string({
        required_error: "Пожалуйста, выберите автора.",
    }),
    title: z.string().min(2).max(50),
    description: z.string(),
    ISBN: z.string()
})

export default function Books() {
    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        axiosInstance.get('/authors').then((response) => {
            setAuthors(response.data);
        })
            .catch((error) => {
                console.error('Error fetching posts:', error);
            });
    }, [])

    const zodForm = useForm<z.infer<typeof BookShema>>({
        resolver: zodResolver(BookShema),
        defaultValues: {
            // authorIds: [] - так должно быть, но пока костыль
            authorId: "",
            title: "",
            description: "",
            ISBN: ""
        }
    })

    const onSubmit = (formData: z.infer<typeof BookShema>) => {
        const requestData = {
            authorIds: [Number(formData.authorId)],
            title: formData.title,
            description: formData.description,
            ISBN: formData.ISBN
        }
        console.log(requestData)
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
                        name="authorId"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Автор</FormLabel>
                                <Select onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Выберите автора"/>
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {authors.map((author) => (
                                            <SelectItem key={author.id} value={author.id.toString()}>
                                                {author.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
