import {axiosInstance} from "@/helpers/axios";
import {toast} from "sonner";
import {Author} from "@/types";

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

export const getAuthors = async (): Promise<Author[]> => {
    try {
        const response = await axiosInstance.get('/authors');
        return response.data;
    } catch (error) {
        console.error('Error fetching authors:', error);
        throw error;
    }
};

export const getAuthorById = async (id: number): Promise<Author> => {
    try {
        const response = await axiosInstance.get(`/authors/author/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching author:', error);
        throw error;
    }
}

export const deleteAuthor = (id: number) => {
    axiosInstance.delete(`/authors/delete/${id}`)
        .then(() => toast("Author deleted successfully", {
            action: {
                label: "Close",
                onClick: () => console.log("Closed")
            }
        }))
        .catch((error) => console.error(error))
}