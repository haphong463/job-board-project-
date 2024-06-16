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
} from "reactstrap";
import Form from "./FormBlog";
import { useDispatch, useSelector } from "react-redux";
import { fetchBlogs, deleteBlog } from "../../../features/blogSlice";
import moment from "moment/moment";
import { fetchBlogCategory } from "../../../features/blogCategorySlice";
import showToast from "../../../utils/functions/showToast";

export function Blog(props) {
  const dispatch = useDispatch();
  const blogData = useSelector((state) => state.blogs.blogs) || [];

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
        >
          [{row.id}] {row.title}
        </div>
      ),
    },
    {
      name: "Category",
      selector: (row) => row.category.name,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          <Badge>{row.category.name}</Badge>
        </div>
      ),
    },
    {
      name: "Posted By",
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          {`${row.user?.firstName} ${row.user?.lastName}`}
        </div>
      ),
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <div
          style={{
            fontSize: "16px",
          }}
        >
          <Badge
            color={
              {
                DRAFT: "secondary",
                PUBLISHED: "success",
                ARCHIVED: "danger",
                PENDING_REVIEW: "warning",
                SCHEDULED: "info",
              }[row.status]
            }
          >
            {row.status}
          </Badge>
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
        <div className="d-flex">
          <button
            onClick={() => handleEdit(row.id)}
            style={{ marginRight: "10px" }}
            className="btn btn-info"
          >
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

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
            selectableRows
            onSelectedRowsChange={(state) => console.log(state.selectedRows)}
            pagination
            paginationPerPage={5}
            paginationRowsPerPageOptions={[5, 10, 15]}
          />
        </Card>
      </Col>
    </Row>
  );
}

export default Blog;
