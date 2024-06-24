import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import {
  Row,
  Col,
  Card,
  CardTitle,
  InputGroup,
  InputGroupText,
  Input,
  Alert,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import Form from "./FormBlog";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../../../features/blogSlice";
import moment from "moment/moment";
import { fetchBlogCategory } from "../../../features/blogCategorySlice";
import showToast from "../../../utils/functions/showToast";
import "./style.css";
export function Blog(props) {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogs) || [];
  const [dropdownOpen, setDropdownOpen] = useState({});

  const toggleDropdown = (id) => {
    setDropdownOpen((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [isEdit, setIsEdit] = useState(null);

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

  const filteredBlogs = blogData.filter((blog) =>
    blog.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
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
          <div
            style={{
              fontSize: "16px",
            }}
          >
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
        return (
          <div
            style={{
              fontSize: "16px",
            }}
          >
            {row.visibility ? "Show" : "Hide"}
          </div>
        );
      },
    },

    {
      name: "Posted By",
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.user.email}
        </div>
      ),
    },

    {
      name: "Comments Count",
      selector: (row) => row.commentCount,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {row.commentCount}
        </div>
      ),
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          <DataTable
            columns={columns}
            data={filteredBlogs}
            customStyles={customStyles}
            selectableRows
            onSelectedRowsChange={(state) =>
              console.log(state.selectedRows.map((item) => item.id))
            }
            pagination
            paginationPerPage={15}
            paginationRowsPerPageOptions={[5, 10, 15]}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default Blog;
