import axios from "axios";
import { parseCookies } from "nookies";
import { enqueueSnackbar } from "notistack";

const cookies = parseCookies('token')

export const loginUser = async (params) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        credentials: 'include'
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login`, params, config
        );
        if (response) {
            return response.data
        }
    } catch (error) {
        return error.response
    }

};


export const getUserData = async (params) => {
    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${params.token}`
        },
    }

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user`, config
        );
        if(response) {
            return response.data
        }
    } catch(error) {
        return error.response
    }
}
