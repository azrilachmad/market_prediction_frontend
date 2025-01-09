"use client"

import { Button, Grid, Icon, Paper, ThemeProvider, Typography } from "@mui/material"
import BarChartIcon from '@mui/icons-material/BarChart';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { LineChart, PieChart, pieArcLabelClasses } from "@mui/x-charts";
/* eslint-disable react/react-in-jsx-scope */
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { getVehicleAssetData, getVehicleOmset, getVehicleSalesData, getVehicleType, getVehicleTypeCountData } from "@/service/marketPrediction";
import { useQuery } from "react-query";
import { dateTimePickerTabsClasses } from "@mui/x-date-pickers";
import { convDate, removeDuplicateData, transformDataseries, transformDataset } from "@/helpers";
import { getCard1Data, getCard2Data, getCard3Data, getScheduleLog } from "@/service/dashboard";
import { Edit, PendingActions } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { MButton, YMDatePicker } from "@/components/form";
import dayjs from "dayjs";
import { primaryButton, secondaryButton } from "@/themes/theme";
import { closeBtn } from "@/styles/theme/theme";
export default function Dashboard() {
  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  const thousandSeparator = (number) => {
    return addCommas(removeNonNumeric(number))
  }


  const [filterData, setFilterData] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days before today
    endDate: new Date(), // Today
  })

  const initialFilterData = {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days before today
    endDate: new Date(), // Today
  }

  console.log(filterData)

  const handleInputDateChange = (event, name) => {
    setFilterData({ ...filterData, [name]: event.$d })
  }

  const { data: card1Data, isLoading: isLoadingCard1Data, } = useQuery({
    queryKey: [
      "card-data1",
      {
      },
    ],
    queryFn: ({ queryKey }) => getCard1Data(queryKey[1]),
  });

  const { data: card2Data, isLoading: isLoadingCard2Data, } = useQuery({
    queryKey: [
      "card-data2",
      {
      },
    ],
    queryFn: ({ queryKey }) => getCard2Data(queryKey[1]),
  });

  const { data: card3Data, isLoading: isLoadingCard3Data, } = useQuery({
    queryKey: [
      "card-data3",
      {
      },
    ],
    queryFn: ({ queryKey }) => getCard3Data(queryKey[1]),
  });

  const { data: logData, loading: isLoadingLogData, refetch: mutateLogData, } = useQuery({
    queryKey: [
      "vehicle-sales-data",
      {
        ...filterData.startDate && { startDate: convDate(filterData.startDate, 'YYYY-MM-DD') },
        ...filterData.endDate && { endDate: convDate(filterData.endDate, 'YYYY-MM-DD') },
      },
    ],

    queryFn: ({ queryKey }) => getScheduleLog(queryKey[1]),
  });


  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (logData?.data.length) {
      setChartData(logData?.data)
    }
  }, [logData, setChartData])




  const renderCardList = () => {
    return (
      <>
        <Grid container spacing={4}>
          <Grid item xs={4} className="mt-4">
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#5538f4] w-[100px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={DirectionsCarIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[20px]"><b>{thousandSeparator(card1Data?.data ? card1Data?.data : 0)} Unit</b></Typography>
                  <Typography className="text-[14px]">Total Data</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4} className="mt-4">
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#E5AF5A] w-[100px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={PendingActions} />
                </div>
                <div className="p-6">
                  <Typography className="text-[20px]"><b>{thousandSeparator(card2Data?.data ? card2Data?.data : 0)} Unit</b></Typography>
                  <Typography className="text-[14px]">To be processed</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4} className="mt-4">
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#9CE37D] w-[100px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={SubdirectoryArrowRightIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[20px]"><b>{thousandSeparator(card3Data?.data ? card3Data?.data : 0)} Unit</b></Typography>
                  <Typography className="text-[14px]">Processed Data</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  }

  const renderFilterPaper = () => {
    return (
      <>
        <Paper variant="outlined" className="w-[700px] rounded-[8px] p-4 mt-12">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography className="font-bold mb-4">Filter:</Typography>
              <div className="flex items-center">
                <YMDatePicker
                  className='mr-4'
                  fullwidth={true}
                  name="startDate"
                  label="Start Date"
                  inputFormat={'DD-MM-YYYY'}
                  onChange={(event) => handleInputDateChange(event, 'startDate')}
                  value={dayjs(filterData.startDate)}
                  closeOnSelect={true}
                // errorMessage={errorMessage && errorMessage?.startDate ? errorMessage?.startDate[0] : false}
                />
                <YMDatePicker
                  className='mr-4'
                  fullwidth={true}
                  name="endDate"
                  label="End Date"
                  inputFormat={'DD-MM-YYYY'}
                  onChange={(event) => handleInputDateChange(event, 'endDate')}
                  value={dayjs(filterData.endDate)}
                  closeOnSelect={true}
                // errorMessage={errorMessage && errorMessage?.endDate ? errorMessage?.endDate[0] : false}
                />
                <ThemeProvider theme={primaryButton}>
                  <MButton
                    className='mr-4'
                    label="Apply"
                    onClick={() => {
                      mutateLogData();
                    }}
                  />
                </ThemeProvider>
                <ThemeProvider theme={secondaryButton}>
                  <MButton
                    label="Reset"
                    onClick={() => {
                      setFilterData(initialFilterData)
                      mutateLogData()
                    }}
                  />
                </ThemeProvider>
              </div>
            </Grid>
          </Grid>
        </Paper>
      </>
    )
  }

  const renderChartOne = () => {
    const vehicleSalesData = []

    console.log(chartData)

    const xAxisData = chartData?.map((item) =>
      new Date(item.date)
    );
    const totalToken = chartData?.map((item) => item.total_token);
    const averageToken = chartData?.map((item) => item.average_token);
    
    const totalData = chartData?.map((item) => item.total_data);
    const totalDuration = chartData?.map((item) => item.duration);



    return (
      <>
        <Grid container spacing={2} className="mt-2">
          <Grid item xs={6}>
            <Paper variant="outlined" className="rounded-[10px] py-6">
              <div className="flex justify-center ">
                <Typography className="text-[20px] font-bold mb-4">AI Token Usage per Schedule
                </Typography>
              </div>
              <div>
                {/* Bar Chart */}
                <LineChart
                  xAxis={[
                    {
                      label: 'Date',
                      data: xAxisData,
                      tickInterval: xAxisData,
                      scaleType: "time",
                      valueFormatter: (date) => dayjs(date).format("DD/MM/YYYY"),
                    },
                  ]}
                  series={[
                    {
                      id: 'series-1',
                      label: 'Total Token',
                      data: totalToken ? totalToken : [],
                      valueFormatter: (value) => thousandSeparator(value),
                    },
                    {
                      id: 'series-2',
                      label: 'Average Token per hit',
                      data: averageToken ? averageToken : [],
                      valueFormatter: (value) => (value),

                    },
                  ]}

                  // width={'auto'}
                  height={400}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper variant="outlined" className="rounded-[10px] py-6">
              <div className="flex justify-center ">
                <Typography className="text-[20px] font-bold mb-4">Time Taken by Scheduler Processes</Typography>
              </div>
              <div>
                {/* Bar Chart */}
                <LineChart
                  xAxis={[
                    {
                      label: 'Date',
                      data: xAxisData,
                      tickInterval: xAxisData,
                      scaleType: "time",
                      valueFormatter: (date) => dayjs(date).format("DD/MM/YYYY"),
                    },
                  ]}
                  series={[
                    {
                      id: 'series-1',
                      label: 'Total Data',
                      data: totalData ? totalData : [],
                      valueFormatter: (value) => `${value} Data`,
                      color: 'purple'
                    },
                    {
                      id: 'series-2',
                      label: 'Duration (s)',
                      data: totalDuration ? totalDuration : [],
                      valueFormatter: (value) => `${value} Seconds`,
                      color: 'blue',

                    },
                  ]}

                  // width={'auto'}
                  height={400}
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
        {renderFilterPaper()}
        {renderChartOne()}
      </div>
    </>
  )
}
