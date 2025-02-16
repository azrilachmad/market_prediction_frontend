'use client'

import { convDate, getCookieValueByKey } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
const token = getCookieValueByKey("token");


export const getCard1Data = async (params) => {
  const { startDate, endDate } = params;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...startDate && { startDate: startDate },
      ...endDate && { endDate: endDate },
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/card1`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getCard2Data = async (params) => {
  const { startDate, endDate } = params;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...startDate && { startDate: startDate },
      ...endDate && { endDate: endDate },
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/card2`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getCard3Data = async (params) => {
  const { startDate, endDate } = params;
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...startDate && { startDate: startDate },
      ...endDate && { endDate: endDate },
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/card3`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getScheduleLog = async (params) => {
  const { startDate, endDate } = params;


  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
    params: {
      ...startDate && { startDate: startDate },
      ...endDate && { endDate: endDate },
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/schedule-log`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};
