"use client"
import "../app/globals.css"

import * as React from "react"
import {useState} from "react"
import {MoreHorizontal, Tags, Trash} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Command, CommandEmpty, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Author = {
    id: number;
    name: string;
};

const authors: Author[] = [
    {id: 1, name: "Tolstoy"},
    {id: 2, name: "Gogol"},
    {id: 3, name: "Pushkin"},
    {id: 4, name: "Dostoevskiy"},
    {id: 5, name: "Chekhov"},
    {id: 6, name: "Lermontov"},
    {id: 7, name: "Turgenev"}
]

export default function ComboboxDropdownMenu() {
    const [authorName, setAuthorName] = useState<string>()
    const [open, setOpen] = useState(false)

    return (
        <main className="flex min-h-screen max-w-3xl flex-col items-left justify-self-auto p-24">
            <div
                className="flex w-full flex-col items-left justify-between rounded-md border px-4 py-3 sm:flex-row sm:items-center">
                <p className="text-sm font-medium leading-none">
                    {authorName &&
                        <span
                            className="mr-2 rounded-lg bg-primary px-2 py-1 text-xs text-primary-foreground">{authorName}</span>
                    }
                    <span className="text-muted-foreground">Добавьте автора</span>
                </p>
                <DropdownMenu open={open} onOpenChange={setOpen}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MoreHorizontal/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuLabel>Действия</DropdownMenuLabel>
                        <DropdownMenuGroup>
                            <DropdownMenuSeparator/>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <Tags className="mr-2 h-4 w-4"/>
                                    Выбрать автора
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent className="p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="Filter label..."
                                            autoFocus={true}
                                        />
                                        <CommandList>
                                            <CommandEmpty>Автор не найден.</CommandEmpty>
                                            <CommandList>
                                                {authors.map((author) => (
                                                    <CommandItem
                                                        key={author.id}
                                                        value={author.name}
                                                        onSelect={(authorName) => {
                                                            setAuthorName(authorName)
                                                            setOpen(false)
                                                        }}
                                                    >
                                                        {author.name}
                                                    </CommandItem>
                                                ))}
                                            </CommandList>
                                        </CommandList>
                                    </Command>
                                </DropdownMenuSubContent>
                            </DropdownMenuSub>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem className="text-red-600">
                                <Trash className="mr-2 h-4 w-4"/>
                                Удалить
                                <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </main>
    )
}
