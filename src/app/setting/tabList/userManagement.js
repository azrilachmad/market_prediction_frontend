import { Datatable } from "@/components/datatable"
import { MButton, ModalTitle } from "@/components/form";
import { convDate } from "@/helpers";
import { getUserList } from "@/service/user";
import { closeBtn } from "@/styles/theme/theme";
import { primaryButton } from "@/themes/theme";
import { Search, Send } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, Grid, Tooltip, Typography } from "@mui/material"
import { useState } from "react";
import { useQuery } from "react-query";
import { ThemeProvider } from "styled-components";

export const UserManagement = () => {

    const [modalDetail, setModalDetail] = useState(false)
    const [userQuery, setUserQuery] = useState({
        page: 1,
        limit: 10,
        order: 'desc',
        sortBy: null,
    })
    const [query, setQuery] = useState('')

    const [detailUserData, setDetailUserData] = useState({
        id: null,
        userType: null,
        name: null,
        email: null,
        password: null,
    })

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
                ...query && { query: query },
            },
        ],
        queryFn: ({ queryKey }) => getUserList(queryKey[1]),
    });

    const renderModalDetail = () => {
        return (
            <Dialog
                scroll="paper"
                fullWidth
                className="md"
                open={modalDetail}
                onClose={() => toggleModalDetail('close')}
            >
                <ModalTitle
                    title={"User Detail"}
                    onClose={() => toggleModalDetail('close')}
                />
                <DialogContent style={{ paddingTop: '0 !important' }}>
                    <Grid container spacing={2}>
                        <Grid item xs={4.5} className="mb-2">
                            <Typography className="text-sm"><b>Name</b></Typography>
                        </Grid>
                        <Grid item >
                            <Typography className="text-sm">:</Typography>
                        </Grid>
                        <Grid item >
                            <Typography className="text-sm">{detailUserData.name ? detailUserData.name : '-'}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4.5} className="mb-2">
                            <Typography className="text-sm"><b>Email</b></Typography>
                        </Grid>
                        <Grid item >
                            <Typography className="text-sm">:</Typography>
                        </Grid>
                        <Grid item>
                            <Typography className="text-sm">{detailUserData.email ? detailUserData.email : '-'}</Typography>
                        </Grid>
                    </Grid>
                    <Grid container spacing={2}>
                        <Grid item xs={4.5} className="mb-2">
                            <Typography className="text-sm"><b>Role</b></Typography>
                        </Grid>
                        <Grid item >
                            <Typography className="text-sm">:</Typography>
                        </Grid>
                        <Grid item>
                            <Typography className="text-sm">{detailUserData.userType ===  '1' ? 'Superadmin' : 'User'}</Typography>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions style={{
                    padding: '0px 20px 20px 20px',
                }}>
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
                </>
            </div>
        );
    };

    const toggleModalDetail = (type, params) => {
        if (type === 'open') {
            // console.log(params)
            setDetailUserData({
                id: params[1],
                userType: params[2],
                name: params[3],
                email: params[4],
                password: params[6],
            })
            setModalDetail(true)
        } else if (type === 'close') {
            setDetailUserData({
                id: null,
                userType: null,
                name: null,
                email: null,
                password: null,

            })
            setModalDetail(false)
        }
    }


    const handleReload = (params) => {
        setUserQuery({
            ...vehicleQuery,
            page: params.page,
            limit: params.limit,
            sortBy: params.sortBy,
            order: params.order,
            // resetDatatable: true,
            // resetPage: true,
        })
    }


    const columns = [
        {
            name: "id",
            label: "id",
            display: false,
            customBodyRender: (value) => (value ? value : "-"),
        },
        {
            name: "userType",
            label: "User Type",
            display: false,
            customBodyRender: (value) => (value ? value : "-"),
        },
        {
            name: "name",
            label: "Name",
            display: true,
            customBodyRender: (value) => (value ? value : "-"),
        },
        {
            name: "email",
            label: "Email",
            display: true,
            customBodyRender: (value) => (value ? value : "-"),
        },
        {
            name: "userType",
            label: "Role",
            display: true,
            customBodyRender: (value) => (value === '1' ? 'Superadmin' : "User"),
        },
        {
            name: "password",
            label: "Password",
            display: false,
            customBodyRender: (value) => (value ? value : "-"),
        },

    ];

    return (
        <>
            {renderModalDetail()}
            <Datatable
                creatable={false}
                title={"User List"}
                loading={isLoadingUserData}
                data={userData?.data ? userData?.data : []}
                total={userData?.meta ? userData?.meta?.total : 0}
                page={userData?.meta ? userData?.meta?.page : 1}
                columns={columns}

                handleReload={(params) => handleReload(params)}
                // handleDetail={(params) => this.toggleModal('detail', params)}
                handleCreate={() => {
                    setFormData(initialValue)
                    toggleModalDetail('open', params)
                }}
                customActions={(params) => renderActions(params)}
                manualNumbering={false}
            />
        </>
    )
}