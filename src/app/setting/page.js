"use client"

import { Box, Grid, Icon, Paper, Tab, Tabs, Typography } from "@mui/material"
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
/* eslint-disable react/react-in-jsx-scope */
import { getVehicleAssetData } from "@/service/marketPrediction";
import { useQuery } from "react-query";
import { useContext, useState } from "react";

import { jobScheduleTab } from './tabList/jobSchedule'
import { UserManagement } from "./tabList/userManagement";
import { DataContext } from "@/helpers/dataContext";
export default function Setting() {

  const userProfile = useContext(DataContext);

  const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "");
  const thousandSeparator = (number) => {
    return addCommas(removeNonNumeric(number))
  }



  const [value, setValue] = useState(0);

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
        {value === index && <Box sx={{ paddingTop: 3, paddingBottom: 3, paddingLeft: 1, paddingRight: 1 }}>{
          <>
            {children}
          </>
        }</Box>}
      </div>
    );
  }


  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const mainTabs = () => {
    const handleChangeTabs = (event, newValue) => {
      setValue(newValue);
    };

    return (
      <Box sx={{ width: '100%', border: 1, borderColor: "gray", borderRadius: 2, padding: 1 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChangeTabs} aria-label="basic tabs example">
            <Tab label="Job Schedule" {...a11yProps(0)} />
            <Tab label="Data Parameter" {...a11yProps(1)} />
            <Tab label="Data Source" {...a11yProps(2)} />
            {userProfile?.userProfile?.userType === '1' ? (
              <Tab label="User Management" {...a11yProps(3)} />
            ) : <></>}
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          {<jobScheduleTab />}
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          Data Parameter
        </CustomTabPanel>
        <CustomTabPanel value={value} index={2}>
          Data Source
        </CustomTabPanel>
        <CustomTabPanel value={value} index={3}>
          {<UserManagement />}
        </CustomTabPanel>
      </Box>
    );
  }

  return (
    <>
      <div>
        {mainTabs()}
      </div>
    </>
  )
}
