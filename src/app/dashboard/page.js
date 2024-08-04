"use client"

import { Grid, Icon, Paper, Typography } from "@mui/material"
import BarChartIcon from '@mui/icons-material/BarChart';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import { LineChart, PieChart, pieArcLabelClasses } from "@mui/x-charts";
/* eslint-disable react/react-in-jsx-scope */
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
export default function Dashboard() {


  const renderCardList = () => {
    return (
      <>
        <Grid container spacing={4}>
          <Grid item xs={4} className="mt-4">
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
          <Grid item xs={4} className="mt-4">
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
          <Grid item xs={4} className="mt-4">
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


  const renderChartOne = () => {

    const dataset = [
      {
        Toyota: 59,
        Honda: 57,
        Mazda: 86,
        Mitshubisi: 21,
        Suzuki: 12,
        month: 'Jan',
      },
      {
        Toyota: 50,
        Honda: 52,
        Mazda: 78,
        Mitshubisi: 28,
        Suzuki: 17,
        month: 'Feb',
      },
      {
        Toyota: 47,
        Honda: 53,
        Mazda: 106,
        Mitshubisi: 41,
        Suzuki: 8,
        month: 'Mar',
      },
      {
        Toyota: 54,
        Honda: 56,
        Mazda: 92,
        Mitshubisi: 73,
        Suzuki: 19,
        month: 'Apr',
      },
      {
        Toyota: 57,
        Honda: 69,
        Mazda: 92,
        Mitshubisi: 99,
        Suzuki: 14,
        month: 'May',
      },
      {
        Toyota: 60,
        Honda: 63,
        Mazda: 103,
        Mitshubisi: 144,
        Suzuki: 5,
        month: 'June',
      },
      {
        Toyota: 59,
        Honda: 60,
        Mazda: 24,
        Mitshubisi: 19,
        Suzuki: 28,
        month: 'July',
      },
      {
        Toyota: 65,
        Honda: 60,
        Mazda: 16,
        Mitshubisi: 49,
        Suzuki: 28,
        month: 'Aug',
      },
      {
        Toyota: 51,
        Honda: 51,
        Mazda: 95,
        Mitshubisi: 23,
        Suzuki: 32,
        month: 'Sept',
      },
      {
        Toyota: 60,
        Honda: 65,
        Mazda: 97,
        Mitshubisi: 55,
        Suzuki: 37,
        month: 'Oct',
      },
      {
        Toyota: 67,
        Honda: 64,
        Mazda: 76,
        Mitshubisi: 48,
        Suzuki: 27,
        month: 'Nov',
      },
      {
        Toyota: 61,
        Honda: 70,
        Mazda: 103,
        Mitshubisi: 25,
        Suzuki: 31,
        month: 'Dec',
      },
    ];

    const chartSetting = {
      yAxis: [
        {
          label: 'Jumlah',
        },
      ],
      height: 460,
      sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translate(-20px, 0)',
        },
      },
    };

    const valueFormatter = (value) => `${value}mm`;

    const data = [
      { value: 18, label: 'Toyota' },
      { value: 14, label: 'Honda' },
      { value: 20, label: 'Mazda' },
      { value: 25, label: 'Mitsubishi' },
      { value: 28, label: 'Suzuki' },
    ];
    const size = {
      height: 438,
    };

    return (
      <>
        <Grid container spacing={2} className="mt-8">
          <Grid item xs={8}>
            <Paper variant="outlined" className="rounded-[10px] p-4">
              <div className="flex justify-center mb-6">
                <Typography className="text-[32px] font-bold">Data Penjualan</Typography>
              </div>
              <div>
                {/* Bar Chart */}
                <BarChart
                className="p-1"
                  dataset={dataset}
                  xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                  series={[
                    { dataKey: 'Toyota', label: 'Toyota', valueFormatter },
                    { dataKey: 'Honda', label: 'Honda', valueFormatter },
                    { dataKey: 'Mazda', label: 'New York', valueFormatter },
                    { dataKey: 'Mitshubisi', label: 'Mitshubisi', valueFormatter },
                  ]}
                  {...chartSetting}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" className="rounded-[10px] pt-4 pb-10 pl-4 pr-4">
              <div className="flex justify-center mb-6">
                <Typography className="text-[32px] font-bold">Data Unit Mobil</Typography>
              </div>
              <div style={{ marginLeft: 24, }}>
                <PieChart
                  series={[
                    {
                      arcLabel: (item) => `${item.label} (${item.value})`,
                      arcLabelMinAngle: 45,
                      data,
                    },
                  ]}
                  sx={{
                    [`& .${pieArcLabelClasses.root}`]: {
                      fill: 'white',
                      fontWeight: 'bold',
                    },
                  }}
                  {...size}
                />
              </div>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  }
  const renderChartTwo = () => {
    const hi_data = [180, 178, 165, 176, 179, 180, 181, 180, 180, 185, 200, 185];
    const low_data = [160, 158, 156, 157, 160, 160, 162, 162, 165, 165, 170, 165];
    const sold_data = [170, 165, 150, 168, 168, 170, 175, 175, 175, 178, 190, 180];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];


    const data = [
      { value: 18, label: 'Toyota' },
      { value: 14, label: 'Honda' },
      { value: 20, label: 'Mazda' },
      { value: 25, label: 'Mitsubishi' },
      { value: 28, label: 'Suzuki' },
    ];
    const size = {
      height: 438,
    };

    return (
      <>
        <Grid container spacing={2} className="mt-8">
          <Grid item xs={12}>
            <Paper variant="outlined" className="rounded-[10px] p-4">
              <div className="flex justify-center mb-6">
                <Typography className="text-[32px] font-bold"></Typography>
              </div>
              <div className="mb-2 ml-12">
                <Typography className="text-[18px]">Mobil: <b>Toyota Avanza G</b> MT</Typography>
                <Typography className="text-[18px]">Tahun: <b>2023</b></Typography>
              </div>
              <div>
                <LineChart
                  height={400}
                  series={[
                    { data: low_data, label: "Market Top Price" },
                    { data: hi_data, label: "Market Bottom Price" },
                    { data: sold_data, label: "Actual Sold Price" }
                  ]}
                  xAxis={[{ scaleType: "point", data: months }]}
                />
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
        {renderChartOne()}
        {renderChartTwo()}
      </div>
    </>
  )
}
