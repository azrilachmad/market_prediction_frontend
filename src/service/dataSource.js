'use client'

import { convDate, getCookieValueByKey } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const token = getCookieValueByKey("token");

export const getDataSourceList = async (params) => {
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-source`, config
        );
        if (response) {
            return response.data
        }
    } catch (error) {

    }

};

export const createDataSource = async (params) => {
    const { marketplace_name, address, status } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    }
    const data = {
        ...(marketplace_name && { marketplace_name }),
        ...(address && { address }),
        status: status
    };


    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-source/create`,
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

export const editDataSource = async (params) => {
    const {id, marketplace_name, address, status } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    }
    const data = {
        ...(marketplace_name && { marketplace_name }),
        ...(address && { address }),
        status: status
    };


    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-source/edit/${id}`,
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

export const deleteDataSource = async (id) => {

    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    }

    const data = {}

    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-source/delete/${id}`,
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