import { Datatable } from "@/components/datatable"
import { MButton, MInput, ModalTitle, MSelect } from "@/components/form";
import { convDate, showPopup } from "@/helpers";
import { DataContext } from "@/helpers/dataContext";
import { createDataParameter, deleteDataParameter, editDataParameter, getDataParameterList, getVehicleColumn } from "@/service/dataParameter";
import { createUser, deleteUser } from "@/service/user";
import { closeBtn } from "@/styles/theme/theme";
import { primaryButton } from "@/themes/theme";
import { Delete, Edit, Search } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, FormControlLabel, Grid, Switch, ThemeProvider, Tooltip, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";


export const DataParameter = () => {
    const userProfile = useContext(DataContext);

    const [formData, setFormData] = useState({
        id: null,
        parameter: null,
        table_column: null,
        status: false,
        edit: false
    })

    const initialValue = {
        id: null,
        parameter: null,
        table_column: null,
        status: false,
        edit: false
    }

    const [dataParameterQuery, setDataParameterQuery] = useState({
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
        parameter: null,
        table_column: null,
        status: false,
    })


    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
        setErrorMessage({ ...errorMessage, [name]: null })
    }

    const {
        data: vehicleColumn,
        isLoading: isLoadingVehicleColumn,
        refetch: mutateVehicleColumn,
    } = useQuery({
        queryKey: [
            "vehicle-column",
            {
            },
        ],
        queryFn: ({ queryKey }) => getVehicleColumn(queryKey[1]),
    });

    const {
        data: dataParameterData,
        isLoading: isLoadingDataParameter,
        refetch: mutateDataParameter,
    } = useQuery({
        queryKey: [
            "data-parameter",
            {
                ...dataParameterQuery.page && { page: dataParameterQuery.page },
                ...dataParameterQuery.limit && { limit: dataParameterQuery.limit },
                ...dataParameterQuery.order && { order: dataParameterQuery.order },
                ...dataParameterQuery.sortBy && { sortBy: dataParameterQuery.sortBy },
            },
        ],
        queryFn: ({ queryKey }) => getDataParameterList(queryKey[1]),
    });

    const columns = [
        { name: "id", label: "ID", display: false },
        { name: "parameter", label: "Parameter", display: true },
        { name: "table_column", label: "Table Column", display: true },
        {
            name: "status",
            label: "Status",
            display: true,
            customBodyRender: (value) => (value === true ? <Typography className="text-[#00a152] text-[14px] font-semibold">Enabled</Typography> : value === false ? <Typography className="text-[#F44336] text-[14px] font-semibold">Disabled</Typography> : "-"),
        },
    ];

    const toggleModal = (type, command, params) => {
        if (command === 'open') {
            if (type === 'detail') {
                setFormData({
                    ...formData,
                    id: params[1],
                    parameter: params[2],
                    table_column: params[3],
                    status: params[4],
                    edit: false,
                })
                setModalDetail(true)
            } else if (type === 'edit') {
                setFormData({
                    ...formData,
                    id: params[1],
                    parameter: params[2],
                    table_column: params[3],
                    status: params[4],
                    edit: true,
                })
                setModalForm(true)
            } else if (type === 'create') {
                setModalForm(true)
            }
        } else if (command === 'close') {
            setFormData(initialValue)
            setModalDetail(false)
            setModalForm(false)
        }
    }


    const renderActions = (params) => (
        <div style={{ display: "inline", marginRight: "5px" }}>
            <Tooltip title="Detail">
                <Button
                    variant="contained"
                    size="small"
                    className="bg-[#5538f4] shadow-none text-white min-w-[10px] pr-0 "
                    onClick={() => toggleModal('detail', 'open', params)}
                    startIcon={<Search />}
                />
            </Tooltip>
            <Tooltip title="Edit">
                <Button
                    variant="contained"
                    size="small"
                    className="bg-[#E5AF5A] shadow-none text-white min-w-[10px] pr-0 ml-1"
                    onClick={() => toggleModal('edit', 'open', params)}
                    startIcon={<Edit />}
                />
            </Tooltip>
            {
                <Tooltip title="Delete">
                    <Button
                        variant="contained"
                        size="small"
                        className="bg-[#F44336] shadow-none text-white min-w-[10px] pr-0 ml-1"
                        onClick={() => toggleModalDelete(params[1])}
                        startIcon={<Delete />}
                    />
                </Tooltip>
            }
        </div>


    );


    const renderModalDetail = () => {

        return (
            <Dialog
                scroll="paper"
                fullWidth
                maxWidth={'sm'}
                open={modalDetail}
                onClose={() => toggleModal('detail', 'close')}
            >
                <ModalTitle
                    title={"Parameter Detail"}
                    onClose={() => toggleModal('detail', 'close')}
                />
                <DialogContent style={{ paddingTop: '0 !important' }}>
                    <div>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Parameter</Typography>
                            </Grid>
                            <Grid item >
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.parameter ? formData.parameter : '-'}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Table Column</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.table_column ? formData.table_column : '-'}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Status</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.status === true ? 'Enabled' : formData.status === false ? "Disabled" : '-'}</Typography>
                            </Grid>
                        </Grid>

                    </div>
                </DialogContent>
                <DialogActions style={{
                    padding: '0px 20px 20px 20px',
                }}>
                    <ThemeProvider theme={closeBtn}>
                        <MButton
                            label="CLOSE"
                            onClick={() => {
                                toggleModal('detail', 'close')
                            }}
                        />
                    </ThemeProvider>

                </DialogActions>
            </Dialog>
        )
    }

    const roleOptions = () => {
        const options = [
            { id: '1', name: 'Admin' },
            { id: '2', name: 'User' },
        ];
        return options;
    };


    const handleSubmitForm = async (e, data) => {
        e.preventDefault();
        const params = {
            id: data.id,
            parameter: data.parameter,
            table_column: data.table_column,
            status: data.status,
        }

        const response = formData.edit === true ? await editDataParameter(params) : await createDataParameter(params)
        if (response.status === 'Failed' && response.errors) {
            setErrorMessage(response.errors)
        } else if (response.status === 'Success') {
            enqueueSnackbar("User has been created!", { variant: 'success' })
            setFormData(initialValue)
            toggleModal(formData.edit === false ? 'edit' : 'create', 'close')
            mutateDataParameter()
        }
    }


    const toggleModalDelete = (id) => {
        showPopup(
            'confirm',
            'Are you sure you want to delete this data parameter?',
            'Yes',
            async () => {
                const response = await deleteDataParameter(id)
                if (response.status === 'Failed' && response.errors) {
                    enqueueSnackbar(response.message, { variant: 'error' })
                } else if (response.status === 'Success') {
                    enqueueSnackbar(response.message, { variant: 'success' })
                    mutateDataParameter()
                }
            }
        );
    }

    const handleSwitchChange = (e) => {
        const { name } = e.target
        setFormData({ ...formData, [name]: e.target.checked })
    }

    const renderModalForm = () => {
        return (

            <Dialog
                scroll="paper"
                fullWidth
                maxWidth={'sm'}
                open={modalForm}
                onClose={() => toggleModal('create', 'close')}
            >
                <ModalTitle
                    title={formData.edit ? "Edit Data Parameter" : 'Create Data Parameter'}
                    onClose={() => toggleModal('create', 'close')}
                />
                <form onSubmit={(e) => handleSubmitForm(e, formData)}>
                    <DialogContent style={{ paddingTop: '0 !important' }}>
                        <div className="">
                            <MInput
                                fullwidth
                                style={{ marginBottom: 18 }}
                                variant="outlined"
                                name="parameter"
                                label="Parameter"
                                placeholder="Input Parameter"
                                value={formData.parameter}
                                onChange={(event) => handleInputChange(event)}
                                errorMessage={errorMessage && errorMessage?.parameter ? errorMessage?.parameter : false}
                            />
                            <MSelect
                                fullWidth
                                label="Table Column"
                                name="table_column"
                                value={formData.table_column}
                                onChange={(event) => handleInputChange(event)}
                                error={errorMessage && errorMessage?.table_column ? errorMessage?.table_column : null}
                                keyPair={['id', 'name']}
                                options={vehicleColumn?.data}
                                required
                            />
                            <Typography className="mt-2">Status:</Typography>
                            <FormControlLabel control={<Switch name="status" checked={formData.status} onChange={(e) => { handleSwitchChange(e) }} />} label={formData.status === false ? "Disabled" : formData.status === true ? 'Enabled' : ''} />

                        </div>
                    </DialogContent>
                    <DialogActions style={{
                        padding: '0px 20px 20px 20px',
                    }}>
                        <ThemeProvider theme={primaryButton}>
                            <MButton
                                label="CREATE USER"
                                type="submit"
                            />
                        </ThemeProvider>
                        <ThemeProvider theme={closeBtn}>
                            <MButton
                                label="CLOSE"
                                onClick={() => {
                                    toggleModal('create', 'close')
                                }}
                            />
                        </ThemeProvider>

                    </DialogActions>
                </form>
            </Dialog>
        )
    }

    const handleReload = (params) => {
        setDataParameterQuery({
            ...dataParameterQuery,
            page: params.page,
            limit: params.limit,
            sortBy: params.sortBy,
            order: params.order,
            // resetDatatable: true,
            // resetPage: true,
        })
    }

    return (
        <>
            {renderModalDetail()}
            {renderModalForm()}
            <Datatable
                title="Data Parameter"
                loading={isLoadingDataParameter}
                data={dataParameterData?.data ? dataParameterData?.data : []}
                total={dataParameterData?.meta ? dataParameterData?.meta?.total : 0}
                page={dataParameterData?.meta ? dataParameterData?.meta?.page : 1}
                columns={columns}
                handleReload={(params) => handleReload(params)}
                customActions={renderActions}
                handleCreate={() => {
                    setFormData(initialValue)
                    toggleModal('create', 'open')
                }}
            />
        </>
    );
};
