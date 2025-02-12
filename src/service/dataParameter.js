'use client'

import { convDate, getCookieValueByKey } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const token = getCookieValueByKey("token");

export const getVehicleColumn = async (params) => {


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
        params: {
        }
    }

    try {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-parameter/get-column`, config
        );
        if (response) {
            return response.data
        }
    } catch (error) {

    }

};

export const getDataParameterList = async (params) => {
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-parameter`, config
        );
        if (response) {
            return response.data
        }
    } catch (error) {

    }

};

export const createDataParameter = async (params) => {
    const { parameter, table_column, status } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    }
    const data = {
        ...(parameter && { parameter }),
        ...(table_column && { table_column }),
        status: status
    };


    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-parameter/create`,
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

export const editDataParameter = async (params) => {
    const {id, parameter, table_column, status } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    }
    const data = {
        ...(parameter && { parameter }),
        ...(table_column && { table_column }),
        status: status
    };


    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-parameter/edit/${id}`,
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

export const deleteDataParameter = async (id) => {

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
            `${process.env.NEXT_PUBLIC_API_URL}/api/data-parameter/delete/${id}`,
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