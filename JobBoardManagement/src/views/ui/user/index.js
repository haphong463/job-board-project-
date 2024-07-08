import React, { useCallback, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteUserThunk,
  getUserThunk,
  updateUserStatusThunk,
} from "../../../features/userSlice";
import {
  Alert,
  Badge,
  Button,
  Card,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupText,
  Spinner,
} from "reactstrap";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import debounce from "lodash.debounce";
import { ModeratorForm } from "./ModeratorForm";
import "./style.css";
import Swal from "sweetalert2";
const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.list);
  const totalPages = useSelector((state) => state.user.totalPages);
  const status = useSelector((state) => state.user.status);
  const error = useSelector((state) => state.user.error);

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [dropdownOpen, setDropdownOpen] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const handleStatusToggle = (userId, isEnabled) => {
    NProgress.start();
    dispatch(updateUserStatusThunk({ userId, isEnabled: !isEnabled })).finally(
      () => {
        NProgress.done();
      }
    );
  };

  const handleDeleteUser = (userId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        // Gọi action để xóa user
        dispatch(deleteUserThunk(userId)).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            Swal.fire("Deleted!", "The user has been deleted.", "success");
          }
        });
      }
    });
  };
  const mapRoleName = (roleName) => {
    switch (roleName) {
      case "ROLE_ADMIN":
        return "ADMINISTRATOR";
      case "ROLE_MODERATOR":
        return "MODERATOR";
      case "ROLE_USER":
        return "USER";
      default:
        return "";
    }
  };

  const columns = [
    {
      name: "Image",
      cell: (row) => (
        <div>
          <img
            src={
              row.imageUrl
                ? row.imageUrl
                : "https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg"
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
      width: "300px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <div>{row.email}</div>,
      width: "300px",
    },
    {
      name: "Gender",
      cell: (row) => row.gender ?? "Not updated",
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
      name: "Role",
      cell: (row) => row.roles.map((item) => mapRoleName(item.name)).join(", "),
      width: "200px",
    },
    {
      name: "Actions",
      cell: (row) =>
        !row.roles.map((item) => item.name).includes("ROLE_ADMIN") && (
          <Dropdown
            isOpen={dropdownOpen[row.id]}
            toggle={() => toggleDropdown(row.id)}
            a11y
          >
            <DropdownToggle caret size="sm">
              Actions
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                onClick={() => handleStatusToggle(row.id, row.isEnabled)}
              >
                {row.isEnabled ? "Deactivate" : "Activate"}
              </DropdownItem>
              {!row.isEnabled && (
                <DropdownItem
                  color="danger"
                  onClick={() => handleDeleteUser(row.id)}
                >
                  Delete
                </DropdownItem>
              )}
            </DropdownMenu>
          </Dropdown>
        ),
    },
  ];

  const debouncedSearch = useCallback(
    debounce((query, role) => {
      dispatch(
        getUserThunk({ query, role, page: currentPage, size: pageSize })
      );
    }, 500),
    [dispatch, currentPage, pageSize]
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value, roleFilter);
  };

  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
    debouncedSearch(searchTerm, e.target.value);
  };

  const handlePerRowsChange = (newPageSize, page) => {
    setPageSize(newPageSize);
    setCurrentPage(page - 1);
  };

  useEffect(() => {
    dispatch(
      getUserThunk({
        query: searchTerm,
        role: roleFilter,
        page: currentPage,
        size: pageSize,
      })
    );
  }, [dispatch, currentPage, pageSize]);

  const customStyles = {
    rows: {
      style: {
        padding: "15px 0",
      },
    },
  };

  // if (status === "rejected") {
  //   return <Alert color="danger">Error: {error}</Alert>;
  // }

  return (
    <>
      <ModeratorForm />

      <Card>
        <CardTitle tag="h6" className="border-bottom p-3 mb-0">
          <i className="bi bi-card-text me-2"> </i>
          User List
        </CardTitle>
        <InputGroup className="mb-3">
          <InputGroupText>Search</InputGroupText>
          <Input
            type="text"
            placeholder="Search by username or email"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <InputGroupText>Role</InputGroupText>
          <Input type="select" value={roleFilter} onChange={handleRoleChange}>
            <option value="">All Roles</option>
            <option value="ROLE_ADMIN">Admin</option>
            <option value="ROLE_MODERATOR">Moderator</option>
            <option value="ROLE_USER">User</option>
          </Input>
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
    </>
  );
};

export default UserList;
