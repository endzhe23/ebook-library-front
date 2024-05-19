type Author = {
    id: number,
    name: string;
}

type Book = {
    id: string,
    author: Author[];
    title: string;
    description: string;
    ISBN: string;
};

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">

        </main>
    );
}
