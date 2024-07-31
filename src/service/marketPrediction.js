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

export const updateOfferingData = async (params, id) => {
  const {
    document_name,
    quotation_number,
    customer_name,
    customer_phone,
    customer_address,
    customer_company,
    project_name,
    products,
    ppn,
    note,
    document_date,
  } = params;
  const token = localStorage.getItem('cred_m')

  const data = {
    ...document_name && { document_name: document_name },
    ...quotation_number && { quotation_number: quotation_number },
    ...customer_name && { customer_name: customer_name },
    ...customer_address && { customer_address: customer_address },
    ...customer_phone && { customer_phone: customer_phone },
    ...customer_company && { customer_company: customer_company },
    ...project_name && { project_name: project_name },
    ...products && { products: JSON.stringify(products) },
    ...ppn && { ppn: ppn },
    ...note && { note: note },
    ...document_date && { document_date: convDate(document_date, 'YYYY-MM-DD hh:mm:ss') },
  }

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
  }

  try {
    const response = await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}/${process.env.NEXT_PUBLIC_API_VERSION}/offers/${id}`, data, config
    );
    if (response) {
      return response.data
    }
  } catch (error) {
    return error.response
  }

};


export const deleteOfferingData = async (id) => {
  const token = localStorage.getItem('cred_m')

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
  }

  try {
    const response = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}/${process.env.NEXT_PUBLIC_API_VERSION}/offers/${id}`, config
    );
    if (response) {
      console.log(response)
      enqueueSnackbar(response.data.message, { variant: 'success' })
      return response
    }
  } catch (error) {
    enqueueSnackbar("Terjadi kesalahan", { variant: 'error' })
  }

};

export const generateOffering = async (id) => {
  const token = localStorage.getItem('cred_m')

  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    },
  }

  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${process.env.NEXT_PUBLIC_API_PREFIX}/${process.env.NEXT_PUBLIC_API_VERSION}/generate-pdf/${id}`, config
    );
    if (response) {
      console.log(response)
      enqueueSnackbar("Success Generate PDF", { variant: 'success' })
      return response
    }
  } catch (error) {
    enqueueSnackbar("Success Generate PDF", { variant: 'success' })
  }

};
