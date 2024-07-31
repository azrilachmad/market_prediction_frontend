'use client'
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-unused-vars */
import { Poppins } from 'next/font/google'

import './globals.css'
import { lightTheme } from '../themes/theme'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { StyledEngineProvider } from '@mui/material/styles'
import Headers from '@/components/Header'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'] })
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { SnackbarProvider, enqueueSnackbar } from 'notistack'
import { getCookieValueByKey } from '@/helpers'

export default function RootLayout({ children }) {
  const router = useRouter()
  const path = usePathname()
  const [toasted, setToasted] = useState(false)
  const [username, setUsername] = useState()
  const [token, setToken] = useState()




  const queryClient = new QueryClient()
  return (
    <html lang="en">
      <head>
        <title>POC PT.SIP</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="description" content="Hydragi Internal Apps" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <QueryClientProvider client={queryClient}>
        <SnackbarProvider>
          <ThemeProvider theme={lightTheme}>
            <body id="__next">
              <CssBaseline />
                <Headers pageProps={children} />
            </body>
          </ThemeProvider>
        </SnackbarProvider>
      </QueryClientProvider>
    </html>
  )
}
