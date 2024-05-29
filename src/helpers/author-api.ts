import {axiosInstance} from "@/helpers/axios";
import {toast} from "sonner";
import {Author} from "@/types/intex";

export const createAuthor = (requestData: { name: string, bookIds: number[] }) => {
    axiosInstance.post("/authors/add", requestData)
        .then(() => toast("Author created successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}

export const getAuthors = (callback: (authors: Author[]) => void): void => {
    axiosInstance.get('/authors').then((response) => {
        const authors: Author[] = response.data;
        callback(authors)
    })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
}

export const getAuthorById = (id: number, callback: (author: Author) => void): void => {
    axiosInstance.get(`/authors/author/${id}`).then((response) => {
        const author: Author = response.data;
        callback(author)
    })
        .catch((error) => {
            console.error('Error fetching posts:', error);
        });
}