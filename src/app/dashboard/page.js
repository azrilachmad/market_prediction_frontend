"use client"

import { Grid, Icon, Paper, Typography } from "@mui/material"
import BarChartIcon from '@mui/icons-material/BarChart';
import SubdirectoryArrowLeftIcon from '@mui/icons-material/SubdirectoryArrowLeft';
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import { LineChart, PieChart, pieArcLabelClasses } from "@mui/x-charts";
/* eslint-disable react/react-in-jsx-scope */
import { BarChart } from '@mui/x-charts/BarChart';
import { axisClasses } from '@mui/x-charts/ChartsAxis';
import { getPriceComparison, getVehicleAssetData, getVehicleOmset, getVehicleSalesData, getVehicleType, getVehicleTypeCountData, getVehicleTypeList } from "@/service/marketPrediction";
import { useQuery } from "react-query";
import { dateTimePickerTabsClasses } from "@mui/x-date-pickers";
import { removeDuplicateData, transformDataseries, transformDataset } from "@/helpers";
import { MSelect } from "@/components/form";
import { useState } from "react";
import { enqueueSnackbar } from "notistack";
export default function Dashboard() {

  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  const thousandSeparator = (number) => {
    return addCommas(removeNonNumeric(number))
  }

  const [jenisMobil, setJenisMobil] = useState(null)
  const [comparisonData, setComparisonData] = useState([])
  const [comparisonMonth, setComparisonMonth] = useState([])

  const {
    data: vehicleAssetData,
    isLoading: isLoadingVehicleAssetData,
  } = useQuery({
    queryKey: [
      "vehicle-asset",
      {
      },
    ],
    queryFn: ({ queryKey }) => getVehicleAssetData(queryKey[1]),
  });

  const {
    data: vehicleTypeCountData,
    isLoading: isLoadingVehicleTypeCountData,
  } = useQuery({
    queryKey: [
      "vehicle-type-count",
      {
      },
    ],
    queryFn: ({ queryKey }) => getVehicleTypeCountData(queryKey[1]),
  });

  const {
    data: vehicleOmsetData,
    isLoading: isLoadingVehicleOmsetData,
  } = useQuery({
    queryKey: [
      "omset",
      {
      },
    ],
    queryFn: ({ queryKey }) => getVehicleOmset(queryKey[1]),
  });

  const {
    data: vehicleTypeData,
    isLoading: isLoadingVehicleTypeData,
    refetch: mutateVehicleTypeData,
  } = useQuery({
    queryKey: [
      "vehicle-data",
      {
      },
    ],
    queryFn: ({ queryKey }) => getVehicleType(queryKey[1]),
  });

  const {
    data: vehicleSalesData,
    refetch: mutateVehicleSalesData,
  } = useQuery({
    queryKey: [
      "vehicle-sales-data",
      {
      },
    ],
    queryFn: ({ queryKey }) => getVehicleSalesData(queryKey[1]),
  });

  const {
    data: vehicleTypeListData,
    refetch: mutateVehicleTypeListData,
  } = useQuery({
    queryKey: [
      "vehicle-type-list",
      {
      },
    ],
    queryFn: ({ queryKey }) => getVehicleTypeList(queryKey[1]),
  });

  const handleInputChange = async (event) => {
    const { name, value } = event.target
    if (typeof value != "string") {
      return;
    }
    setJenisMobil(value)
    console.log(value)

    const response = await getPriceComparison(value)
    if (response.data?.error) {
      
    } else {
      if (response.status === 200) {
        let newMonthData = []
        let newComparisonData = []
        console.log(response.data)
        response.data.map((item) => {
          newComparisonData.push(item.avg_actual_sold_price * 1)
          newMonthData.push(item.bulan)
        })
        setComparisonData([{data: newComparisonData, label: value}])
        setComparisonMonth(newMonthData)
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" })
        // mutateVehicleData()
      }
    }
  }

  const renderCardList = () => {
    return (
      <>
        <Grid container spacing={4}>
          <Grid item xs={4} className="mt-4">
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#2DC2BD] w-[150px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={DirectionsCarIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[32px]"><b>{thousandSeparator(vehicleAssetData?.data ? vehicleAssetData?.data : 0)} Unit</b></Typography>
                  <Typography className="text-[24px]">Jumlah Asset</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4} className="mt-4">
            <Paper variant="outlined" className="rounded-[10px]">
              <div className="flex">
                <div className="flex justify-center items-center bg-[#E5AF5A] w-[150px] rounded-l-[10px] p-4">
                  <Icon className="text-white text-[48px]" component={BarChartIcon} />
                </div>
                <div className="p-6">
                  <Typography className="text-[32px]"><b>{vehicleTypeCountData?.data ? `${thousandSeparator(vehicleTypeCountData?.data)} Jenis` : '0'}</b></Typography>
                  <Typography className="text-[24px]">Jumlah Jenis Mobil</Typography>
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
                  <Typography className="text-[32px]"><b>{vehicleOmsetData?.data ? `Rp${thousandSeparator(vehicleOmsetData?.data)}` : '0'}</b></Typography>
                  <Typography className="text-[24px]">Total Omset</Typography>
                </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </>
    )
  }


  const renderChartOne = () => {

    let datasets = []
    vehicleSalesData?.data.map((data) => {
      datasets.push({
        [data.jenismobil]: data.harga
      })
    })
    let data = []
    if (vehicleTypeData?.data) {
      vehicleTypeData?.data.map((val) => {
        data.push({ value: val.value * 1, label: val.jenismobil })
      })
    }

    const chartSetting = {
      yAxis: [
        {
          label: 'Penjualan',
        },
      ],
      height: 460,
      sx: {
        [`.${axisClasses.left} .${axisClasses.label}`]: {
          transform: 'translate(-20px, 0)',
        },
      },
    };

    const valueFormatter = (value) => `${value}`;

    let dataSeries = []
    if (vehicleSalesData?.data) {
      vehicleSalesData?.data
    }
    return (
      <>
        <Grid container spacing={2} className="mt-8">
          <Grid item xs={8}>
            <Paper variant="outlined" className="rounded-[10px] p-6">
              <div className="flex justify-center mb-6">
                <Typography className="text-[32px] font-bold">Top Sales Performance by Car Type
                </Typography>
              </div>
              <div>
                {/* Bar Chart */}
                <BarChart
                  className="py-4"
                  dataset={transformDataset(vehicleSalesData?.data)}
                  xAxis={[{ scaleType: 'band', dataKey: 'month' }]}
                  series={transformDataseries(vehicleSalesData?.data)}
                  {...chartSetting}
                />
              </div>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper variant="outlined" className="rounded-[10px] pt-4 pb-10 pl-4 pr-4">
              <div className="flex justify-center mb-6">
                <Typography className="text-[32px] font-bold">Top 10 Best Selling Cars 2023</Typography>
              </div>
              <div style={{ marginLeft: 24, }}>
                <PieChart
                  series={[
                    {
                      data,
                      highlightScope: { faded: 'global', highlighted: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                  ]}
                  height={438}
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

    const vehicleOption = () => {
      const options = [

      ];
      if (vehicleTypeListData) {
        vehicleTypeListData?.data.map((ctx) => {
          options.push(ctx)
        })
      }

      return options;
    };

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
      PaperProps: {
        style: {
          maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
          width: 250,
        },
      },
    };



    return (
      <>
        <Grid container spacing={2} className="mt-8">
          <Grid item xs={12}>
            <Paper variant="outlined" className="rounded-[10px] p-4">
              <div className="flex justify-center mb-6">
                <Typography className="text-[32px] font-bold">Price Comparison</Typography>
              </div>
              <div>
                <Typography className="ml-6 mb-2 text-xl">Pilih Kendaraan</Typography>
                <MSelect
                  className='ml-6 w-[300px]'
                  name="jenis_kendaraan"
                  value={jenisMobil}
                  onChange={(event) => handleInputChange(event)}
                  // error={errorMessage ? errorMessage.jenis_kendaraan : null}
                  keyPair={['id', 'name']}
                  options={vehicleOption()}
                  required
                  menuProps={MenuProps}
                />
                <LineChart
                  height={400}
                  series={comparisonData}
                  xAxis={[{ scaleType: "point", data: comparisonMonth }]}
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
