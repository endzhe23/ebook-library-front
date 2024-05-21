"use client";
import "../app/globals.css"
import {z} from "zod"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Input} from "@/components/ui/input";
import React from "react";
import {Button} from "@/components/ui/button";
import {axiosInstance} from "@/lib/axios";
import {toast} from "sonner";
import {Toaster} from "@/components/ui/sonner";


const BookShema = z.object({
    authorIds: z.array(z.number()).min(2).max(50),
    title: z.string(),
    description: z.string(),
    ISBN: z.string()
})

export default function Books() {
    const form = useForm<z.infer<typeof BookShema>>({
        resolver: zodResolver(BookShema),
        defaultValues: {
            authorIds: [],
            title: "",
            description: "",
            ISBN: ""
        }
    })
    const onSubmit = (formData: z.infer<typeof BookShema>) => {
        console.log(formData)
        axiosInstance.post("/books/add", {...formData})
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
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="title" render={({field}) => (
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
                    <Button type="submit">Создать книгу</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
