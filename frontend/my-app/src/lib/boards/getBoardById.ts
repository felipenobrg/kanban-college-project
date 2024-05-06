import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';

interface GetBoardById {
    id: number | null
}

export default async function GetBoardById(props: GetBoardById) {
    const { id } = props
    try {
        const response = await axios.get(`${BASE_URL}/boards/${id}`, {
            withCredentials: true
        });

        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}