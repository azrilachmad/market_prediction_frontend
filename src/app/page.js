/* eslint-disable no-unused-vars */
'use client'
import { MButton, MInput, MuiButton, MuiInput } from '@/components/form'
import { Button, Card, Container, Grid, Paper, Typography } from '@mui/material'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { FormProvider, useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import React, { Component, useEffect, useState } from 'react'
import { getCookieValueByKey, setCookieValue } from '@/helpers'
import { useMutation } from 'react-query'
import { enqueueSnackbar } from 'notistack'
import Dashboard from './dashboard/page'
import Image from 'next/image'

import logoSIP from './../assets/images/SIP.png';

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
    // setErrorMessage({ ...errorMessage, [name]: null })
  }

  const {
    email,
    password
  } = formData


  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    console.log(formData)
    return;
  }

  return <>
    <Container xs={12}>
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
              // errorMessage={errorMessage && errorMessage?.email ? errorMessage?.email[0] : false}
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
              // errorMessage={errorMessage && errorMessage?.password ? errorMessage?.password[0] : false}
              />
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
    </Container>
  </>
}
