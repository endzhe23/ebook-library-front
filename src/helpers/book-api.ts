import {axiosInstance} from "@/helpers/axios";
import {Book} from "@/types/intex";
import {toast} from "sonner";

export const createBook = (requestData: { title: string, description: string, authorIds: number[], ISBN: string }) => {
    axiosInstance.post("/books/add", requestData)
        .then(() => toast("Book created successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}

export const getBooks = (callback: (books: Book[]) => void): void => {
    axiosInstance
        .get('/books')
        .then((response) => {
            const books: Book[] = response.data;
            callback(books);
        })
        .catch((error) => {
            console.error('Error fetching books:', error);
            callback([]);
        });
}

export const getBookById = (id: number, callback: (book: Book) => void): void => {
    axiosInstance.get(`/books/book/${id}`).then((response) => {
        const book: Book = response.data;
        callback(book)
    })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
}

export const deleteBook = (id: number) => {
    axiosInstance.delete(`/books/delete/${id}`)
        .then(() => toast("Book deleted successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}