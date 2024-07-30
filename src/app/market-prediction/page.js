"use client"

import { Datatable } from "@/components/datatable"
import { MButton, MInput, MSelect, ModalTitle, MuiInput, YMDatePicker } from "@/components/form";
import { convDate, formatCurrency, showPopup, thousandSeparator } from "@/helpers";
import { submitSinglePredict, deleteOfferingData, generateOffering, getVehicleList, updateOfferingData, submitBulkPredict } from "@/service/marketPrediction";
import { closeButton, primaryButton, secondaryButton, successButton } from "@/styles/theme/theme.js";
import { Add, Clear, Delete, Edit, FileDownload, Search, Send } from "@mui/icons-material";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, Grid, IconButton, Paper, Tab, Tabs, ThemeProvider, Tooltip, Typography, createTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { enqueueSnackbar } from "notistack";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';


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
  const [predictionDataBulk, setPredictionDataBulk] = useState()


  const [bulkData, setBulkData] = useState([])

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

  const initialErrorMessage = errorMessage
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
    if (type === 'open') {
      setDetailData({
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
      setModalDetail(true)
    } else if (type === 'close') {
      setDetailData({
        id: null,
        document_name: null,
        quotation_number: null,
        customer_name: null,
        customer_address: null,
        customer_phone: null,
        customer_company: null,
        project_name: null,
        products: [{
          product_name: null,
          quantity: null,
          price: null,
        }],
        ppn: null,
        note: null,
        document_date: null,
      })
      setModalDetail(false)
    }
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
          wilayah_kendaraan: params[3],
          nama_kendaraan: params[4],
          tahun_kendaraan: params[5],
          warna_kendaraan: params[6],
          nomor_kendaraan: params[7],
          pajak_kendaraan: params[8],
          stnk: params[9],
          grade_all: params[10],
          grade_interior: params[11],
          grade_body: params[12],
          grade_mesin: params[13],
          jarak_tempuh_kendaraan: params[14],
          harga_terendah: params[15],
          status: params[16],
          harga_terbentuk: params[17],
          transmisi_kendaraan: params[18],
          bahan_bakar: params[19],
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

    const renderBulkButton = (params) => {
      return (
        <div>
          <>
            <div style={{ display: "inline", marginRight: "5px" }}>
              <Tooltip title="Detail">
                <Button
                  variant="contained"
                  // color="primary"
                  size="small"
                  className="bg-[#2DC2BD] shadow-none text-white min-w-[10px] pr-0"
                  onClick={() => console.log(params)}
                  startIcon={<Search />}
                ></Button>
              </Tooltip>
            </div>
          </>
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
              <div className={tabsValue === 0 ? 'bg-[#2DC2BD] rounded-[10px] p-2 text-white mr-4 cursor-pointer' : 'mr-4 cursor-pointer p-2'} onClick={() => handleChangeTabs(0)}>
                <Typography >Single Process</Typography>
              </div>
              <div className={tabsValue === 1 ? 'bg-[#2DC2BD] rounded-[10px] p-2 text-white mr-4 cursor-pointer' : 'mr-4 cursor-pointer p-2'} onClick={() => handleChangeTabs(1)}>
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
                          label="Jenis Kendaraan"
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
                          label="Nama Kendaraan"
                          placeholder="Enter quotation number"
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
                          label="Tahun Kendaraan"
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
                          label="Jarak Tempuh Kendaran"
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
                          label="Transmisi Kendaraan"
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
                          label="Bahan Bakar"
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
                          label="Wilayah Kendaraan"
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
                    label={"Submit"}
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

                </div>
              ) : (<></>)}
            </form >) : (
              <div className="px-6">
                <Datatable
                  creatable={false}
                  title={"Table List"}
                  loading={isLoadingVehicleData}
                  // data={vehicleData?.data ? vehicleData?.data : []}
                  // total={vehicleData?.meta ? vehicleData?.meta?.total_page : 0}
                  // page={vehicleData?.meta ? vehicleData?.meta?.current_page : 1}
                  data={dummyData}
                  total={dummyData ? dummyData.length : null}
                  page={1}
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
                          label={"Submit"}
                          loading={isLoadingSubmitBulk}
                          icon={<Send />}
                          onClick={(e) => {
                            setIsLoadingSubmitBulk(true)
                            handleSubmitBulkPredict(e)
                          }}
                        />
                      </ThemeProvider>
                    </Grid>
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
                    customActions={(params) => renderBulkButton(params)}
                    // toggleResetAll={queryParams.resetDatatable}ha
                    // toggleResetPage={queryParams.resetPage}
                    manualNumbering={false}
                  />
                </>) : (<></>)}
              </div>
            )}

          </div>
        </AccordionDetails>
      </Accordion>
    </div>
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
                className="bg-[#2DC2BD] shadow-none text-white min-w-[10px] pr-0"
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
      name: "wilayah_kendaraan",
      label: "Lokasi",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nama_kendaraan",
      label: "Description",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "tahun_kendaraan",
      label: "Year",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "warna_kendaraan",
      label: "Color",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nomor_kendaraan",
      label: "Nopol",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'DD/MM/YYYY') : "-"),
    },
    {
      name: "pajak_kendaraan",
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
      name: "grade_interior",
      label: "Grade Interior",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grade_body",
      label: "Grade Body",
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
      name: "jarak_tempuh_kendaraan",
      label: "KM",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_terendah",
      label: "Bottom Price",
      display: true,
      customBodyRender: (value) => (value ? thousandSeparator(value) : "-"),
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
      name: "transmisi_kendaraan",
      label: "Transmisi Kendaraan",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "bahan_bakar",
      label: "Bahan Bakar",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_tertinggi",
      label: "Bottom Price",
      display: true,
      customBodyRender: (value) => (value ? thousandSeparator(value) : "-"),
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
      name: "tahun_kendaraan",
      label: "Year",
      display: true,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "warna_kendaraan",
      label: "Color",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "nomor_kendaraan",
      label: "Nopol",
      display: false,
      customBodyRender: (value) => (value ? convDate(value, 'DD/MM/YYYY') : "-"),
    },
    {
      name: "pajak_kendaraan",
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
      name: "grade_interior",
      label: "Grade Interior",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "grade_body",
      label: "Grade Body",
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
      name: "jarak_tempuh_kendaraan",
      label: "KM",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "harga_terendah",
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
      name: "transmisi_kendaraan",
      label: "Transmisi Kendaraan",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },
    {
      name: "bahan_bakar",
      label: "Bahan Bakar",
      display: false,
      customBodyRender: (value) => (value ? value : "-"),
    },

  ];
  const dummyData = [
    {
      id: 1,
      tanggal_jual: "1/4/2023",
      wilayah_kendaraan: "PEKANBARU",
      nama_kendaraan: "DAIHATSU-GREAT NEW XENIA-M DELUXE 1.3 MT",
      tahun_kendaraan: '2015',
      warna_kendaraan: 'PUTIH',
      nomor_kendaraan: 'BXXXXTFR',
      pajak_kendaraan: null,
      stnk: null,
      grade_all: 'D',
      grade_interior: 'D',
      grade_body: 'D',
      grade_mesin: 'D',
      jarak_tempuh_kendaraan: '150595',
      harga_terendah: '62000000',
      status: 'SOLD',
      harga_terbentuk: '64000000',
      transmisi_kendaraan: "Manual",
      bahan_bakar: "Bensin"
    },
    {
      id: 2,
      tanggal_jual: "1/4/2023",
      wilayah_kendaraan: "PEKANBARU",
      nama_kendaraan: "SUZUKI CARRY 1.5 PU BOX",
      tahun_kendaraan: '2016',
      warna_kendaraan: 'Hitam',
      nomor_kendaraan: 'BAXXXXBA',
      pajak_kendaraan: null,
      stnk: null,
      grade_all: 'C',
      grade_interior: 'C',
      grade_body: 'C',
      grade_mesin: 'C',
      jarak_tempuh_kendaraan: '241626',
      harga_terendah: '55000000',
      status: 'SOLD',
      harga_terbentuk: '58000000',
      transmisi_kendaraan: "Manual",
      bahan_bakar: "Bensin"
    },
    {
      id: 3,
      tanggal_jual: "1/4/2023",
      wilayah_kendaraan: "BEKASI",
      nama_kendaraan: "HONDA-MOBILIO-E 1.5 AT CVT",
      tahun_kendaraan: '2014',
      warna_kendaraan: 'ABU ABU METALIK',
      nomor_kendaraan: 'BXXXXKYS',
      pajak_kendaraan: null,
      stnk: null,
      grade_all: 'C',
      grade_interior: 'C',
      grade_body: 'D',
      grade_mesin: 'C',
      jarak_tempuh_kendaraan: '94991',
      harga_terendah: '75000000',
      status: 'SOLD',
      harga_terbentuk: '95000000',
      transmisi_kendaraan: "Manual",
      bahan_bakar: "Bensin"
    },
    {
      id: 3,
      tanggal_jual: "2/4/2023",
      wilayah_kendaraan: "JAKARTA",
      nama_kendaraan: "TOYOTA-NEW INNOVA-BENSIN G 2.0 MT",
      tahun_kendaraan: '2021',
      warna_kendaraan: 'HITAM',
      nomor_kendaraan: 'BXXXXSSS',
      pajak_kendaraan: null,
      stnk: null,
      grade_all: 'B',
      grade_interior: 'B',
      grade_body: 'B',
      grade_mesin: 'B',
      jarak_tempuh_kendaraan: '25000',
      harga_terendah: '75000000',
      status: 'SOLD',
      harga_terbentuk: '95000000',
      transmisi_kendaraan: "Manual",
      bahan_bakar: "Bensin"
    }
  ]

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

  const handleResetForm = () => {
    setFormData({
      document_name: null,
      quotation_number: null,
      customer_name: null,
      customer_address: null,
      customer_phone: null,
      customer_company: null,
      project_name: null,
      products: [{
        product_name: null,
        quantity: null,
        price: null,
      }],
      ppn: null,
      note: null,
      document_date: null,
    })

    setErrorMessage({
      document_name: null,
      quotation_number: null,
      customer_name: null,
      customer_address: null,
      customer_phone: null,
      customer_company: null,
      project_name: null,
      products: null,
      ppn: null,
      note: null,
      document_date: null,
    })
    setIsUpdate(false)

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
      handleResetForm()
      setModalCreate(false)
    } else {
      setModalCreate(false)
      handleResetForm()
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
      if (response.status_code === 200) {
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

    const response = await submitSinglePredict(params)
    setIsLoadingSubmit(true)
    if (response.data?.error) {
      setIsLoadingSubmit(false)
      return setErrorMessage(response.data?.error)
    } else {
      if (response.status_code === 200) {
        setPredictionData(response.data)
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
