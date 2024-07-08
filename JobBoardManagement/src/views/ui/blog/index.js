import React, { useEffect, useState, useCallback } from "react";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Card,
  CardTitle,
  InputGroup,
  InputGroupText,
  Input,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Form from "./FormBlog";
import { useDispatch, useSelector } from "react-redux";
import { searchBlogs, deleteBlog } from "../../../features/blogSlice";
import debounce from "lodash.debounce";
import "./style.css";

export function Blog(props) {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogs);
  const totalPages = useSelector((state) => state.blogs.totalPages);

  const [dropdownOpen, setDropdownOpen] = useState({});

  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const [isEdit, setIsEdit] = useState(null);

  useEffect(() => {
    dispatch(
      searchBlogs({ query: searchTerm, page: currentPage, size: pageSize })
    );
  }, [dispatch, currentPage, pageSize]);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this blog?")) {
      dispatch(deleteBlog(id));
    }
  };

  const handleEdit = (id) => {
    const existBlog = blogData.find((item) => item.id === id);
    if (existBlog) {
      setIsEdit(existBlog);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      dispatch(searchBlogs({ query, page: currentPage, size: pageSize }));
    }, 300),
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

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontWeight: "bold",
          }}
          className="text-truncate-multiline"
        >
          [{row.id}] {row.title}
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.categories.length,
      sortable: true,
      cell: (row) => {
        const displayCategories = row.categories.slice(0, 2);
        const hasMore = row.categories.length > 2;

        return (
          <div>
            {displayCategories.map((item) => (
              <Badge key={item.id}>{item.name}</Badge>
            ))}
            {hasMore && <span>...</span>}
          </div>
        );
      },
    },
    {
      name: "Visibility",
      selector: (row) => row.visibility,
      sortable: true,
      cell: (row) => {
        return <div>{row.visibility ? "Show" : "Hide"}</div>;
      },
    },
    {
      name: "Posted By",
      width: "300px",
      cell: (row) => <div>{row.user.email}</div>,
    },
    {
      name: "Comments Count",
      selector: (row) => row.commentCount,
      sortable: true,
      cell: (row) => <div>{row.commentCount}</div>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Dropdown
          isOpen={dropdownOpen[row.id]}
          toggle={() => toggleDropdown(row.id)}
        >
          <DropdownToggle caret>Actions</DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleEdit(row.id)}>Edit</DropdownItem>
            <DropdownItem onClick={() => handleDelete(row.id)}>
              Delete
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      ),
    },
  ];

  const customStyles = {
    rows: {
      style: {
        margin: "15px 0", // Adjust the margin to create spacing between rows
      },
    },
  };

  return (
    <Row>
      <Col lg="12">
        <Form isEdit={isEdit} setIsEdit={setIsEdit} />
      </Col>
      <Col lg="12">
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
          <DataTable
            columns={columns}
            data={blogData}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={(state) =>
              console.log(state.selectedRows.map((item) => item.id))
            }
            pagination
            paginationPerPage={pageSize}
            paginationRowsPerPageOptions={[5, 10, 15]}
            paginationTotalRows={totalPages * pageSize}
            paginationServer
            onChangePage={(page) => setCurrentPage(page - 1)}
            onChangeRowsPerPage={handlePerRowsChange}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default Blog;
