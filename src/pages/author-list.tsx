"use client"
import "../app/globals.css"

import React, {useState} from 'react';

const AuthorList: React.FC = () => {
    const [authors, setAuthors] = useState<string[]>([]);
    const [selectedAuthorId, setSelectedAuthorId] = useState<string>('');

    const handleAuthorChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        setSelectedAuthorId(event.target.value);
    };

    const handleAddAuthor = (): void => {
        if (selectedAuthorId && !authors.includes(selectedAuthorId)) {
            setAuthors([...authors, selectedAuthorId]);
            setSelectedAuthorId('');
        }
    };

    const handleRemoveAuthor = (authorId: string): void => {
        setAuthors(authors.filter((item) => item !== authorId));
    };

    return (
        <div>
            <h3>Authors</h3>
            <div>
                <select value={selectedAuthorId} onChange={handleAuthorChange}>
                    <option value="">Select an author</option>
                    <option value="1">Author 1</option>
                    <option value="2">Author 2</option>
                    <option value="3">Author 3</option>
                </select>
                <button onClick={handleAddAuthor}>Add</button>
            </div>
            <ul>
                {authors.map((authorId: string) => (
                    <li key={authorId}>
                        Author {authorId}
                        <button onClick={() => handleRemoveAuthor(authorId)}>Remove</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuthorList;