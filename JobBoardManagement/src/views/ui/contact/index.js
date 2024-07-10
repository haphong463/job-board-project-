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
} from "reactstrap";
import axios from "axios";
import nprogress from "nprogress";

const ContactIndex = (props) => {
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    nprogress.start();
    axios.get("http://localhost:8080/api/contacts")
      .then(response => {
        setContacts(response.data);
        setStatus("succeeded");
        nprogress.done();
      })
      .catch(error => {
        console.error("Error fetching contacts:", error);
        setStatus("failed");
        nprogress.done();
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      nprogress.start();
      axios.delete(`http://localhost:8080/api/contacts/${id}`)
        .then(() => {
          setContacts(prevContacts => prevContacts.filter(contact => contact.id !== id));
          nprogress.done();
        })
        .catch(error => {
          console.error(`Error deleting contact with id ${id}:`, error);
          nprogress.done();
        });
    }
  };

  const columns = [

    {
      name: "First Name",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Last Name",
      selector: (row) => row.lastName,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      sortable: true,
    },
    {
      name: "Message",
      selector: (row) => row.message,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex">
          <button onClick={() => handleDelete(row.id)} className="btn btn-danger">
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <Row>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-envelope me-2"></i>
            Contact List
          </CardTitle>
          <InputGroup className="mb-3">
            <InputGroupText>Search</InputGroupText>
            <Input
              type="text"
              placeholder="Search by first name, last name, email, subject, or message"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={contacts.filter((contact) =>
                `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.subject} ${contact.message}`
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )}
              pagination
            />
          )}
        </Card>
      </Col>
    </Row>
  );
}

export default ContactIndex;
