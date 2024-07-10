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
  Button,
  FormGroup,
  Label,
  Select,
  Spinner,
} from "reactstrap";
import { CSVLink } from "react-csv";
import Form from "./FormBlog";
import { useDispatch, useSelector } from "react-redux";
import { searchBlogs, deleteBlog } from "../../../features/blogSlice";
import debounce from "lodash.debounce";
import { FaFileExcel } from "react-icons/fa";
import "./style.css";
import { fetchBlogCategory } from "../../../features/blogCategorySlice";
import Swal from "sweetalert2";

export function Blog(props) {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogs);
  const totalPages = useSelector((state) => state.blogs.totalPages);
  const status = useSelector((state) => state.blogs.status);
  const blogCategoryData = useSelector(
    (state) => state.blogCategory.blogCategory
  );

  const [dropdownOpen, setDropdownOpen] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedVisibility, setSelectedVisibility] = useState(2); // Default to 'All'
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [isEdit, setIsEdit] = useState(null);
  const encodedCategoryValue = encodeURIComponent(selectedCategory);

  const debouncedSearch = useCallback(
    debounce((query, type, visibility, page, size) => {
      dispatch(
        searchBlogs({
          query,
          type,
          page,
          size,
          visibility,
        })
      );
    }, 300),
    [dispatch]
  );

  useEffect(() => {
    debouncedSearch(
      searchTerm,
      encodedCategoryValue,
      selectedVisibility,
      currentPage,
      pageSize
    );
  }, [
    debouncedSearch,
    searchTerm,
    selectedCategory,
    selectedVisibility,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    dispatch(fetchBlogCategory());
  }, [dispatch]);

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleDelete = (id) => {
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
        dispatch(deleteBlog(id));
        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
      }
    });
  };

  const handleEdit = (id) => {
    const existBlog = blogData.find((item) => item.id === id);
    if (existBlog) {
      setIsEdit(existBlog);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleVisibilityChange = (e) => {
    setSelectedVisibility(e.target.value);
  };

  const handlePerRowsChange = (newPageSize, page) => {
    setPageSize(newPageSize);
    setCurrentPage(page - 1);
  };

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      width: "300px",

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
        // const displayCategories = row.categories.slice(0, 2);
        // const hasMore = row.categories.length > 2;

        return (
          <div>
            {row.categories.map((item) => (
              <Badge
                color="primary"
                key={item.id}
                style={{ margin: "0 5px 5px 0" }}
              >
                {item.name}
              </Badge>
            ))}
            {/* {hasMore && <span>...</span>} */}
          </div>
        );
      },
    },
    {
      name: "Visibility",
      selector: (row) => row.visibility,
      sortable: true,
      cell: (row) => {
        return (
          <Badge color={row.visibility ? "info" : "danger"}>
            {row.visibility ? "Show" : "Hide"}
          </Badge>
        );
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
          <DropdownToggle caret color="info">
            Actions
          </DropdownToggle>
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

  const csvHeaders = [
    { label: "ID", key: "id" },
    { label: "Title", key: "title" },
    { label: "Category", key: "categories" },
    { label: "Visibility", key: "visibility" },
    { label: "Posted By", key: "user.email" },
    { label: "Comments Count", key: "commentCount" },
  ];

  const csvData = blogData.map((row) => ({
    id: row.id,
    title: row.title,
    categories: row.categories.map((c) => c.name).join(", "),
    visibility: row.visibility ? "Show" : "Hide",
    "user.email": row.user.email,
    commentCount: row.commentCount,
  }));

  console.log(">>>status: ", status === "loading");

  return (
    <Card>
      <div className="d-flex justify-content-between align-items-center p-3 gap-3">
        <h4>Blog List</h4>
        <div className="d-flex  p-3 gap-3">
          <Form isEdit={isEdit} setIsEdit={setIsEdit} />
          <CSVLink
            data={csvData}
            headers={csvHeaders}
            filename={"blog_data.csv"}
          >
            <Button color="success">
              <FaFileExcel />
              Export CSV
            </Button>
          </CSVLink>
        </div>
      </div>
      <div className="d-flex gap-3 px-2">
        <div className="form-floating" style={{ flex: 1, maxWidth: "400px" }}>
          <Input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            className="form-control"
            id="floatingSearch"
          />
          <label htmlFor="floatingSearch">Search</label>
        </div>

        <div className="form-floating" style={{ flex: 1, maxWidth: "200px" }}>
          <Input
            type="select"
            name="categorySelect"
            id="floatingCategorySelect"
            onChange={handleCategoryChange}
            value={selectedCategory}
            className="form-select"
          >
            <option value="ALL">All</option>
            {blogCategoryData.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </Input>
          <label htmlFor="floatingCategorySelect">Category</label>
        </div>

        <div className="form-floating" style={{ flex: 1, maxWidth: "200px" }}>
          <Input
            type="select"
            name="visibilitySelect"
            id="floatingVisibilitySelect"
            onChange={handleVisibilityChange}
            value={selectedVisibility}
            className="form-select"
          >
            <option value={2}>All</option>
            <option value={0}>Show</option>
            <option value={1}>Hide</option>
          </Input>
          <label htmlFor="floatingVisibilitySelect">Visibility</label>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={blogData}
        customStyles={customStyles}
        pagination
        paginationPerPage={pageSize}
        paginationRowsPerPageOptions={[5, 10, 15]}
        paginationTotalRows={totalPages * pageSize}
        paginationServer
        onChangePage={(page) => setCurrentPage(page - 1)}
        onChangeRowsPerPage={handlePerRowsChange}
        responsive
        progressPending={status === "loading"}
        progressComponent={<Spinner />}
      />
    </Card>
  );
}

export default Blog;
