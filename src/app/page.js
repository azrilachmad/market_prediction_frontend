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
import { loginUser } from '../service/auth'
import { enqueueSnackbar } from 'notistack'

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
  

  useEffect(() => {
    if (localStorage.getItem('user')) setUsername(localStorage.getItem('user'))
    if (localStorage.getItem('cred_m')) setToken(localStorage.getItem('token'))
    if (localStorage.getItem('user_id')) setToken(localStorage.getItem('user_id'))
    if (localStorage.getItem('cred_m')) {
      // enqueueSnackbar('Anda sudah login!', { variant: 'warning' })
      router.push('/dashboard');
    }
  }, [token, router])

  const checkCustomer = useMutation({ mutationFn: loginUser });


  const loginMethods = useForm({
    mode: 'onChange',
    resolver: yupResolver(loginSchema)
  })

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
  
  return router.push('/dashboard')
}
