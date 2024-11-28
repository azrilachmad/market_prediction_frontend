"use client"

import { Datatable } from "@/components/datatable"
import { MButton, MInput, MSelect, ModalTitle, MuiInput, YMDatePicker } from "@/components/form";
import { convDate, formatCurrency, showPopup, thousandSeparator } from "@/helpers";
import { submitSinglePredict, getVehicleList, submitBulkPredict, updateVehicles } from "@/service/marketPrediction";
import { closeBtn, closeButton, primaryButton, secondaryButton, successButton } from "@/styles/theme/theme.js";
import { Add, Clear, Delete, Edit, FileDownload, Search, Send } from "@mui/icons-material";
import { Box, Button, Checkbox, CircularProgress, Dialog, DialogActions, DialogContent, Grid, IconButton, Paper, Tab, Tabs, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { enqueueSnackbar } from "notistack";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import moment from "moment";
import { isNumber, toNumber, update } from "lodash";


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
  const [isLoadingSubmitBulk, setIsLoadingSubmitBulk] = useState(false)
  const [predictionData, setPredictionData] = useState()
  const [predictionDataBulk, setPredictionDataBulk] = useState([])


  const [bulkData, setBulkData] = useState([])
  const [detailVehicleData, setDetailVehicleData] = useState({
    id: null,
    tanggal_jual: null,
    lokasi: null,
    desciption: null,
    jenismobil: null,
    transmisi: null,
    umurmobil: null,
    color: null,
    nopol: null,
    pajak: null,
    stnk: null,
    grade_all: null,
    gradeinterior: null,
    gradebody: null,
    grademesin: null,
    km: null,
    bottom_price: null,
    status: null,
    harga_terbentuk: null,
    nama_mobil: null,
    harga_atas: null,
    harga_bawah: null,
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
  })
  const [query, setQuery] = useState('')

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

  const toggleModalDeleteOffering = (id) => {
    showPopup(
      'confirm',
      'Are you sure you want to delete this member?',
      'Yes',
      () => {
        deleteOfferingData(id),
          mutateVehicleData();
      }
    );
  }



  const toggleModalDetail = (type, params) => {
    // return console.log(params)
    if (type === 'open') {
      // console.log(params)
      setIsPredictedData(false)
      setDetailVehicleData({
        id: params[1],
        tanggal_jual: params[2],
        lokasi: params[3],
        desciption: params[4],
        jenismobil: params[5],
        transmisi: params[6],
        year: params[7],
        umurmobil: params[23],
        color: params[8],
        nopol: params[9],
        pajak: params[10],
        stnk: params[11],
        grade_all: params[12],
        gradeinterior: params[13],
        gradebody: params[14],
        grademesin: params[15],
        km: params[16],
        bottom_price: params[17],
        status: params[18],
        harga_terbentuk: params[19],
        nama_mobil: params[20],
        harga_atas: params[22],
        harga_bawah: params[21],
      })
      setModalDetail(true)
    } else if (type === 'close') {
      setDetailVehicleData({
        id: null,
        tanggal_jual: null,
        lokasi: null,
        desciption: null,
        jenismobil: null,
        transmisi: null,
        umurmobil: null,
        color: null,
        nopol: null,
        pajak: null,
        stnk: null,
        grade_all: null,
        gradeinterior: null,
        gradebody: null,
        grademesin: null,
        km: null,
        bottom_price: null,
        status: null,
        harga_terbentuk: null,
        nama_mobil: null,
        harga_atas: null,
        harga_bawah: null,
      })
      setModalDetail(false)
    }
  }

  const renderModalDetail = () => {



    return (
      <Dialog
        scroll="paper"
        fullWidth
        className="xl"
        open={modalDetail}
        onClose={() => toggleModalForm('close')}
      >
        <ModalTitle
          title={"Detail Kendaraan"}
          onClose={() => toggleModalDetail('close')}
        />
        <DialogContent style={{ paddingTop: '0 !important' }}>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Tanggal Jual</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.tanggal_jual ? convDate(detailVehicleData.tanggal_jual, 'DD-MM-YYYY') : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Lokasi</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.lokasi ? detailVehicleData.lokasi : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Description</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.desciption ? detailVehicleData.desciption : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Jenis Mobil</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.jenismobil ? detailVehicleData.jenismobil : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Transmisi</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.transmisi ? detailVehicleData.transmisi : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Year</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.year ? detailVehicleData.year : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Umur Mobil</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.umurmobil ? `${detailVehicleData.umurmobil} Tahun` : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Color</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.color ? detailVehicleData.color : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Nopol</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.nopol ? detailVehicleData.nopol : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Pajak</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.pajak ? convDate(detailVehicleData.pajak, 'DD-MM-YYYY') : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>STNK</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.stnk ? convDate(detailVehicleData.stnk, 'DD-MM-YYYY') : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Grade All</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.grade_all ? detailVehicleData.grade_all : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Grade Interior</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.gradeinterior ? detailVehicleData.gradeinterior : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Grade Body</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.gradebody ? detailVehicleData.gradebody : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Grade Mesin</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.grademesin ? detailVehicleData.grademesin : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Jarak Tempuh</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{detailVehicleData.km ? `${thousandSeparator(detailVehicleData.km)} KM` : '-'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Bottom Price</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{isNumber(detailVehicleData.bottom_price) ? `Rp. ${thousandSeparator(detailVehicleData.bottom_price)}` : 'Tidak Diketahui'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Harga Terbentuk</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item>
                <Typography className="text-sm">{isNumber(detailVehicleData.harga_terbentuk) ? `Rp. ${thousandSeparator(detailVehicleData.harga_terbentuk)}` : 'Tidak Diketahui'}</Typography>
              </Grid>
            </Grid>
          </div>
          <div className="flex">
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Harga Terendah</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.harga_bawah ? `Rp. ${thousandSeparator(detailVehicleData.harga_bawah)}` : '-'}</Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={4.5} className="mb-2">
                <Typography className="text-sm"><b>Harga Tertinggi</b></Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">:</Typography>
              </Grid>
              <Grid item >
                <Typography className="text-sm">{detailVehicleData.harga_atas ? `Rp. ${thousandSeparator(detailVehicleData.harga_atas)}` : '-'}</Typography>
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
                        nama_kendaraan: `${detailVehicleData.desciption}`,
                        tahun_kendaraan: `${detailVehicleData.year}`,
                        jarak_tempuh_kendaraan: `${detailVehicleData.km}`,
                        transmisi_kendaraan: detailVehicleData.transmisi === 'AT' ? 'Automatic' : detailVehicleData.transmisi === 'MT' ? 'Manual' : '',
                        bahan_bakar: 'Bensin',
                        wilayah_kendaraan: `${detailVehicleData.lokasi}`
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
                updateVehicleDatas(e, detailVehicleData)
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


  const handleChangeTabs = (newValue) => {
    setTabsValue(newValue);
    setBulkData([])
    setPredictionData(null)
    setPredictionDataBulk(null)
    setFormData({
      id: null,
      jenis_kendaraan: null,
      nama_kendaraan: null,
      tahun_kendaraan: null,
      jarak_tempuh_kendaraan: null,
      transmisi_kendaraan: null,
      bahan_bakar: null,
      wilayah_kendaraan: null,
    })
    setIsPredictedData(false)
  };
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

    const handleCheckboxChange = (e, params) => {
      if (e.target.checked === true) {
        const datas = {
          id: params[1],
          tanggal_jual: params[2],
          lokasi: params[3],
          desciption: params[4],
          jenismobil: params[5],
          transmisi: params[6],
          year: params[7],
          umurmobil: params[23],
          color: params[8],
          nopol: params[9],
          pajak: params[10],
          stnk: params[11],
          grade_all: params[12],
          gradeinterior: params[13],
          gradebody: params[14],
          grademesin: params[15],
          km: params[16],
          bottom_price: params[17],
          status: params[18],
          harga_terbentuk: params[19],
          nama_mobil: params[20],
          harga_atas: params[21],
          harga_bawah: params[22],
        }
        let newData = bulkData
        newData.push(datas)
        setBulkData(newData)
      } else {
        let newData = bulkData
        newData = newData.filter(item => item.id !== params[1])
        setBulkData(newData)
      }
    }



    const renderBulkActions = (params) => {
      return (
        <div>
          <div onClick={(e) => { handleCheckboxChange(e, params) }}>
            <Checkbox
              // checked={checked}
              inputProps={{ 'aria-label': 'controlled' }}
            />
          </div>
        </div>
      )
    }


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
            <div color="primary" className="flex ml-[24px] mb-[24px]">
              <div className={tabsValue === 0 ? 'bg-[#5538f4] rounded-[10px] p-2 text-white mr-4 cursor-pointer' : 'mr-4 cursor-pointer p-2'} onClick={() => handleChangeTabs(0)}>
                <Typography >Single Process</Typography>
              </div>
              <div className={tabsValue === 1 ? 'bg-[#5538f4] rounded-[10px] p-2 text-white mr-4 cursor-pointer' : 'mr-4 cursor-pointer p-2'} onClick={() => handleChangeTabs(1)}>
                <Typography>Bulk Process</Typography>
              </div>
            </div>
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
                    <Grid item xs={4} className="mb-[24px]">
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
                    <Grid item xs={4} className="mb-[24px]">
                      <div>
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
                      </div>
                    </Grid>
                    <Grid item xs={4} className="mb-[24px]">
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
                      <Typography className="mb-2 "> {predictionData.nama_kendaraan}</Typography>
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
                      <Typography className="mb-2 "> Rp. {predictionData.market_prediction.harga_tertinggi ? thousandSeparator(predictionData.market_prediction.harga_tertinggi) : null}</Typography>
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
                      <Typography className="mb-2 "> Rp. {predictionData.market_prediction.harga_terendah ? thousandSeparator(predictionData.market_prediction.harga_terendah) : null}</Typography>
                    </Grid>
                  </Grid>
                  <Grid container className="mt-2">
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Link Referensi:</Typography>
                    </Grid>
                  </Grid>
                  <div>
                    {predictionData.market_prediction.link_sumber_analisa ? predictionData.market_prediction.link_sumber_analisa.map((data, index) => {
                      return (<div key={index}>
                        <a href={data} target="_blank" >{data}</a>
                      </div>)
                    }) : <></>}
                  </div>

                  <Grid container className="mt-4">
                    <Grid item xs={3}>
                      <Typography className="mb-2 font-[500]">Tanggal Iklan Terbaru</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 font-[500] mr-2">:</Typography>
                    </Grid>
                    <Grid item>
                      <Typography className="mb-2 "> {predictionData.market_prediction.tanggal_posting ? convDate(predictionData.market_prediction.tanggal_posting, 'DD MMMM YYYY') : null}</Typography>
                    </Grid>
                  </Grid>

                  {isPredictedData ? (<ThemeProvider theme={secondaryButton}>
                    <MButton
                      className="flex justify-end mb-4 mt-4"
                      label={"Submit Data"}
                      // loading={isLoadingSubmitBulk}
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
                <Datatable
                  creatable={false}
                  title={"Table List"}
                  loading={isLoadingVehicleData}
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
                  customActions={(params) => renderBulkActions(params)}
                  // toggleResetAll={queryParams.resetDatatable}ha
                  // toggleResetPage={queryParams.resetPage}
                  manualNumbering={false}
                />
                {bulkData.length >= 0 ? (
                  <Grid container className="flex justify-end">
                    <Grid item xs={12} className="flex justify-end">
                      <ThemeProvider theme={primaryButton}>
                        <MButton
                          className="flex justify-end mb-4"
                          type="submit"
                          label={"Submit Bulk"}
                          // loading={isLoadingSubmitBulk}
                          icon={<Send />}
                          onClick={(e) => {
                            setIsLoadingSubmitBulk(true)
                            setPredictionDataBulk(null)
                            handleSubmitBulkPredict(e)
                          }}
                        />
                      </ThemeProvider>
                    </Grid>
                    {isLoadingSubmitBulk ? <CircularProgress loading={isLoadingSubmitBulk} /> : (<></>)}
                  </Grid>
                ) : (<></>)}

                {predictionDataBulk ? (<>
                  <Datatable
                    creatable={false}
                    title={"Prediction Result"}
                    loading={isLoadingVehicleData}
                    // data={vehicleData?.data ? vehicleData?.data : []}
                    // total={vehicleData?.meta ? vehicleData?.meta?.total_page : 0}
                    // page={vehicleData?.meta ? vehicleData?.meta?.current_page : 1}
                    data={predictionDataBulk}
                    total={predictionDataBulk ? predictionDataBulk.length : null}
                    page={1}
                    columns={columnsResults}

                    handleReload={(params) => handleReload(params)}
                    // handleDetail={(params) => this.toggleModal('detail', params)}
                    handleCreate={() => {
                      setFormData(initialValue)
                      toggleModalForm('open')
                    }}
                    customActions={(params) => renderActions(params)}
                    // toggleResetAll={queryParams.resetDatatable}ha
                    // toggleResetPage={queryParams.resetPage}
                    manualNumbering={false}
                  />
                  <Grid container className="flex justify-end">
                    <Grid item xs={12} className="flex justify-end">
                      <ThemeProvider theme={secondaryButton}>
                        <MButton
                          label={'UPDATE ALL'}
                          icon={<Send />}
                          onClick={(e) => {
                            updateVehicleBulk(e, predictionDataBulk)
                          }
                          }
                        />
                      </ThemeProvider>
                    </Grid>
                    {isLoadingSubmitBulk ? <CircularProgress loading={isLoadingSubmitBulk} /> : (<></>)}
                  </Grid>


                </>) : (<></>)}
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

  const columnsResults = [
    {
      name: "id",
      label: "id",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "tanggal_jual",
      label: "Tanggal Jual",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'DD/MM/YYYY') : "-"),
    },
    {
      name: "lokasi",
      label: "Lokasi",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "desciption",
      label: "Description",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "jenismobil",
      label: "Jenis Mobil",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "transmisi",
      label: "Transmisi",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "year",
      label: "Year",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "color",
      label: "Color",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nopol",
      label: "Nopol",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'DD/MM/YYYY') : "-"),
    },
    {
      name: "pajak",
      label: "Pajak",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "stnk",
      label: "STNK",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grade_all",
      label: "Grade All",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "gradeinterior",
      label: "Grade Interior",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "gradebody",
      label: "Grade Body",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grademesin",
      label: "Grade Mesin",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "km",
      label: "KM",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "bottom_price",
      label: "Bottom Price",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "status",
      label: "Status",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_terbentuk",
      label: "Harga Terbentuk",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nama_mobil",
      label: "Nama Mobil",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_bawah",
      label: "Harga Terbawah",
      display: true,
      customBodyRender: (value) => (isNumber(value) ? `Rp. ${thousandSeparator(value)}` : "Tidak Diketahui"),
    },
    {
      name: "harga_atas",
      label: "Harga Teratas",
      display: true,
      customBodyRender: (value) => (isNumber(value) ? `Rp. ${thousandSeparator(value)}` : "Tidak Diketahui"),
    },
    {
      name: "umurmobil",
      label: "Umur Mobil",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },

  ];
  const columns = [
    {
      name: "id",
      label: "id",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "tanggal_jual",
      label: "Tanggal Jual",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'DD/MM/YYYY') : "-"),
    },
    {
      name: "lokasi",
      label: "Lokasi",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "desciption",
      label: "Description",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "jenismobil",
      label: "Jenis Mobil",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "transmisi",
      label: "Transmisi",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "year",
      label: "Year",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "color",
      label: "Color",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nopol",
      label: "Nopol",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'DD/MM/YYYY') : "-"),
    },
    {
      name: "pajak",
      label: "Pajak",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "stnk",
      label: "STNK",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grade_all",
      label: "Grade All",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "gradeinterior",
      label: "Grade Interior",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "gradebody",
      label: "Grade Body",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grademesin",
      label: "Grade Mesin",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "km",
      label: "KM",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "bottom_price",
      label: "Bottom Price",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "status",
      label: "Status",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_terbentuk",
      label: "Harga Terbentuk",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nama_mobil",
      label: "Nama Mobil",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_bawah",
      label: "Harga Terbawah",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_atas",
      label: "Harga Teratas",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "umurmobil",
      label: "Umur Mobil",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
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



  const handleSubmitBulkPredict = async (e) => {
    e.preventDefault();

    if (bulkData.length < 1) {
      return enqueueSnackbar("Please select atleast 1 data", { variant: "warning" })
    }
    const response = await submitBulkPredict(bulkData)
    if (response.data?.error) {
      setIsLoadingSubmitBulk(false)
    } else {
      if (response.status === 200) {
        setPredictionDataBulk(response.data)
        setIsLoadingSubmitBulk(false)
        enqueueSnackbar("Success", { variant: "success" })
        // console.log(response);
        // mutateVehicleData()
      } else {
        setIsLoadingSubmitBulk(false)
        enqueueSnackbar("Something went wrong", { variant: "error" })
        // mutateVehicleData()
      }
    }
    setIsLoadingSubmitBulk(false)
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
          market_prediction
        } = params


        let harga_bawah = market_prediction.harga_terendah
        if (isNumber(harga_bawah) === false) {
          harga_bawah = Number(harga_bawah?.replace("Rp ", "").replace(/\./g, "").replace(",", ""));
        }
        let harga_atas = market_prediction.harga_tertinggi
        if (isNumber(harga_atas) === false) {
          harga_atas = Number(harga_atas?.replace("Rp ", "").replace(/\./g, "").replace(",", ""));
        }

        // error required condition

        const datas = {
          vehicles: [
            {
              ...id && { id: id },
              ...nama_kendaraan && { desciption: nama_kendaraan },
              ...harga_atas && { harga_atas: harga_atas },
              ...harga_bawah && { harga_bawah: harga_bawah },
            }
          ]
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

  const updateVehicleDatas = async (e, params) => {
    e.preventDefault()
    showPopup(
      'confirm',
      'Are you sure you want to update this data?',
      'Yes',
      async (e) => {
        const {
          id,
          desciption,
          harga_bawah,
          harga_atas,
        } = params
        toggleModalDetail('close')
        let harga_terendah = harga_bawah
        if (isNumber(harga_terendah) === false) {
          harga_terendah = Number(harga_terendah?.replace("Rp ", "").replace(/\./g, "").replace(",", ""));
        }

        let harga_tertinggi = harga_atas
        if (isNumber(harga_tertinggi) === false) {
          harga_tertinggi = Number(harga_tertinggi?.replace("Rp ", "").replace(/\./g, "").replace(",", ""));
        }

        // error required condition

        const datas = {
          vehicles: [
            {
              ...id && { id: id },
              ...desciption && { desciption: desciption },
              ...harga_tertinggi && { harga_atas: harga_tertinggi },
              ...harga_terendah && { harga_bawah: harga_terendah },
            }
          ]
        }
        const response = await updateVehicles(datas)
        if (response.data?.error) {
          return setErrorMessage(response.data?.error)
        } else {
          if (response.status === 200) {
            enqueueSnackbar("Success Update Data", { variant: "success" })
            setIsPredictedData(false)
            mutateVehicleData()
            let newData = predictionDataBulk
            newData = newData.filter(item => item.id !== id)
            setPredictionDataBulk(newData)
            let newDatas = bulkData
            newDatas = newDatas.filter(item => item.id !== params[1])
            setBulkData(newDatas)
          } else {
            enqueueSnackbar("Something went wrong", { variant: "error" })
            mutateVehicleData()
          }
        }
      }
    );
  }
  const updateVehicleBulk = async (e, params) => {
    e.preventDefault()
    showPopup(
      'confirm',
      'Are you sure you want to update all the result?',
      'Yes',
      async (e) => {
        // return console.log(params)
        let newData = {
          vehicles: []
        }
        params.map((item) => {
          let harga_terendah = item.harga_bawah
          if (isNumber(harga_terendah) === false) {
            harga_terendah = Number(harga_terendah?.replace("Rp ", "").replace(/\./g, "").replace(",", ""));
          }

          let harga_tertinggi = item.harga_atas
          if (isNumber(harga_tertinggi) === false) {
            harga_tertinggi = Number(harga_tertinggi?.replace("Rp ", "").replace(/\./g, "").replace(",", ""));
          }
          newData.vehicles.push({
            ...item.id && { id: item.id },
            ...item.desciption && { desciption: item.desciption },
            ...harga_tertinggi && { harga_atas: harga_tertinggi },
            ...harga_terendah && { harga_bawah: harga_terendah },
          })
        })

        const response = await updateVehicles(newData)
        if (response.data?.error) {
          return setErrorMessage(response.data?.error)
        } else {
          if (response.status === 200) {
            enqueueSnackbar("Success Update Data", { variant: "success" })
            setIsPredictedData(false)
            mutateVehicleData()
            setPredictionDataBulk([])
            setBulkData([])
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
        {tabsValue === 0 ? <Datatable
          creatable={false}
          title={"Table List"}
          loading={isLoadingVehicleData}
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
          // toggleResetAll={queryParams.resetDatatable}ha
          // toggleResetPage={queryParams.resetPage}
          manualNumbering={false}
        /> : <></>}

      </div>
    </>
  )
}
