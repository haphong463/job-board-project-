import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserThunk,
  updateUserStatusThunk,
} from "../../../features/userSlice";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardTitle,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "reactstrap";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import debounce from "lodash.debounce";

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.list);
  const totalPages = useSelector((state) => state.user.totalPages);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const handleStatusToggle = (userId, isEnabled) => {
    NProgress.start();
    dispatch(updateUserStatusThunk({ userId, isEnabled: !isEnabled })).finally(
      () => {
        NProgress.done();
      }
    );
  };

  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div>
          <img
            src={
              row.imageUrl ? row.imageUrl : "https://i.sstatic.net/l60Hf.png"
            }
            className="rounded-circle"
            width={50}
            height={50}
            alt={row.id}
          />
        </div>
      ),
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
      cell: (row) => <div>{row.username}</div>,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <div>{row.email}</div>,
    },
    {
      name: "Gender",
      cell: (row) => <div>{row.gender}</div>,
    },
    {
      name: "Status",
      selector: (row) => row.isEnabled,
      sortable: true,
      cell: (row) => (
        <Badge pill color={row.isEnabled ? "primary" : "danger"}>
          {row.isEnabled ? "Active" : "Deactive"}
        </Badge>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          size="sm"
          color={row.isEnabled ? "danger" : "success"}
          onClick={() => handleStatusToggle(row.id, row.isEnabled)}
        >
          {row.isEnabled ? "Deactivate" : "Activate"}
        </Button>
      ),
    },
  ];

  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(getUserThunk({ query, page: currentPage, size: pageSize }));
    }, 500),
    [dispatch, currentPage, pageSize]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const handlePerRowsChange = (newPageSize, page) => {
    setPageSize(newPageSize);
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    dispatch(
      getUserThunk({ query: searchTerm, page: currentPage, size: pageSize })
    );
  }, [dispatch, currentPage, pageSize]);

  const customStyles = {
    rows: {
      style: {
        margin: "15px 0",
      },
    },
  };

  console.log("currentPage: ", currentPage);

  if (status === "rejected") {
    return <Alert color="danger">Error: {error}</Alert>;
  }

  return (
    <Card>
      <CardTitle tag="h6" className="border-bottom p-3 mb-0">
        <i className="bi bi-card-text me-2"> </i>
        Blog List
      </CardTitle>
      <InputGroup className="mb-3">
        <InputGroupText>Search</InputGroupText>
        <Input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </InputGroup>
      {status === "loading" && (
        <div className="d-flex justify-content-center h-100">
          <Spinner type="grow" />
        </div>
      )}
      <DataTable
        columns={columns}
        data={users}
        customStyles={customStyles}
        pagination
        paginationPerPage={pageSize}
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationServer
        paginationTotalRows={totalPages * pageSize} // Assuming 10 items per page
        onChangePage={(page) => setCurrentPage(page - 1)}
        onChangeRowsPerPage={handlePerRowsChange}
      />
    </Card>
  );
};

export default UserList;
