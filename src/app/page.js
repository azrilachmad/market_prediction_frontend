/* eslint-disable no-unused-vars */
'use client'
import { MButton, MInput, MuiButton, MuiInput } from '@/components/form'
import { Button, Card, Container, Grid, Paper, Typography } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import React, { Component, useEffect, useState } from 'react'
import { useMutation } from 'react-query'
import { enqueueSnackbar } from 'notistack'
import Dashboard from './dashboard/page'
import Image from 'next/image'

import logoSIP from './../assets/images/SIP.png';
import { loginUser } from '@/service/auth'
import { setCookie } from 'nookies'
import { getCookieValueByKey } from '@/helpers'

const loginSchema = yup.object({
  email: yup.string().required('Email wajib diisi').email('Email tidak valid'),
  password: yup
    .string()
    .required('Password wajib diisi')
})

export default function Home() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    email: null,
    password: null,
  })

  const [errorMessage, setErrorMessage] = useState({
    email: null,
    password: null
  })

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (typeof value != "string") {
      return;
    }
    setFormData({ ...formData, [name]: value })
    setErrorMessage({ ...errorMessage, [name]: null })
  }

  const {
    email,
    password
  } = formData


  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const { email, password } = formData

    const params = {
      email: email,
      password: password,
    }

    const response = await loginUser(params)

    if (response.data?.status === 'Failed') {

      if (response.data.message === "Please provide email and password") {
        setErrorMessage({
          email: 'error',
          password: 'error'
        })
      }
      enqueueSnackbar(response.data.message, { variant: 'error' })
    } else if (response.data?.status === 'Success') {
      enqueueSnackbar('Logged In', { variant: 'success' })
      setCookie(null, 'token', response.data.token)
      setCookie(null, 'authenticated', true)
      router.push('/dashboard')
    }


  }

 
  // Fixes: Hydration failed because the initial UI does not match what was rendered on the server

  const loginView = () => {
    return (
      <div>
        <Container xs={12}>
            <>
              <div className='flex justify-center items-center text-center mt-32'>
                <div>
                  <Image
                    alt='logo-sip'
                    src={logoSIP}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className='w-[250px] h-[100px]'
                  />
                  <Typography className='text-[32px] font-bold mt-4 mb-8'>Price Check Application</Typography>
                </div>
              </div>
              <div className='flex justify-center'>
                <Card variant='outlined' className='px-8 py-8 rounded-[8px] w-[600px]'>
                  <Typography className='text-[18px] font-semibold flex justify-center '>Please Login</Typography>

                  <form onSubmit={(e) => handleSubmit(e)}>

                    <div className='mt-2'>
                      <Typography className="mb-2 font-semibold">Email:</Typography>
                      <MInput
                        fullwidth
                        variant="outlined"
                        name="email"
                        placeholder="Input Email"
                        value={email}
                        onChange={(event) => handleInputChange(event)}
                        type="email"
                        error={errorMessage && errorMessage.email ? true : false}
                      />
                    </div>
                    <div className='mt-4'>
                      <Typography className="mb-2 font-semibold">Password:</Typography>
                      <MInput
                        fullwidth
                        variant="outlined"
                        name="password"
                        placeholder="Input Password"
                        value={password}
                        onChange={(event) => handleInputChange(event)}
                        type="password"
                        error={errorMessage && errorMessage.password ? true : false} />
                    </div>
                    <div className='mt-6 flex justify-end '>
                      <MButton
                        type="submit"
                        label={"Login"}
                        // loading={isLoadingSubmit}
                        onClick={(e) => {
                          handleSubmitLogin(e)
                        }}
                        className='w-[100px]'
                      />
                    </div>
                  </form>
                </Card>
              </div>
            </>
        </Container>
      </div>
    )
  }

  return loginView()

}
