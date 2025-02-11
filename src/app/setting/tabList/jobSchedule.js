import { Datatable } from "@/components/datatable"
import { MButton, MInput, ModalTitle, MSelect, YMDatePicker } from "@/components/form";
import { convDate, showPopup } from "@/helpers";
import { DataContext } from "@/helpers/dataContext";
import { getJobSchedule, editJobSchedule } from "@/service/jobSchedule";
import { createUser, deleteUser } from "@/service/user";
import { closeBtn } from "@/styles/theme/theme";
import { primaryButton } from "@/themes/theme";
import { Delete, Edit, Search, Send } from "@mui/icons-material";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, Switch, ThemeProvider, Tooltip, Typography } from "@mui/material"
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
        edit: false
    })

    const initialValue = {
        id: null,
        job_schedule: null,
        time: null,
        max_record: false,
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
            })
        }
    }, [formData, jobScheduleData?.data]);

    const handleSubmitForm = async (e) => {
        e.preventDefault();

        const params = {
            id: formData.id,
            job_schedule: formData.job_schedule,
            time: formData.time,
            max_record: formData.max_record,
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
            { id: 'Daily', name: 'Daily' },
            { id: 'Weekly', name: 'Weekly' },
        ];
        return options;
    };

    dayjs.extend(utc);
    dayjs.extend(timezone);

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
                                            disabled
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className="text-md mb-1">Time:</Typography>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <TimePicker
                                            className='w-[250px]'
                                            views={['hours', 'minutes']}
                                            name="time"
                                            value={dayjs(`${formData.time}`)}
                                            onError={(newError) => setErrorMessage({ ...errorMessage, time: newError === 'invalidDate' ? 'Invalid Time' : newError })}
                                            slotProps={{
                                                textField: {
                                                    helperText: errorMessage && errorMessage?.time ? errorMessage?.time : '',
                                                },
                                            }}
                                            timezone="Asia/Jakarta"
                                            onChange={(newValue) => {
                                                setFormData({ ...formData, time: newValue })
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
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
                                    />
                                </Grid>
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
                            </Grid>
                        </form>
                    </>
                ) : <CircularProgress/>
                }
            </div>
        </>
    );
};
