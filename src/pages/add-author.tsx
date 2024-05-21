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


const AuthorShema = z.object({
    name: z.string().min(2).max(50),
    bookIds: z.array(z.number())
})

export default function Authors() {
    const form = useForm<z.infer<typeof AuthorShema>>({
        resolver: zodResolver(AuthorShema),
        defaultValues: {
            name: "",
            bookIds: []
        }
    })
    const onSubmit = (formData: z.infer<typeof AuthorShema>) => {
        console.log(formData)
        axiosInstance.post("/authors/add", {...formData})
            .then(() => toast("Author created successfully", {
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
                    <FormField control={form.control} name="name" render={({field}) => (
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
                    <Button type="submit">Создать автора</Button>
                </form>
            </Form>
            <Toaster/>
        </main>
    );
}
