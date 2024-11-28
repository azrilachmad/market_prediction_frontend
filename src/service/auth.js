import { getCookieValueByKey } from "@/helpers";
import axios from "axios";
import { redirect } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { enqueueSnackbar } from "notistack";

const token = getCookieValueByKey("token");

export const loginUser = async (params) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/login`, params, config
        );
        if (response) {
            console.log(response.data)
            return response.data
        }
    } catch (error) {
        return error.response
    }

};

export const logoutUser = async (params) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        credentials: 'include'
    }

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/logout`, {}, config
        );
        if (response) {
            enqueueSnackbar("Successfully logout", {variant: 'success'})
            destroyCookie(undefined, 'token')
            setCookie(null, 'authenticated', false)
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
