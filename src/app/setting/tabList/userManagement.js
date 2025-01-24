import { Datatable } from "@/components/datatable"
import { MButton, MInput, ModalTitle, MSelect } from "@/components/form";
import { convDate, showPopup } from "@/helpers";
import { DataContext } from "@/helpers/dataContext";
import { createUser, deleteUser, editUser, getUserList } from "@/service/user";
import { closeBtn } from "@/styles/theme/theme";
import { primaryButton } from "@/themes/theme";
import { Delete, Edit, Search } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, Grid, ThemeProvider, Tooltip, Typography } from "@mui/material"
import { enqueueSnackbar } from "notistack";
import React, { useContext, useState } from "react";
import { useQuery } from "react-query";


export const UserManagement = () => {
    const userProfile = useContext(DataContext);
    console.log(userProfile)

    const [formData, setFormData] = useState({
        id: null,
        name: null,
        email: null,
        userType: null,
        last_activity: null,
        password: null,
        confirmPassword: null,
    })

    const initialValue = {
        id: null,
        name: null,
        email: null,
        userType: null,
        last_activity: null,
        password: null,
        confirmPassword: null,
    }

    const [userQuery, setUserQuery] = useState({
        page: 1,
        limit: 10,
        order: 'desc',
        sortBy: null,
    })
    const [query, setQuery] = useState('')

    const [modalDetail, setModalDetail] = useState(false);
    const [modalForm, setModalForm] = useState(false);
    const [errorMessage, setErrorMessage] = useState({
        id: null,
        name: null,
        email: null,
        userType: null,
        last_activity: null,
        password: null,
        confirmPassword: null,
    })
    const [selectedUser, setSelectedUser] = useState(null);


    const handleInputChange = (event) => {
        const { name, value } = event.target
        setFormData({ ...formData, [name]: value })
        setErrorMessage({ ...errorMessage, [name]: null })
    }

    const {
        data: userData,
        isLoading: isLoadingUserData,
        refetch: mutateUserData,
    } = useQuery({
        queryKey: [
            "user-data",
            {
                ...userQuery.page && { page: userQuery.page },
                ...userQuery.limit && { limit: userQuery.limit },
                ...userQuery.order && { order: userQuery.order },
                ...userQuery.sortBy && { sortBy: userQuery.sortBy },
            },
        ],
        queryFn: ({ queryKey }) => getUserList(queryKey[1]),
    });

    const columns = [
        { name: "id", label: "ID", display: false },
        { name: "name", label: "Name", display: true },
        { name: "email", label: "Email", display: true },
        { name: "userType", label: "Role", display: true, customBodyRender: (value) => value === '1' ? 'Superadmin' : 'User' },
        { name: "last_activity", label: "Last Activity", display: true, customBodyRender: (value) => convDate(value, 'DD/MM/YY hh:mm:ss') },
    ];

    const toggleModal = (type, command, params) => {
        if (command === 'open') {
            console.log(params)
            if (type === 'detail') {
                setFormData({
                    ...formData,
                    id: params[1],
                    name: params[2],
                    email: params[3],
                    userType: params[4],
                    last_activity: params[5],
                    edit: false,
                })
                setModalDetail(true)
            } else if (type === 'edit') {
                setFormData({
                    ...formData,
                    id: params[1],
                    name: params[2],
                    email: params[3],
                    userType: params[4],
                    last_activity: params[5],
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
            setErrorMessage()
            
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
                params[1] !== 1 ? (<>
                    <Tooltip title="Delete">
                        <Button
                            variant="contained"
                            size="small"
                            className="bg-[#F44336] shadow-none text-white min-w-[10px] pr-0 ml-1"
                            onClick={() => toggleModalDelete(params[1])}
                            startIcon={<Delete />}
                        />
                    </Tooltip>
                </>) : <></>
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
                    title={"User Detail"}
                    onClose={() => toggleModal('detail', 'close')}
                />
                <DialogContent style={{ paddingTop: '0 !important' }}>
                    <div>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Name</Typography>
                            </Grid>
                            <Grid item >
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.name ? formData.name : '-'}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Email</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.email ? formData.email : '-'}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Role</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.userType === '1' ? 'Admin' : formData.userType === '2' ? "User" : '-'}</Typography>
                            </Grid>
                        </Grid>

                        <Grid container spacing={2}>
                            <Grid item xs={4}>
                                <Typography className="text-sm">Last Activity</Typography>
                            </Grid>
                            <Grid item>
                                <Typography className="text-sm">:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography className="text-sm">{formData.last_activity ? convDate(formData.last_activity, 'DD MMMM YYYY HH:MM:ss') : '-'}</Typography>
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
            userType: data.userType,
            name: data.name,
            email: data.email,
            password: data.password,
            confirmPassword: data.confirmPassword
        }

        const response = formData.edit === true ? await editUser(params) : await createUser(params)
        if (response.status === 'Failed' && response.errors) {
            setErrorMessage(response.errors)
        } else if (response.status === 'Success') {
            enqueueSnackbar("User has been created!", { variant: 'success' })
            setFormData(initialValue)
            toggleModal(formData.edit === false ? 'edit' : 'create', 'close')
            mutateUserData()
        }
    }


    const toggleModalDelete = (id) => {
        showPopup(
            'confirm',
            'Are you sure you want to delete this user?',
            'Yes',
            async () => {
                const response = await deleteUser(id)
                if (response.status === 'Failed' && response.errors) {
                    enqueueSnackbar(response.message, { variant: 'error' })
                } else if (response.status === 'Success') {
                    enqueueSnackbar(response.message, { variant: 'success' })
                    mutateUserData()
                }
            }
        );
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
                    title={formData.edit ? "Edit User" : 'Create User'}
                    onClose={() => toggleModal('create', 'close')}
                />
                <form onSubmit={(e) => handleSubmitForm(e, formData)}>
                    <DialogContent style={{ paddingTop: '0 !important' }}>
                        <div className="mt-2">
                            <MSelect
                                className={'mb-[18px]'}
                                fullWidth
                                name="userType"
                                label="Role"
                                value={formData.userType}
                                onChange={(event) => handleInputChange(event)}
                                error={errorMessage ? errorMessage.userType : null}
                                keyPair={['id', 'name']}
                                options={roleOptions()}
                                errorMessage={errorMessage && errorMessage?.userType ? errorMessage?.userType : false}
                            />
                            <MInput
                                fullwidth
                                style={{ marginBottom: 18 }}
                                variant="outlined"
                                name="name"
                                label="Name"
                                placeholder="Input Name"
                                value={formData.name}
                                onChange={(event) => handleInputChange(event)}
                                errorMessage={errorMessage && errorMessage?.name ? errorMessage?.name : false}
                            />
                            <MInput
                                fullwidth
                                style={{ marginBottom: 18 }}
                                variant="outlined"
                                name="email"
                                label="Email"
                                placeholder="Input Email"
                                value={formData.email}
                                onChange={(event) => handleInputChange(event)}
                                errorMessage={errorMessage && errorMessage?.email ? errorMessage?.email : false}
                            />
                            <MInput
                                fullwidth
                                style={{ marginBottom: 18 }}
                                variant="outlined"
                                name="password"
                                label="Password"
                                placeholder="Input Password"
                                value={formData.password}
                                onChange={(event) => handleInputChange(event)}
                                type='password'
                                errorMessage={errorMessage && errorMessage?.password ? errorMessage?.password : false}
                            />
                            <MInput
                                fullwidth
                                style={{ marginBottom: 18 }}
                                variant="outlined"
                                name="confirmPassword"
                                label="Confirm Password"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={(event) => handleInputChange(event)}
                                type='password'
                                errorMessage={errorMessage && errorMessage?.confirmPassword ? errorMessage?.confirmPassword : false}
                            />

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
        setUserQuery({
            ...userQuery,
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
                title="User List"
                loading={isLoadingUserData}
                data={userData?.data ? userData?.data : []}
                total={userData?.meta ? userData?.meta?.total : 0}
                page={userData?.meta ? userData?.meta?.page : 1}
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
