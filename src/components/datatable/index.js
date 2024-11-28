import React, { useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Button,
  CircularProgress,
  IconButton,
  Paper,
  ThemeProvider,
  Tooltip,
  Typography,
} from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { Add, Delete, Edit, Search } from "@mui/icons-material";
import _ from "lodash";

const getMuiTheme = () =>
  createTheme({
    palette: {
      primary: {
        main: "#5538f4",
      },
    },
    typography: {
      fontFamily: ["Poppins", "sans-serif"].join(","),
    },
    components: {
        MuiButton: {
            
        },
      MUIDataTableSearch: {
        styleOverrides: {
          main: {
            alignItems: "center",
            position: "relative",
            left: "-10px !important",
          },
        },
      },
      MuiToolbar: {
        styleOverrides: {
          regular: {
            minHeight: 48,
          },
          root: {
            minHeight: "30px !important",
            marginTop: "16px !important",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          elevation4: {
            boxShadow: "none",
            marginBottom: 48,
          },
          rounded: {
            borderRadius: 18,
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
            borderTop: "1px solid rgba(224, 224, 224, 1)",
            borderLeft: "1px solid rgba(224, 224, 224, 1)",
            borderRight: "1px solid rgba(224, 224, 224, 1)",
          },
        },
      },
      MUIDataTableJumpToPage: {
        styleOverrides: {
          root: {
            color: "#656464",
          },
          select: {
            color: "#656464",
          },
        },
      },
      MuiTablePagination: {
        styleOverrides: {
          input: {
            color: "#656464",
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          h6: {
            color: "#656464",
            fontSize: "18px",
            fontWeight: "700",
            marginBottom: "0px",
            marginTop: "-8px",
            marginLeft: "-8px",
          },
          body2: {
            color: "#656464",
          },
        },
      },
      MuiTooltip: {
        styleOverrides: {
          tooltipPlacementBottom: {
            marginTop: "4px !important",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
            paddingLeft: "18px",
            paddingRight: "8px",
            paddingTop: "10px",
            paddingBottom: "10px",
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            padding: "4px",
          },
        },
      },
      MUIDataTableHeadCell: {
        styleOverrides: {
          root: {
            color: "#656464",
            fontWeight: "500",
            fontSize: "14px !important",
            fontStyle: "normal",
            borderBottom: "1px solid rgba(224, 224, 224, 1)",
            "&:nth-of-type(1)": {
              width: "20px",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          containedSizeSmall: {
            paddingLeft: "4px",
            paddingRight: "4px",
            paddingTop: "3px",
            paddingBottom: "3px",
          },
          startIcon: {
            marginRight: "3px",
            marginLeft: "-1px !important",
          },
          iconSizeSmall: {
            marginLeft: "2px",
          },
          containedPrimary: {
            color: "#FFF",
            backgroundColor: "#5538f4",
            boxShadow: "none",
            "&:hover": {
              backgroundColor: "#25a19d",
              boxShadow: "none",
            },
          },
          containedSecondary: {
            color: "#FFF",
            backgroundColor: "#E5AF5A",
            boxShadow: "none",
            "&:hover": {
              boxShadow: "none",
              backgroundColor: "#D09F53",
            },
          },
        },
      },
      MUIDataTableBodyCell: {
        styleOverrides: {
          root: {
            color: "#656464",
            fontWeight: "400",
            fontSize: "13px",
            fontStyle: "normal",
            paddingLeft: "9px",
            paddingRight: "6px",
            paddingTop: "6px",
            paddingBottom: "6px",
          },
        },
      },
      MUIDataTableBodyRow: {
        styleOverrides: {
          root: {
            borderBottom: "1px solid black",
          },
        },
      },
      MuiTableFooter: {
        styleOverrides: {
          root: {
            borderBottom: "2px solid rgba(0, 0, 0, 0)",
          },
        },
      },
    },
  });


export const Datatable = (props) => {
  const [state, setState] = useState({
    page: 1,
    limit: 10,
    sortBy: '',
    order: 'desc',
    searchKeyword: "",
    resetPage: false,
    defOrder: null,
    defSortBy: null,
  })

  const refreshDatatable = () => {
    const { page, limit, sortBy, order } = state;
    props.handleReload({
      page: page,
      limit: limit,
      sortBy: sortBy,
      order: order,
    })
  }

  const handleReset = () => {
    setState({
      ...state,
      page: 1,
      limit: 10,
      sortBy: '',
      order: 'desc',
      searchKeyword: 'null',
      resetPage: false,
      defOrder: null,
      defSortBy: null,
    });
  }

  const handleSearch = (keyword) => {
    handleDebounceSearch(keyword);
  }

  const handleDebounceSearch = _.debounce((keyword) => {
    props.handleSearch(keyword);
    setState({
      ...state,
      searchKeyword: keyword,
      page: 1,
      resetPage: true,
    })
    setState({
      ...state,
      resetPage: false,
    })
  });

  const handleSort = (params) => {
    const { sortBy, order } = state;
    let { changedColumn, direction } = params;

    if (changedColumn === sortBy) {
      if (order === 'asc') direction = 'desc';
      if (order === 'desc') direction = 'asc';
    } else {
      direction = 'asc';
    }

    setState({
      ...state,
      sortBy: changedColumn,
      order: direction,
      resetPage: true,
    });
    // refreshDatatable()
    setState({ ...state, resetPage: false });
  }

  const renderColumns = () => {
    const { columns, handleEdit, handleDelete, handleDetail, customActions, hideActions, manualNumbering, isSuperAdmin } = props;
    const { sortBy, order } = state;
    const indexColumn = {
      name: 'number',
      label: 'No',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta) => {
          const { page, limit } = state;
          return (tableMeta.rowIndex + ((page - 1) * limit)) + 1;
        },
      },
    };


    const actionColumns = {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div style={{ display: 'flex' }}>
              {
                handleDetail ?
                  (
                    <Tooltip title="Detail">
                      <div style={{ display: 'inline', marginRight: '5px' }}>
                        <Button
                          variant="contained"
                          size='small'
                          style={{
                            'backgroundColor': '#5538f4',
                            'boxShadow': 'none',
                            'color': '#fff',
                            // '&:hover': {
                            //   'boxShadow': 'none',
                            //   'backgroundColor': '#25a19d',
                            // },
                            'minWidth': '10px',
                            'paddingRight': '0px',
                          }}
                          startIcon={<Search />}
                          onClick={() => handleDetail(tableMeta)}
                        >
                        </Button>
                      </div>
                    </Tooltip>
                  ) : ''
              }
              {
                handleEdit ?
                  (
                    <Tooltip title="Edit">
                      <div style={{ display: 'inline', marginRight: '5px' }}>
                        <Button
                          variant="contained"
                          color="primary"
                          size='small'
                          onClick={() => handleEdit(tableMeta.rowData)}
                          startIcon={<Edit />}
                          style={{
                            'minWidth': '10px',
                            'paddingRight': '0px',
                          }}
                        >
                        </Button>
                      </div>
                    </Tooltip>
                  ) : ''
              }
              {
                handleDelete ?
                  (
                    <Tooltip title={isSuperAdmin ? `Delete` : `Remove`}>
                      <div style={{ display: 'inline', marginRight: '5px' }}>
                        <Button
                          variant="contained"
                          color="secondary"
                          size='small'
                          onClick={() => handleDelete(tableMeta.rowData)}
                          startIcon={<Delete />}
                          style={{
                            'minWidth': '10px',
                            'paddingRight': '0px',
                          }}
                        >
                        </Button>
                      </div>
                    </Tooltip>
                  ) : ''
              }
              {customActions ? customActions(tableMeta.rowData) : ''}
            </div>
          );
        },
      },
    };

    const dataColumns = columns.map((value) => {
      const customBodyRender = () => {
        return value.customBodyRender ? value.customBodyRender : undefined;
      };

      return {
        name: value.name,
        label: value.label,
        options: {
          filter: value.name,
          sort: value.name,
          display: value.display,
          sortOrder: value.name === sortBy ? order : 'none',
          customBodyRender: customBodyRender(),
        },
      };
    });

    return [
      ...(manualNumbering !== true ? [indexColumn] : []),
      ...dataColumns,
      ...(hideActions !== true ? [actionColumns] : []),
    ];
  }

  const { searchKeyword } = state;
  const { title, loading, data, creatable, total, shift, download, searchable, handleCreate, paging, customTools } = props;

  return (
    <ThemeProvider theme={getMuiTheme()}>
      <MUIDataTable
        title={title}
        data={loading ? [] : data}
        columns={renderColumns()}
        key={title}
        options={{
          filterType: "dropdown",
          responsive: "standard",
          search: searchable === true ? true : false,
          print: false,
          download: download === true ? true : false,
          serverSide: true,
          filter: false,
          sortFilterList: true,
          count: total,
          pagination: paging === false ? false : true,
          selectableRows: "none",
          viewColumns: false,
          jumpToPage: true,
          rowsPerPageOptions: [10, 25, 50, 100],
          textLabels: {
            body: {
              noMatch: loading ? (
                <>
                  <CircularProgress
                    key={title}
                    color="inherit"
                    size={24}
                    style={{ marginRight: 10, top: 7, position: "relative" }}
                  />
                  Loading...
                </>
              ) : (
                "Sorry, no matching records found"
              ),
            },
            toolbar: {
              search: "Search",
            },
          },
          customToolbar: () => {
            return (
              <div style={{ overflow: "hidden" }}>
                {creatable === false ? undefined : (
                  <Tooltip title="Create">
                    <div style={{ float: "right" }}>
                      <IconButton
                        onClick={() => { props.handleCreate() }}
                        disabled={loading ? true : false}
                      >
                        {<Add />}
                      </IconButton>
                    </div>
                  </Tooltip>
                )}
                {!customTools ? undefined : customTools}
              </div>
            );
          },
          searchText: searchKeyword,
          searchPlaceholder: "Enter search keyword",
          onSearchChange: (keyword) => {
            handleSearch(keyword);
          },
          onChangePage: (currentPage) => {
            const { page, limit, sortBy, order } = state;
            setState({
              ...state,
              page: currentPage + 1,
              limit: limit,
              sortBy: sortBy,
              order: order,
            });
            props.handleReload({
              page: currentPage + 1,
              limit: limit,
              sortBy: sortBy,
              order: order,
            })
          },
          onChangeRowsPerPage: (numberOfRows) => {
            const { page, limit, sortBy, order } = state;
            setState({
              ...state,
              page: page,
              limit: numberOfRows,
              sortBy: sortBy,
              order: order,
            });
            props.handleReload({
              page: page,
              limit: numberOfRows,
              sortBy: sortBy,
              order: order,
            })
          },
          onColumnSortChange: (changedColumn, direction) => {
            const { page, limit, sortBy, order } = state;
            setState({
              ...state,
              page: page,
              limit: limit,
              sortBy: changedColumn,
              order: direction,
            });
            props.handleReload({
              page: page,
              limit: limit,
              sortBy: changedColumn,
              order: direction,
              resetPage: true,
            })
          },
          onTableChange: (action, tableState) => {
            if (action === "propsUpdate") {
              if (state.resetPage) {
                tableState.page = 0;
                setState({ ...state, resetPage: false });
              }

              // const pages = tableState.page + 1;
              // setState({
              //   ...state,
              //   page: pages,
              //   limit: tableState.rowsPerPage,
              //   sortBy: tableState.sortOrder.name ? tableState.sortOrder.name : '',
              //   order: tableState.sortOrder.direction ? tableState.sortOrder.direction : 'desc',

              // });
              // refreshDatatable();
            }
          },
        }}
      />
    </ThemeProvider>
  );

}

