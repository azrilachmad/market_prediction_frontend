/* eslint-disable @next/next/no-img-element */
/* eslint-disable no-unused-vars */
"use client"

import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { lightTheme } from '@/themes/theme'

import {
  Box,
  Button,
  Collapse,
  IconButton,
  List,
  Grid,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  ThemeProvider,
  CssBaseline
} from '@mui/material'
import {
  ExpandLess,
  ExpandMore,
  Menu as MenuIcon,
  Dashboard,
  Store,
  Settings
} from '@mui/icons-material'
import {
  styled,
  createTheme
} from '@mui/material/styles'

import Image from 'next/image'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { getCookieValueByKey, isArray, showPopup } from '../helpers'
import { parseCookies, setCookie } from 'nookies'
import { getUserData, logoutUser } from '@/service/auth'
import { enqueueSnackbar } from 'notistack'
import profileIcon from './../assets/images/profile.png';
import sipIcon from './../assets/images/sip-icon.png';


const drawerWidth = 260

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden'
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`
  }
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar
}))

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  backgroundColor: '#5538f4',
  boxShadow: 'none',
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    }),
    backgroundColor: '#5538f4',
    boxShadow: 'none'
  })
}))

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 10,
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}))

const drawerTheme = createTheme({
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(',')
  },
  components: {
    MuiDialog: {
      styleOverrides: {
        paper: {
          maxWidth: '800px !important',
          maxHeight: '650px !important'
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: '0px !important'
        }
      }
    },
    MuiTypography: {
      styleOverrides: {
        body1: {
          fontSize: 14,
          fontWeight: 400,
          color: '#656464'
        }
      }
    },
    MuiGrid: {
      styleOverrides: {
        root: {
          minWidth: 'none !important'
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paperAnchorDockedLeft: {
          borderRight: 0
        },
        paper: {
          boxShadow: '-36px 0 36px 6px #000000',
        }
      }
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          // fill: "#4E4E4E",
        }
      }
    }
  }
})

export async function getServerSideProps(context) {
  const { req } = context;

  const isAuthenticated = false; // Your authentication logic

  if (!isAuthenticated) {
    return {
      redirect: {
        destination: '/',
        permanent: false, // Set to true for permanent redirects (HTTP 301)
      },
    };
  }
  if (isAuthenticated && path === '/') {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false, // Set to true for permanent redirects (HTTP 301)
      },
    };
  }

  return {
    props: {}, // Pass props to the component if necessary
  };
}



export default function Header({ pageProps }) {
  const path = usePathname()
  const router = useRouter()
  const [theme] = useState(lightTheme)

  const [isDrawerOpen, setIsDrawerOpen] = useState(true)
  const [isExpandable, setIsExpandable] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const toggleExpand = () => {
    setIsExpandable(!isExpandable)
  }

  const handleNavigation = (value) => {
    router.push(value.navigation)
    setIsExpandable(!isExpandable)
  }

  const toggleDrawer = () => {
    if (isDrawerOpen === true) {
      setIsExpandable(false)
      setIsDrawerOpen(!isDrawerOpen)
    } else if (isDrawerOpen === false) {
      setTimeout(() => {
        if (
          router.pathname === '/dashboard' ||
          router.pathname === '/price-check'
        ) {
          setIsExpandable(true)
        }
        setIsDrawerOpen(!isDrawerOpen)
      }, 10)
    }
  }

  const handleAccMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleCloseAccMenu = () => {
    setAnchorEl(null)
  }




  const menus = [
    {
      title: 'Dashboard',
      icon: (
        <Dashboard />
      ),
      navigation: '/dashboard',
      expandable: false,
      refKey: 'toggleDashboard',
      children: []
    },
    {
      title: 'Price Check',
      icon: (
        <Store />
      ),
      navigation: '/market-prediction',
      expandable: false,
      refKey: 'toggleMarketPrediction',
      children: []
    },
    {
      title: 'Setting',
      icon: (
        <Settings />
      ),
      navigation: '/setting',
      expandable: false,
      refKey: 'toggleSettting',
      children: []
    }
  ]

  const getMenuTitle = () => {
    const pathArray = path.split('/')
    const currentPath = isArray(pathArray) ? pathArray[1] : path
    const menuTitle = currentPath.replace(/^\/|\/$/g, '').replace(/-|\s/g, ' ')
    if (router.pathname === '/a') {
      return ''
    } else {
      return menuTitle
    }
  }

  const handleLogout = () => {
    showPopup(
      'confirm',
      'Are you sure you want to logout?',
      'Yes',
      async () => {
        const response = await logoutUser()
        if (response.message === 'Successfully logged out') {
          setAnchorEl(null)
          router.push('/')
        }
      }
    )
  }


  const [profileName, setProfileName] = useState('')
  const menuTitle = getMenuTitle()
  const open = Boolean(anchorEl)
  useEffect(() => {
    (
      async () => {
        const cookies = parseCookies('token')
        const params = {
          token: cookies.token
        }
        const userResponse = await getUserData(params)

        if (userResponse?.data.id && cookies.token && userResponse?.data.status !== 'Failed') {
          setProfileName(userResponse?.data.name)
          if (path === '/') {
            router.push('/dashboard')
          }
        }

        if (userResponse?.data.status === 'Failed') {
          if (path !== '/') {
            enqueueSnackbar("Silakan login terlebih dahulu", { variant: 'error' })
            router.push('/')
          }
          setCookie(null, 'authenticated', false)
        }
      }
    )();
  },);


  return (
    <div>
      {path === '/' || path === '/404' ? (<>
        {pageProps}
      </>
      ) : (
        <>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <ThemeProvider theme={drawerTheme}>
              <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <AppBar
                  position="absolute"
                  open={isDrawerOpen}
                  className="flex justify-between"
                >
                  <Toolbar>
                    <IconButton
                      color="inherit"
                      aria-label="open drawer"
                      onClick={() => toggleDrawer()}
                      edge="start"
                      sx={{
                        marginRight: 5,
                        ...(isDrawerOpen && { display: 'none' })
                      }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <div className="flex items-center w-full justify-between">
                      <Typography
                        variant="h6"
                        noWrap
                        component="div"
                        className="text-2xl font-bold capitalize "
                      >
                        {menuTitle || ''}
                      </Typography>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Button
                          id="basic-button"
                          aria-controls="basic-menu"
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                          onClick={(event) => handleAccMenu(event)}
                          style={{
                            minWidth: 0,
                            padding: 'auto 0px',
                            textTransform: 'none',
                            fontWeight: '400'
                          }}
                        >
                          <div
                            style={{
                              width: '40px',
                              height: '40px',
                              overflow: 'hidden',
                              borderRadius: '50%',
                              position: 'relative',
                              margin: 'auto 5px'
                            }}
                          >
                            <Image
                              alt='profile'
                              src={profileIcon}
                              width={0}
                              height={0}
                              sizes="100vw"
                              className='w-[32px] h-[32px] mt-1'
                            />
                          </div>
                          <span style={{ color: '#fff' }}>
                            {profileName ? profileName : '-'}
                          </span>
                          <ExpandMore style={{ color: '#fff' }} />
                        </Button>
                        <Menu
                          id="basic-menu"
                          anchorEl={anchorEl}
                          // getContentAnchorEl={null}
                          open={open}
                          onClose={() => handleCloseAccMenu()}
                          MenuListProps={{
                            'aria-labelledby': 'basic-button'
                          }}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'center'
                          }}
                          transformOrigin={{
                            vertical: 'top',
                            horizontal: 'center'
                          }}
                        >
                          {''}
                          <MenuItem onClick={() => { handleLogout() }}>Logout</MenuItem>
                        </Menu>
                      </div>
                    </div>
                  </Toolbar>
                </AppBar>
                <Drawer variant="permanent" open={isDrawerOpen}>
                  <div>
                    <Grid
                      container
                      alignItems="start"
                      spacing={1}
                      className={
                        isDrawerOpen
                          ? 'flex justify-between mt-[2px] pr-2'
                          : 'flex justify-between pr-2'
                      }
                    >
                      <Grid item className="">
                        {isDrawerOpen ? (
                          <div className="flex items-center">
                            <Image
                              alt='sip-icon'
                              src={sipIcon}
                              width={0}
                              height={0}
                              className='w-[40px] h-[40px] mt-1 ml-[12px]'
                            />
                            <Typography className='ml-4 mt-1 text-[18px] font-semibold text-black'>POC PT.SIP</Typography>
                          </div>
                        ) : (
                          <Image
                            style={{
                              marginLeft: 12,
                              width: 'auto',
                              height: 40,
                              position: 'relative',
                              top: 14
                            }}
                            className='ml-[10px] w-auto h-[40px]'
                            onMouseEnter={() => toggleDrawer()}
                            src={sipIcon}
                            alt="sip-icon"
                            width={0}
                            height={0}
                          />
                        )}
                      </Grid>
                      <Grid item>
                        {isDrawerOpen ? (
                          <IconButton
                            // className="mt-1.5"
                            onClick={() => toggleDrawer()}
                          >
                            <ChevronLeftIcon />
                          </IconButton>
                        ) : null}
                      </Grid>
                    </Grid>
                  </div>
                  <List
                    onMouseEnter={() => (!isDrawerOpen ? toggleDrawer() : null)}
                    className={isDrawerOpen ? 'mt-[12px]' : 'mt-[24px]'}
                  >
                    {menus.map((value, index) => (
                      <ListItem
                        key={value.title}
                        disablePadding
                        sx={{ display: 'block' }}
                        onClick={() => handleNavigation(value)}
                        className={
                          router.pathname === value.navigation
                            ? 'no-underline bg-[#dadef1]'
                            : router.pathname === '/dashboard' ||
                              (router.pathname === '/price-check' &&
                                !isDrawerOpen &&
                                value.navigation === '/settings')
                              ? 'no-underline bg-[#dadef1]'
                              : 'mt-1.5'
                        }
                      >
                        <ListItemButton
                          onClick={() =>
                            value.expandable ? toggleExpand() : null
                          }
                          sx={{
                            minHeight: 48,
                            justifyContent: isDrawerOpen ? 'initial' : 'center',
                            px: 2.5
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: isDrawerOpen ? 3 : 'auto',
                              justifyContent: 'center',
                              color: '#5538f4'
                            }}
                          >
                            {value.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={value.title}
                            sx={{ opacity: isDrawerOpen ? 1 : 0 }}
                          />
                          {value.expandable ? (
                            isDrawerOpen ? (
                              isExpandable ? (
                                <ExpandLess />
                              ) : (
                                <ExpandMore />
                              )
                            ) : null
                          ) : null}
                        </ListItemButton>
                        {value.expandable ? (
                          <Collapse
                            className="mt-[1px] ml-[2px]"
                            in={isExpandable}
                            timeout="auto"
                            unmountOnExit
                          >
                            <List component="div" disablePadding>
                              {value.children.map((data, index) => (
                                <ListItemButton
                                  onClick={() => handleNavigation(data)}
                                  className={
                                    router.pathname === data.navigation
                                      ? 'no-underline bg-[#dadef1] mb-1'
                                      : 'mt-1.5 mb-1'
                                  }
                                  key={index}
                                  sx={{ pl: 4 }}
                                >
                                  <ListItemText
                                    sx={{ ml: 4 }}
                                    primary={data.title}
                                  />
                                </ListItemButton>
                              ))}
                            </List>
                          </Collapse>
                        ) : null}
                      </ListItem>
                    ))}
                  </List>
                </Drawer>
                <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                  <ThemeProvider theme={theme}>
                    <DrawerHeader />
                    {pageProps}
                  </ThemeProvider>
                </Box>
              </Box>
            </ThemeProvider>
            {/* </main> */}
          </ThemeProvider>

        </>
      )}
    </div>
  )
}
