'use client'

import { convDate } from "@/helpers";
import axios from "axios";
import { enqueueSnackbar } from "notistack";

export const getVehicleList = async (params) => {
  const { page, limit, query, sortBy, order, } = params;
  const token = localStorage.getItem('cred_m')


  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
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
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getPriceComparison = async (params) => {

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
      ...params && { jenisMobil: params },
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/comparison`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getVehicleAssetData = async (params) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/count`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};
export const getVehicleTypeCountData = async (params) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
    }
  }
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/count-type`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {
  }
};

export const getVehicleOmset = async (params) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
    }
  }
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/omset`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {
  }
};

export const getVehicleType = async (params) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/car-type`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getVehicleSalesData = async (params) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/sales`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const getVehicleTypeList = async (params) => {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    params: {
    }
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles/list`, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {

  }

};

export const updateVehicles = async (params) => {

  // return console.log(params)
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`, params, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {
    return error.response
  }

};


export const submitSinglePredict = async (params) => {
  const {
    id,
    jenis_kendaraan,
    nama_kendaraan,
    tahun_kendaraan,
    jarak_tempuh_kendaraan,
    transmisi_kendaraan,
    bahan_bakar,
    wilayah_kendaraan
  } = params;


  const data = {
    ...id && { id: id },
    ...jenis_kendaraan && { jenis_kendaraan: jenis_kendaraan },
    ...nama_kendaraan && { nama_kendaraan: nama_kendaraan },
    ...tahun_kendaraan && { tahun_kendaraan: tahun_kendaraan },
    ...jarak_tempuh_kendaraan && { jarak_tempuh_kendaraan: jarak_tempuh_kendaraan },
    ...transmisi_kendaraan && { transmisi_kendaraan: transmisi_kendaraan },
    ...bahan_bakar && { bahan_bakar: bahan_bakar },
    ...wilayah_kendaraan && { wilayah_kendaraan: wilayah_kendaraan },
  }

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/vehicles`, data, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {
    return error.response
  }

};
export const submitBulkPredict = async (params) => {

  const data = {
    data: params
  }
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/bulk-predict`, data, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {
    return error.response
  }

};