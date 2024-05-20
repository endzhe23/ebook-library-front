"use client";

import {usePathname} from 'next/navigation'
import Link from "next/link";

export default function Home() {
    const pathname = usePathname()
    return (
        <main className="flex min-h-screen flex-col items-left justify-between p-24">
            <nav>
                <Link className={`link ${pathname === '/books' ? 'active' : ''}`} href="/books">
                    Books
                </Link>
                <Link
                    className={`link ${pathname === '/authors' ? 'active' : ''}`}
                    href="/authors"
                >
                    Authors
                </Link>
            </nav>
        </main>
    );
}
