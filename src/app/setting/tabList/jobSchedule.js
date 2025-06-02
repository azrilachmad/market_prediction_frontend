import { Datatable } from "@/components/datatable"
import { MButton, MInput, ModalTitle, MSelect, YMDatePicker } from "@/components/form";
import { convDate, convDateAsia, showPopup } from "@/helpers";
import { DataContext } from "@/helpers/dataContext";
import { getJobSchedule, editJobSchedule } from "@/service/jobSchedule";
import { createUser, deleteUser } from "@/service/user";
import { closeBtn } from "@/styles/theme/theme";
import { primaryButton } from "@/themes/theme";
import { Delete, Edit, Search, Send } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, Slider, Switch, ThemeProvider, Tooltip, Typography } from "@mui/material"
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';


export const JobSchedule = () => {
    const userProfile = useContext(DataContext);


    const [formData, setFormData] = useState({
        id: null,
        job_schedule: null,
        time: null,
        max_record: false,
        ai_iqr: 1.5,
        ai_temp: 1,
        interval: 60,
        edit: false
    })

    const initialValue = {
        id: null,
        job_schedule: null,
        time: null,
        max_record: false,
        ai_iqr: 1.5,
        ai_temp: 1,
        interval: 60,
        edit: false
    }

    const [jobScheduleQuery, setJobScheduleQuery] = useState({
        page: 1,
        limit: 10,
        order: 'desc',
        sortBy: false,
    })
    const [query, setQuery] = useState('')

    const [modalDetail, setModalDetail] = useState(false);
    const [modalForm, setModalForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        id: null,
        job_schedule: null,
        time: null,
        max_record: false,
        edit: false
    })


    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
        setErrorMessage({ ...errorMessage, [name]: null })
    }

    const {
        data: jobScheduleData,
        isLoading: isLoadingJobSchedule,
        refetch: mutateJobSchedule,
    } = useQuery({
        queryKey: [
            "job-schedule",
            {
                ...jobScheduleQuery.page && { page: jobScheduleQuery.page },
                ...jobScheduleQuery.limit && { limit: jobScheduleQuery.limit },
                ...jobScheduleQuery.order && { order: jobScheduleQuery.order },
                ...jobScheduleQuery.sortBy && { sortBy: jobScheduleQuery.sortBy },
            },
        ],
        queryFn: ({ queryKey }) => getJobSchedule(queryKey[1]),
    });

    useEffect(() => {
        if (jobScheduleData?.data && formData.id === null) {
            setFormData({
                ...formData,
                id: jobScheduleData.data.id,
                job_schedule: jobScheduleData.data.job_schedule,
                time: jobScheduleData.data.time,
                max_record: jobScheduleData.data.max_record,
                ai_iqr: jobScheduleData.data.ai_iqr,
                ai_temp: jobScheduleData.data.ai_temp,
                interval: jobScheduleData.data.interval,
            })
        }
    }, [formData, jobScheduleData?.data]);

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        const params = {
            id: formData.id,
            job_schedule: formData.job_schedule,
            time: convDateAsia(formData.time),
            max_record: formData.max_record,
            ai_iqr: formData.ai_iqr,
            ai_temp: formData.ai_temp,
            interval: formData.interval,
        }

        const response = await editJobSchedule(params)
        if (response.status === 'Failed' && response.errors) {
            setErrorMessage(response.errors)
        } else if (response.status === 'Success') {
            enqueueSnackbar("Job Scedule has been updated!", { variant: 'success' })
            mutateJobSchedule()
        }
    }


    const handleReload = (params) => {
        jobScheduleQuery({
            ...jobScheduleQuery,
            page: params.page,
            limit: params.limit,
            sortBy: params.sortBy,
            order: params.order,
            // resetDatatable: true,
            // resetPage: true,
        })
    }

    const jobScheduleOption = () => {
        const options = [
            { id: 'daily', name: 'Daily' },
            { id: 'interval', name: 'Interval' },
        ];
        return options;
    };

    dayjs.extend(utc);
    dayjs.extend(timezone);

    // console.log(userProfile?.userProfile?.userType)
    console.log(formData.ai_iqr)
    return (
        <>
            <div>
                {jobScheduleData?.data ? (
                    <>
                        <form onSubmit={(e) => handleSubmitForm(e)}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <div>
                                        <Typography className="text-md mb-1">Job Schedule:</Typography>
                                        <MSelect
                                            className={'w-[300px]'}
                                            name="job_schedule"
                                            value={formData.job_schedule}
                                            onChange={(event) => handleInputChange(event)}
                                            error={errorMessage ? errorMessage.job_schedule : null}
                                            keyPair={['id', 'name']}
                                            options={jobScheduleOption()}
                                            errorMessage={errorMessage && errorMessage?.job_schedule ? errorMessage?.job_schedule : false}
                                        />
                                    </div>
                                </Grid>
                                {formData.job_schedule === 'daily' ? (<>
                                    <Grid item xs={12}>
                                        <Typography className="text-md mb-1">Time:</Typography>
                                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                                            <TimePicker
                                                className='w-[250px]'
                                                views={['hours', 'minutes']}
                                                name="time"
                                                ampm={false}
                                                value={formData.time ? dayjs(formData.time).tz("Asia/Jakarta") : null} // Ensure it's Jakarta time
                                                onError={(newError) => setErrorMessage({ ...errorMessage, time: newError === 'invalidDate' ? 'Invalid Time' : newError })}
                                                slotProps={{
                                                    textField: {
                                                        helperText: errorMessage && errorMessage?.time ? errorMessage?.time : '',
                                                    },
                                                }}
                                                timezone="Asia/Jakarta"
                                                onChange={(newValue) => {
                                                    setFormData({ ...formData, time: dayjs(newValue).tz("Asia/Jakarta") });
                                                }}
                                                disabled={userProfile?.userProfile?.userType === '2' ? true : false}
                                                readOnly={userProfile?.userProfile?.userType === '2' ? true : false}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </>) : (<>
                                    <Grid item xs={12}>
                                        <Typography className="text-md mb-1 ">Interval (second):</Typography>
                                        <MInput
                                            className='w-[250px]'
                                            type='number'
                                            variant="outlined"
                                            name="interval"
                                            value={formData.interval}
                                            onChange={(event) => handleInputChange(event)}
                                            errorMessage={errorMessage && errorMessage?.interval ? errorMessage?.interval : false}
                                            onInput={(e) => {
                                                const numericValue = parseFloat(e.target.value);
                                                // Check if the numeric value is below the min value (0)
                                                if (!isNaN(numericValue) && numericValue < 1) {
                                                    e.target.value = "1";
                                                }
                                            }}
                                            disabled={userProfile?.userProfile?.userType === '2' ? true : false}
                                            readOnly={userProfile?.userProfile?.userType === '2' ? true : false}
                                        />
                                    </Grid>
                                </>)}
                                <Grid item xs={12}>
                                    <Typography className="text-md mb-1 ">Max Record:</Typography>
                                    <MInput
                                        className='w-[250px]'
                                        type='number'
                                        variant="outlined"
                                        name="max_record"
                                        value={formData.max_record}
                                        onChange={(event) => handleInputChange(event)}
                                        errorMessage={errorMessage && errorMessage?.max_record ? errorMessage?.max_record : false}
                                        onInput={(e) => {
                                            const numericValue = parseFloat(e.target.value);
                                            // Check if the numeric value is below the min value (0)
                                            if (!isNaN(numericValue) && numericValue < 1) {
                                                e.target.value = "1";
                                            }
                                        }}
                                        disabled={userProfile?.userProfile?.userType === '2' ? true : false}
                                        readOnly={userProfile?.userProfile?.userType === '2' ? true : false}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography className="mt-4 text-[18px] font-[600]">AI Engine Setting:</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className="text-md mb-1 ">AI Temperature: {formData.ai_temp}</Typography>
                                    <Box sx={{ width: 300 }}>
                                        <Slider
                                            aria-label="Temperature"
                                            defaultValue={formData.ai_temp}
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={0.5}
                                            max={2}
                                            name="ai_temp"
                                            onChange={(event) => handleInputChange(event)}>

                                        </Slider>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className="text-md mb-1 ">IQR Number (Multiplier): x{formData.ai_iqr}</Typography>
                                    <Box sx={{ width: 300 }}>
                                        <Slider
                                            aria-label="IQR Number (Numtiplier)"
                                            defaultValue={formData.ai_iqr}
                                            valueLabelDisplay="auto"
                                            step={0.1}
                                            marks
                                            min={1}
                                            max={3}
                                            name="ai_iqr"
                                            onChange={(event) => handleInputChange(event)}>

                                        </Slider>
                                    </Box>
                                </Grid>
                                {userProfile?.userProfile?.userType === '1' ? (
                                    <Grid item xs={12} flex alignItems='flex-end'>
                                        <ThemeProvider theme={primaryButton}>
                                            <MButton
                                                type="submit"
                                                label={"Update"}
                                                // loading={isLoadingSubmit}
                                                icon={<Send />}
                                            />
                                        </ThemeProvider>
                                    </Grid>
                                ) : (<></>)}
                            </Grid>
                        </form>
                    </>
                ) : <CircularProgress />
                }
            </div>
        </>
    );
};
