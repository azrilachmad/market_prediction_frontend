'use client'

import { convDate, getCookieValueByKey } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const token = getCookieValueByKey("token");

export const getUserList = async (params) => {
    const { page, limit, query, sortBy, order, } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        params: {
            ...page && { page: page },
            ...limit && { limit: limit },
            ...sortBy && { sortBy: sortBy },
            ...order && { order: order },
            ...query && { search: query },
        }
    }

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/userlist`, config
        );
        if (response) {
            return response.data
        }
    } catch (error) {

    }

};

export const createUser = async (params) => {
    const { userType, name, email, password, confirmPassword, } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
    }
    const data = {
        ...(userType && { userType }),
        ...(name && { name }),
        ...(email && { email }),
        ...(password && { password }),
        ...(confirmPassword && { confirmPassword }),
    };

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/user/create`,
            data, // Pass the `data` object directly
            config
        );
        if (response) {
            return response.data
        }
    } catch (error) {
        return error.response.data
    }

};