import axios from 'axios'
import { BASE_URL } from '../../../apiConfig';
import { getSession } from "next-auth/react"
import Session from 'next-auth';

export default async function GetBoard() {
    try {
        const session = await getSession();
        const token = session?.user?.image; // Deveria ter acesso ao token!!
        const response = await axios.get(`${BASE_URL}/boards`,{
            withCredentials: true,
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch(error) {
        console.error('Error posting task:', error);
        throw error; 
    }
}