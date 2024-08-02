"use client"

import { Grid, Icon, Paper, Typography } from "@mui/material"
import BarChartIcon from '@mui/icons-material/BarChart';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
/* eslint-disable react/react-in-jsx-scope */
export default function Dashboard() {


  const renderCardList = () => {
    return (
      <>
        <Grid container spacing={4}>
          <Grid item xs={4}>
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#2DC2BD] w-[150px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={BarChartIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[32px]"><b>Rp. 2.425.211.000</b></Typography>
                  <Typography className="text-[24px]">Penjualan</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#E5AF5A] w-[150px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={SubdirectoryArrowLeftIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[32px]"><b>Rp. 148.200.000</b></Typography>
                  <Typography className="text-[24px]">Penjualan</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#9CE37D] w-[150px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={SubdirectoryArrowRightIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[32px]"><b>Rp. 370.120.000</b></Typography>
                  <Typography className="text-[24px]">Penjualan</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  }

  return (
    <>
      <div>
        {renderCardList()}
        <h1>Dashboard</h1>
      </div>
    </>
  )
}
