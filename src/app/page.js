/* eslint-disable no-unused-vars */
'use client'
import { MuiButton, MuiInput } from '@/components/form'
import { Button, Grid, Paper, Typography } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import React, { Component, useEffect, useState } from 'react'
import { getCookieValueByKey, setCookieValue } from '@/helpers'
import { useMutation } from 'react-query'
import { enqueueSnackbar } from 'notistack'
import Dashboard from './dashboard/page'

const loginSchema = yup.object({
  email: yup.string().required('Email wajib diisi').email('Email tidak valid'),
  password: yup
    .string()
    .required('Password wajib diisi')
})

export default function Home() {
  const router = useRouter()
  const [username, setUsername] = useState()
  const [token, setToken] = useState()
  const [user_id, setUserId] = useState()
  
  const onSubmit = (payload) => {
    const params = {
      ...payload
    }
    if (params) {
      checkCustomer.mutate(params, {
        onSuccess: (data) => {
          // setCookieValue('cred_m', data)
          enqueueSnackbar("Berhasil login", { variant: "success" });
        },
        onError: (error) => {
          enqueueSnackbar("Terjadi Kesalahan", { variant: "error" });
        },
      });
    }
  }
  
  return <Dashboard/>
}
