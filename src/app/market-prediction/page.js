"use client"

import { Datatable } from "@/components/datatable"
import { MButton, MInput, MSelect, ModalTitle, MuiInput, YMDatePicker } from "@/components/form";
import { convDate, formatCurrency, showPopup, thousandSeparator } from "@/helpers";
import { submitSinglePredict, getVehicleList, updateVehicles } from "@/service/marketPrediction";
import { closeBtn, closeButton, primaryButton, secondaryButton, successButton } from "@/styles/theme/theme.js";
import { Add, Clear, Delete, Edit, FileDownload, Restore, Search, Send } from "@mui/icons-material";
import { Box, Button, Checkbox, CircularProgress, Grid, IconButton, Paper, Tab, Tabs, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { enqueueSnackbar } from "notistack";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import moment from "moment";
import { isNumber, sortBy, toNumber, update } from "lodash";


export default function MarketPrediction() {


  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  const thousandSeparator = (number) => {
    return addCommas(removeNonNumeric(number))
  }

  const [tabsValue, setTabsValue] = useState(0);

  const [modalDetail, setModalDetail] = useState(false)
  const [isUpdate, setIsUpdate] = useState(false)
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false)
  const [predictionData, setPredictionData] = useState()


  const [detailVehicleData, setDetailVehicleData] = useState({
    id: null,
    agreement_no: null,
    asset_desc: null,
    ai_nama_mobil: null,
    tahun: null,
    nopol: null,
    umur: null,
    noka: null,
    nosin: null,
    warna: null,
    lokasi_unit: null,
    kota: null,
    provinsi: null,
    receive_date: null,
    inspection_date: null,
    approval_date: null,
    qc_date: null,
    grade_interior: null,
    grade_body: null,
    grade_mesin: null,
    overall_grade: null,
    masa_berlaku_pajak: null,
    masa_berlaku_stnk: null,
    final_status: null,
    vehicle_brand: null,
    vehicle_transmission: null,
    vehicle_cc: null,
    vehicle_type: null,
    vehicle_model: null,
    ai_harga_history: null,
    ai_harga_atas: null,
    ai_harga_bawah: null,
    hit_count: null,
  })

  const [isPredictedData, setIsPredictedData] = useState(false)
  const [formData, setFormData] = useState({
    id: null,
    jenis_kendaraan: null,
    nama_kendaraan: null,
    tahun_kendaraan: null,
    jarak_tempuh_kendaraan: null,
    transmisi_kendaraan: null,
    bahan_bakar: null,
    wilayah_kendaraan: null,
  })

  const [errorMessage, setErrorMessage] = useState({
    id: null,
    jenis_kendaraan: null,
    nama_kendaraan: null,
    tahun_kendaraan: null,
    jarak_tempuh_kendaraan: null,
    transmisi_kendaraan: null,
    bahan_bakar: null,
    wilayah_kendaraan: null,
  })

  const initialValue = formData

  const [vehicleQuery, setVehicleQuery] = useState({
    page: 1,
    limit: 10,
    order: 'desc',
    sortBy: null,
    loading: false,
  })
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('')

  const {
    data: vehicleData,
    isLoading: isLoadingVehicleData,
    refetch: mutateVehicleData,
  } = useQuery({
    queryKey: [
      "vehicle-data",
      {
        ...vehicleQuery.page && { page: vehicleQuery.page },
        ...vehicleQuery.limit && { limit: vehicleQuery.limit },
        ...vehicleQuery.order && { order: vehicleQuery.order },
        ...vehicleQuery.sortBy && { sortBy: vehicleQuery.sortBy },
        ...query && { query: query },
      },
    ],
    queryFn: ({ queryKey }) => getVehicleList(queryKey[1]),
  });


  const toggleModalDetail = (type, params) => {
    // return console.log(params)
    if (type === 'open') {
      // console.log(params)
      setIsPredictedData(false)
      setDetailVehicleData({
        id: params[1],
        agreement_no: params[2] * 1,
        asset_desc: params[3],
        ai_nama_mobil: params[4],
        vehicle_transmission: params[5],
        tahun: params[6],
        nopol: params[7],
        umur: params[8],
        noka: params[9],
        nosin: params[10],
        warna: params[11],
        lokasi_unit: params[12],
        kota: params[13],
        provinsi: params[14],
        receive_date: params[15],
        inspection_date: params[16],
        approval_date: params[17],
        qc_date: params[18],
        grade_interior: params[19],
        grade_body: params[20],
        grade_mesin: params[21],
        overall_grade: params[22],
        masa_berlaku_pajak: params[23],
        masa_berlaku_stnk: params[24],
        final_status: params[25],
        vehicle_brand: params[26],
        vehicle_cc: params[27],
        vehicle_type: params[28],
        vehicle_model: params[29],
        ai_harga_history: params[30],
        ai_harga_atas: params[31],
        ai_harga_bawah: params[32],
        hit_count: params[33],
      })
      setModalDetail(true)
    } else if (type === 'close') {
      setDetailVehicleData({
        id: null,
        agreement_no: null,
        asset_desc: null,
        ai_nama_mobil: null,
        tahun: null,
        nopol: null,
        umur: null,
        noka: null,
        nosin: null,
        warna: null,
        lokasi_unit: null,
        kota: null,
        provinsi: null,
        receive_date: null,
        inspection_date: null,
        approval_date: null,
        qc_date: null,
        grade_interior: null,
        grade_body: null,
        grade_mesin: null,
        overall_grade: null,
        masa_berlaku_pajak: null,
        masa_berlaku_stnk: null,
        final_status: null,
        vehicle_brand: null,
        vehicle_transmission: null,
        vehicle_cc: null,
        vehicle_type: null,
        vehicle_model: null,
        ai_harga_history: null,
        ai_harga_atas: null,
        ai_harga_bawah: null,
        hit_count: null,
      })
      setModalDetail(false)
    }
  }

  const renderModalSearch = () => {
    return (
      <>

        <Paper variant="outlined" className="p-4 w-[600px] mb-6">
          <Typography className="font-semibold text-[20px] text-[#656464] mb-2">Filter</Typography>
          <div className="flex items-center">
            <MInput
              className='w-[350px]'
              variant="outlined"
              name="filter"
              label={'Search'}
              placeholder="Input Search"
              value={filter}
              onChange={(event) => handleFilterChange(event)}
            // errorMessage={errorMessage && errorMessage?.quotation_number ? errorMessage?.quotation_number[0] : false}
            />
            <ThemeProvider theme={primaryButton}>
              <MButton
                className='h-[40px] ml-4'
                label={'Apply'}
                onClick={(e) => {
                  setVehicleQuery({
                    ...vehicleQuery,
                    loading: true,
                  })
                  setQuery(filter)

                  setTimeout(() => {
                    setVehicleQuery({
                      ...vehicleQuery,
                      loading: false,
                    })
                  }, 1500)
                }}
              />
            </ThemeProvider>
            <ThemeProvider theme={secondaryButton}>
              <MButton
                className='h-[40px] ml-4'
                label={'Reset'}
                onClick={(e) => {
                  setQuery('')
                  setFilter('')
                  setVehicleQuery({
                    page: 1,
                    limit: 10,
                    order: 'desc',
                    sortBy: null,
                  })
                  mutateVehicleData()
                }}
              />
            </ThemeProvider>
          </div>
        </Paper>
      </>
    )
  }

  const renderModalDetail = () => {
    return (
      <Dialog
        fullWidth={true}
        PaperProps={{
          sx: {
            width: "100%",
            maxWidth: "1100px!important",
          },
        }}
        open={modalDetail}
        onClose={() => toggleModalForm('close')}
      >
        <ModalTitle
          title={"Detail Kendaraan"}
          onClose={() => toggleModalDetail('close')}
        />
        <DialogContent>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Agreement No.</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.agreement_no ? detailVehicleData.agreement_no : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Nama Kendaraan</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.ai_nama_mobil ? detailVehicleData.ai_nama_mobil : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Tahun</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.tahun ? detailVehicleData.tahun : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Nopol</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.nopol ? detailVehicleData.nopol : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Umur Kendaraan</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.umur ? `${detailVehicleData.umur} Tahun` : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Nomor Rangka</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.noka ? detailVehicleData.noka : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Nomor Mesin</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.nosin ? detailVehicleData.nosin : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Warna</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.warna ? detailVehicleData.warna : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Lokasi Unit</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.lokasi_unit ? detailVehicleData.lokasi_unit : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Kota</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.kota ? detailVehicleData.kota : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Provinsi</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.provinsi ? detailVehicleData.provinsi : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Receive Date</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.receive_date ? convDate(detailVehicleData.receive_date, 'YYYY/MM/DD') : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Inspection Date</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.inspection_date ? convDate(detailVehicleData.inspection_date, 'YYYY/MM/DD') : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Approval Date</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.approval_date ? convDate(detailVehicleData.approval_date, 'YYYY/MM/DD') : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>QC Date</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.qc_date ? convDate(detailVehicleData.qc_date, 'YYYY/MM/DD') : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Grade Interior</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.grade_interior ? detailVehicleData.grade_interior : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Grade Body</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.grade_body ? detailVehicleData.grade_body : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Grade Mesin</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.grade_mesin ? detailVehicleData.grade_mesin : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Overall Grade</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.overall_grade ? detailVehicleData.overall_grade : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Masa Berlaku Pajak</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.masa_berlaku_pajak ? detailVehicleData.masa_berlaku_pajak : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Masa Berlaku STNK</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.masa_berlaku_stnk ? convDate(detailVehicleData.masa_berlaku_stnk, 'YYYY/MM/DD') : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Final Status</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.final_status ? detailVehicleData.final_status : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Vehicle Brand</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.vehicle_brand ? detailVehicleData.vehicle_brand : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Vehicle Transmission</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.vehicle_transmission ? detailVehicleData.vehicle_transmission : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Vehicle CC</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.vehicle_cc ? detailVehicleData.vehicle_cc : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Vehicle Type</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.vehicle_type ? detailVehicleData.vehicle_type : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Vehicle Model</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.vehicle_model ? detailVehicleData.vehicle_model : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Harga History</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.ai_harga_history ? `Rp. ${thousandSeparator(detailVehicleData.ai_harga_history)}` : "-"}</Typography>
              </Grid>
            </Grid>

          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Harga Atas</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.ai_harga_atas ? `Rp. ${thousandSeparator(detailVehicleData.ai_harga_atas)}` : "-"}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={3.5} className="mb-2">
                <Typography className="text-sm"><b>Harga Bawah</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.ai_harga_bawah ? `Rp. ${thousandSeparator(detailVehicleData.ai_harga_bawah)}` : "-"}</Typography>
              </Grid>
            </Grid>
          </div>


        </DialogContent>
        <DialogActions style={{
          padding: '0px 20px 20px 20px',
        }}>
          {tabsValue === 0 ? (
            <ThemeProvider theme={primaryButton}>
              <MButton
                label={'PREDICT'}
                icon={<Send />}
                onClick={(e) => {
                  showPopup(
                    'confirm',
                    'Are you sure want to market predict this data?',
                    'Yes',
                    () => {
                      setFormData({

                        id: detailVehicleData.id,
                        jenis_kendaraan: 'Mobil',
                        nama_kendaraan: `${detailVehicleData.ai_nama_mobil}`,
                        tahun_kendaraan: `${detailVehicleData.tahun}`,
                        // jarak_tempuh_kendaraan: `${detailVehicleData.jarak}`,
                        transmisi_kendaraan: detailVehicleData.vehicle_transmission === 'AT' ? 'Automatic' : detailVehicleData.vehicle_transmission === 'MT' ? 'Manual' : '',
                        bahan_bakar: 'Bensin',
                        wilayah_kendaraan: `${detailVehicleData.kota}, ${detailVehicleData.provinsi}`
                      })
                      toggleModalDetail('close')
                      setIsPredictedData(true)
                      setPredictionData(null)
                    }
                  )
                }}
              />
            </ThemeProvider>
          ) : (<ThemeProvider theme={secondaryButton}>
            <MButton
              label={'UPDATE DATA'}
              icon={<Send />}
              onClick={(e) => {
                // updateVehicleDatas(e, detailVehicleData)
              }
              }
            />
          </ThemeProvider>)}
          <ThemeProvider theme={closeBtn}>
            <MButton
              label="CLOSE"
              onClick={() => {
                toggleModalDetail('close')
              }}
            />
          </ThemeProvider>

        </DialogActions>
      </Dialog>
    )
  }


  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }


  const renderPredictionAccordion = () => {

    const {
      id,
      jenis_kendaraan,
      nama_kendaraan,
      tahun_kendaraan,
      jarak_tempuh_kendaraan,
      transmisi_kendaraan,
      bahan_bakar,
      wilayah_kendaraan,
    } = formData

    const vehicleOption = () => {
      const options = [
        { id: 'Mobil', name: 'Mobil' },
        { id: 'Motor', name: 'Motor' },
      ];
      return options;
    };

    const transmissionOption = () => {
      const options = [
        { id: 'Automatic', name: 'Automatic' },
        { id: 'Manual', name: 'Manual' },
      ];
      return options;
    };

    const fuelOption = () => {
      const options = [
        { id: 'Bensin', name: 'Bensin' },
        { id: 'Listrik', name: 'Listrik' },
      ];
      return options;
    };


    return <div>

      <Accordion defaultExpanded variant="outlined" className="mb-[32px] rounded-[18px]">
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography className="ml-[24px]"><b>Market Predict</b></Typography>
        </AccordionSummary>
        <AccordionDetails >
          <div>
            {tabsValue === 0 ? (<form onSubmit={(e) => handleSubmit(e)}>
              <DialogContent style={{ paddingTop: '0 !important' }}>
                <div>
                  <Grid container columnSpacing={4}>
                    <Grid item xs={6} className="mb-[24px]">
                      <div>
                        <Typography className="mb-2">Jenis Kendaaran</Typography>
                        <MSelect
                          fullWidth
                          name="jenis_kendaraan"
                          value={jenis_kendaraan}
                          onChange={(event) => handleInputChange(event)}
                          error={errorMessage ? errorMessage.jenis_kendaraan : null}
                          keyPair={['id', 'name']}
                          options={vehicleOption()}
                          required
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography className="mb-2">Nama Kendaraan</Typography>
                        <MInput
                          fullwidth
                          variant="outlined"
                          name="nama_kendaraan"
                          placeholder="Input Nama Kendaraan"
                          value={nama_kendaraan}
                          onChange={(event) => handleInputChange(event)}
                          errorMessage={errorMessage && errorMessage?.quotation_number ? errorMessage?.quotation_number[0] : false}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6} className="mb-[24px]">
                      <div>
                        <Typography className="mb-2">Tahun Kendaraan</Typography>
                        <MInput
                          fullwidth
                          variant="outlined"
                          name="tahun_kendaraan"
                          placeholder="Input Tahun Kendaraan"
                          value={tahun_kendaraan}
                          onChange={(event) => handleInputChange(event)}
                          errorMessage={errorMessage && errorMessage?.quotation_number ? errorMessage?.quotation_number[0] : false}
                        />
                      </div>
                    </Grid>
                    {/* <Grid item xs={4} className="mb-[24px]"> */}
                    {/* <div>
                        <Typography className="mb-2">Jarak Tempuh Kendaraan</Typography>
                        <MInput
                          fullwidth
                          variant="outlined"
                          name="jarak_tempuh_kendaraan"
                          placeholder="Input Jarak Tempuh Kendaraan"
                          value={jarak_tempuh_kendaraan}
                          onChange={(event) => handleInputChange(event)}

                          errorMessage={errorMessage && errorMessage?.quotation_number ? errorMessage?.quotation_number[0] : false}
                        />
                      </div> */}
                    {/* </Grid> */}
                    <Grid item xs={6} className="mb-[24px]">
                      <div>
                        <Typography className="mb-2">Transmisi Kendaraan</Typography>
                        <MSelect
                          fullWidth
                          name="transmisi_kendaraan"
                          value={transmisi_kendaraan}
                          onChange={(event) => handleInputChange(event)}
                          error={false}
                          keyPair={['id', 'name']}
                          options={transmissionOption()}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography className="mb-2">Bahan Bakar</Typography>
                        <MSelect
                          fullWidth
                          name="bahan_bakar"
                          value={bahan_bakar}
                          onChange={(event) => handleInputChange(event)}
                          error={false}
                          keyPair={['id', 'name']}
                          options={fuelOption()}
                        />
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <div>
                        <Typography className="mb-2">Wilayah Kendaraan</Typography>
                        <MInput
                          fullwidth
                          style={{ marginBottom: 24 }}
                          variant="outlined"
                          name="wilayah_kendaraan"
                          placeholder="Input Wilayah Kendaraan"
                          value={wilayah_kendaraan}
                          onChange={(event) => handleInputChange(event)}
                          errorMessage={errorMessage && errorMessage?.quotation_number ? errorMessage?.quotation_number[0] : false}
                        />
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </DialogContent>
              <DialogActions style={{
                padding: '0px 20px 20px 20px',
              }}>
                <ThemeProvider theme={primaryButton}>
                  <MButton
                    type="submit"
                    style={{ marginRight: 4 }}
                    label={"Predict"}
                    loading={isLoadingSubmit}
                    icon={<Send />}
                    onClick={(e) => {
                      setIsLoadingSubmit(true)
                      handleSubmitSinglePredict(e)
                    }}
                  />
                </ThemeProvider>
              </DialogActions>
              {predictionData ? (
                <div className="px-6">
                  <Typography className="mb-4"><b>Hasil Prediksi:</b></Typography>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Nama Kendaraan</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 font-[500] mr-2">:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 "> {predictionData?.nama_kendaraan}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Harga Tertinggi</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 font-[500] mr-2">:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 "> Rp. {!isNaN(predictionData?.harga_tertinggi * 1) ? thousandSeparator(predictionData?.harga_tertinggi) : predictionData?.harga_terendah}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Harga Terendah</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 font-[500] mr-2">:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 "> Rp. {!isNaN(predictionData?.harga_terendah * 1) ? thousandSeparator(predictionData?.harga_terendah) : predictionData?.harga_terendah}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Total Token:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 font-[500] mr-2">:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 ">{predictionData?.total_token} Token</Typography>
                    </Grid>
                  </Grid>
                  <Grid container className="mt-2">
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Data Source:</Typography>
                    </Grid>
                  </Grid>
                  <div>
                    {predictionData?.link_referensi ? predictionData?.link_referensi.map((data, index) => {
                      return (<div key={index}>
                        <a href={`https://${data}`} target="_blank" >{data}</a>
                      </div>)
                    }) : <></>}
                  </div>

                  {/* <Grid container className="mt-4">
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Tanggal Iklan Terbaru</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 font-[500] mr-2">:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 "> {predictionData?.market_prediction?.tanggal_posting ? convDate(predictionData?.market_prediction?.tanggal_posting, 'DD MMMM YYYY') : null}</Typography>
                    </Grid>
                  </Grid> */}

                  {isPredictedData ? (<ThemeProvider theme={secondaryButton}>
                    <MButton
                      className="flex justify-end mb-4 mt-4"
                      label={"Submit Data"}
                      icon={<Send />}
                      onClick={(e) => {
                        updateVehicleData(e, predictionData)
                      }}
                    />
                  </ThemeProvider>) : (<></>)}


                </div>
              ) : (<></>)}
            </form >) : (
              <div className="px-6">
              </div>
            )}

          </div>
        </AccordionDetails >
      </Accordion >
    </div >
  }



  const renderActions = (params) => {
    return (
      <div>
        <>
          <div style={{ display: "inline", marginRight: "5px" }}>
            <Tooltip title="Detail">
              <Button
                variant="contained"
                // color="primary"
                size="small"
                className="bg-[#5538f4] shadow-none text-white min-w-[10px] pr-0"
                onClick={() => toggleModalDetail('open', params)}
                startIcon={<Search />}
              ></Button>
            </Tooltip>
          </div>
          {/* <div style={{ display: "inline", marginRight: "5px" }}>
            <Tooltip title="Generate PDF">
              <Button
                variant="contained"
                color="success"
                size="small"
                className="shadow-none text-white min-w-[10px] pr-0"
                onClick={() => toggleDownloadOffering(params[1])}
                startIcon={<FileDownload />}
              ></Button>
            </Tooltip>
          </div> */}
        </>
      </div>
    );
  };

  const columns = [
    {
      name: "id",
      label: "id",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "agreement_no",
      label: "Tanggal Jual",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "asset_desc",
      label: "Asset Desc",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "ai_nama_mobil",
      label: "Vehicle Name",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "vehicle_transmission",
      label: "Vehicle Transmission",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "tahun",
      label: "Tahun",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nopol",
      label: "Nopol",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "umur",
      label: "Umur Kendaraan",
      display: false,
      customBodyRender: (value) => (value ? `${value} Tahun` : "-"),
    },
    {
      name: "noka",
      label: "Nomor Rangka",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nosin",
      label: "Nomor Mesin",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "warna",
      label: "Warna",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "lokasi_unit",
      label: "Lokasi Unit",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "kota",
      label: "Kota",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "provinsi",
      label: "Provinsi",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "receive_date",
      label: "Receive Date",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'YYYY/MM/DD') : "-"),
    },
    {
      name: "inspection_date",
      label: "Inspection Date",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'YYYY/MM/DD') : "-"),
    },
    {
      name: "approval_date",
      label: "Approval Date",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'YYYY/MM/DD') : "-"),
    },
    {
      name: "qc_date",
      label: "QC Date",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'YYYY/MM/DD') : "-"),
    },
    {
      name: "grade_interior",
      label: "Grade Interior",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grade_body",
      label: "grade_body",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grade_mesin",
      label: "Grade Mesin",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "overall_grade",
      label: "Overall Grade",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "masa_berlaku_pajak",
      label: "Masa Berlaku Pajak",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'YYYY/MM/DD') : "-"),
    },
    {
      name: "masa_berlaku_stnk",
      label: "Masa Berlaku STNK",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'YYYY/MM/DD') : "-"),
    },
    {
      name: "final_status",
      label: "Final Status",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "vehicle_brand",
      label: "Vehicle Brand",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "vehicle_cc",
      label: "Vehicle CC",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "vehicle_type",
      label: "Vehicle Type",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "vehicle_model",
      label: "Vehicle Model",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "ai_harga_history",
      label: "Harga History",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value !== null ? `Rp. ${thousandSeparator(value)}` : "-"),
    },
    {
      name: "ai_harga_atas",
      label: "Harga Atas",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value !== null ? `Rp. ${thousandSeparator(value)}` : "-"),
    },
    {
      name: "ai_harga_bawah",
      label: "Harga Bawah",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value !== null ? `Rp. ${thousandSeparator(value)}` : "-"),
    },
    {
      name: "hit_count",
      label: "Checked",
      display: true,
      sortThirdClickReset: true,
      customBodyRender: (value) => (value > 0 ? <Typography className="text-green-700 font-semibold">Yes</Typography> : <Typography className="text-red-700 font-semibold">No</Typography>),
    },
  ];

  const handleReload = (params) => {
    setVehicleQuery({
      ...vehicleQuery,
      page: params.page,
      limit: params.limit,
      sortBy: params.sortBy,
      order: params.order,
      // resetDatatable: true,
      // resetPage: true,
    })
  }


  const toggleModalForm = (type, params) => {
    if (type === 'open') {
      if (params) {
        setIsUpdate(true)
        setFormData({
          id: params[1],
          document_name: params[2],
          quotation_number: params[3],
          customer_name: params[7],
          customer_address: params[8],
          customer_phone: params[9],
          customer_company: params[4],
          project_name: params[11],
          products: params[12],
          ppn: params[13],
          note: params[14],
          document_date: params[6],
        })
        // console.log(params)
      } else {
        setIsUpdate(false)
        setFormData(initialValue)
      }
      setModalCreate(true)
    } else if (type === 'close') {
    } else {
    }
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target
    if (typeof value != "string") {
      return;
    }
    setFormData({ ...formData, [name]: value })
    // setErrorMessage({ ...errorMessage, [name]: null })
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilter(value)
  }



  const updateVehicleData = async (e, params) => {
    e.preventDefault()
    showPopup(
      'confirm',
      'Are you sure you want to update this data?',
      'Yes',
      async (e) => {
        const {
          id,
          nama_kendaraan,
          harga_terendah,
          harga_tertinggi,
          total_token
        } = params

        // error required condition

        const datas = {
          ...id && { id: id },
          ...nama_kendaraan && { desciption: nama_kendaraan },
          ...harga_tertinggi && { harga_atas: harga_tertinggi * 1 },
          ...harga_terendah && { harga_bawah: harga_terendah * 1 },
          ...total_token && { total_token: total_token },
          checked: true,
        }

        const response = await updateVehicles(datas)
        if (response.data?.error) {
          return setErrorMessage(response.data?.error)
        } else {
          if (response.status === 200) {
            enqueueSnackbar("Success Update Data", { variant: "success" })
            setIsPredictedData(false)
            mutateVehicleData()
          } else {
            enqueueSnackbar("Something went wrong", { variant: "error" })
            mutateVehicleData()
          }
        }
      }
    );
  }


  const handleSubmitSinglePredict = async (e) => {
    e.preventDefault();
    const {
      id,
      jenis_kendaraan,
      nama_kendaraan,
      tahun_kendaraan,
      jarak_tempuh_kendaraan,
      transmisi_kendaraan,
      bahan_bakar,
      wilayah_kendaraan
    } = formData

    // error required condition

    const params = {
      ...id && { id: id },
      ...jenis_kendaraan && { jenis_kendaraan: jenis_kendaraan },
      ...nama_kendaraan && { nama_kendaraan: nama_kendaraan },
      ...tahun_kendaraan && { tahun_kendaraan: tahun_kendaraan },
      ...jarak_tempuh_kendaraan && { jarak_tempuh_kendaraan: jarak_tempuh_kendaraan },
      ...transmisi_kendaraan && { transmisi_kendaraan: transmisi_kendaraan },
      ...bahan_bakar && { bahan_bakar: bahan_bakar },
      ...wilayah_kendaraan && { wilayah_kendaraan: wilayah_kendaraan },
    }
    setIsLoadingSubmit(false)
    const response = await submitSinglePredict(params)
    if (response.data?.error) {
      setIsLoadingSubmit(false)
      return setErrorMessage(response.data?.error)
    } else {
      if (response.status_code === 200) {
        setPredictionData({
          ...response.data,
          id: id ? id : null
        })
        setIsLoadingSubmit(false)
        enqueueSnackbar("Success", { variant: "success" })
        // console.log(response);
        // mutateVehicleData()
      } else {
        setIsLoadingSubmit(false)
        enqueueSnackbar("Something went wrong", { variant: "error" })
        // mutateVehicleData()
      }
    }
    setIsLoadingSubmit(false)
  }



  return (
    <>
      <div>
        {renderModalDetail()}
        {renderPredictionAccordion()}
        {renderModalSearch()}
        {tabsValue === 0 ? <Datatable
          creatable={false}
          title={"Table List"}
          loading={vehicleQuery.loading === true ? vehicleQuery.loading : isLoadingVehicleData}
          data={vehicleData?.data ? vehicleData?.data : []}
          total={vehicleData?.meta ? vehicleData?.meta?.total : 0}
          page={vehicleData?.meta ? vehicleData?.meta?.page : 1}
          // data={dummyData}
          // total={dummyData ? dummyData.length : null}
          // page={1}
          columns={columns}

          handleReload={(params) => handleReload(params)}
          // handleDetail={(params) => this.toggleModal('detail', params)}
          handleCreate={() => {
            setFormData(initialValue)
            toggleModalForm('open')
          }}
          customActions={(params) => renderActions(params)}
          toggleResetAll={true}
          toggleResetPage={true}
          manualNumbering={false}
        /> : <></>}

      </div>
    </>
  )
}
