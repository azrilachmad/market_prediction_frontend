'use client'

import { convDate, getCookieValueByKey } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const token = getCookieValueByKey("token");

export const getJobSchedule = async (params) => {
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
            `${process.env.NEXT_PUBLIC_API_URL}/api/job-schedule`, config
        );
        if (response) {
            return response.data
        }
    } catch (error) {

    }

};


export const editJobSchedule = async (params) => {
    const {id, job_schedule, time, max_record, ai_iqr, ai_temp, interval } = params;


    const config = {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`
        },
    }
    const data = {
        ...(job_schedule && { job_schedule }),
        ...(time && { time }),
        ...(max_record && { max_record }),
        ...(ai_iqr && { ai_iqr }),
        ...(ai_temp && { ai_temp }),
        ...(interval && { interval }),
    };


    try {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/api/job-schedule/edit/${id}`,
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
