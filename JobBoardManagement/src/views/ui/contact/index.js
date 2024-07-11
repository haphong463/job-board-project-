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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import axios from "axios";
import nprogress from "nprogress";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ContactIndex = (props) => {
  const [contacts, setContacts] = useState([]);
  const [status, setStatus] = useState("idle");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContact, setSelectedContact] = useState(null);
  const [sendEmailDialogOpen, setSendEmailDialogOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState([]);

  useEffect(() => {
    nprogress.start();
    axios
      .get("http://localhost:8080/api/contacts")
      .then((response) => {
        setContacts(response.data);
        setStatus("succeeded");
        nprogress.done();
      })
      .catch((error) => {
        console.error("Error fetching contacts:", error);
        setStatus("failed");
        nprogress.done();
      });
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      nprogress.start();
      axios
        .delete(`http://localhost:8080/api/contacts/${id}`)
        .then(() => {
          setContacts((prevContacts) =>
            prevContacts.filter((contact) => contact.id !== id)
          );
          nprogress.done();
        })
        .catch((error) => {
          console.error(`Error deleting contact with id ${id}:`, error);
          nprogress.done();
        });
    }
  };

  const handleRead = (contact) => {
    setSelectedContact(contact);
  };

  const toggleDropdown = (index) => {
    const newDropdownOpen = [...dropdownOpen];
    newDropdownOpen[index] = !newDropdownOpen[index];
    setDropdownOpen(newDropdownOpen);
  };

  const handleDropdownAction = (action, row, index) => {
    switch (action) {
      case 'read':
        handleRead(row);
        break;
      case 'delete':
        handleDelete(row.id);
        break;
      case 'sendEmail':
        handleRead(row);
        setSendEmailDialogOpen(true);
        break;
      default:
        break;
    }
    toggleDropdown(index);
  };

  const handleSendEmail = () => {
    nprogress.start();
    axios.post("http://localhost:8080/api/contacts/send", {
      email: selectedContact.email,
      subject: selectedContact.subject,
      message: emailMessage,
    })
    .then((response) => {
      toast.success("Email sent successfully");
      setSendEmailDialogOpen(false);
      setSelectedContact(null); // Reset selectedContact to close Contact Details modal
      setEmailMessage(""); // Clear email message after sending
      nprogress.done();
    })
    .catch((error) => {
      console.error("Error sending email:", error);
      toast.error("Failed to send email. Please try again later.");
      nprogress.done();
    });
  };

  const handleCancelSendEmail = () => {
    setSendEmailDialogOpen(false);
    setSelectedContact(null); // Reset selectedContact to close Contact Details modal
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
      cell: (row, index) => (
        <Dropdown isOpen={dropdownOpen[index]} toggle={() => toggleDropdown(index)}>
          <DropdownToggle caret>
            Actions
          </DropdownToggle>
          <DropdownMenu>
            <DropdownItem onClick={() => handleDropdownAction('read', row, index)}>
              Read
            </DropdownItem>
            <DropdownItem onClick={() => handleDropdownAction('delete', row, index)}>
              Delete
            </DropdownItem>
            <DropdownItem onClick={() => handleDropdownAction('sendEmail', row, index)}>
              Send Email
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
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
          {status === "loading" ? (
            <div>Loading...</div>
          ) : (
            <DataTable
              columns={columns}
              data={contacts.filter(
                (contact) =>
                  `${contact.firstName} ${contact.lastName} ${contact.email} ${contact.subject} ${contact.message}`
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
              )}
              pagination
            />
          )}
        </Card>
      </Col>

      {/* Modal để hiển thị chi tiết contact */}
      <Modal isOpen={selectedContact !== null && !sendEmailDialogOpen} toggle={() => setSelectedContact(null)}>
        <ModalHeader toggle={() => setSelectedContact(null)}>Contact Details</ModalHeader>
        <ModalBody>
          {selectedContact && (
            <div>
              <p><strong>First Name:</strong> {selectedContact.firstName}</p>
              <p><strong>Last Name:</strong> {selectedContact.lastName}</p>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <p><strong>Subject:</strong> {selectedContact.subject}</p>
              <p><strong>Message:</strong> {selectedContact.message}</p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-secondary" onClick={() => setSelectedContact(null)}>Close</button>
        </ModalFooter>
      </Modal>

      {/* Modal để gửi email */}
      <Modal isOpen={sendEmailDialogOpen} toggle={handleCancelSendEmail}>
        <ModalHeader toggle={handleCancelSendEmail}>Send Email</ModalHeader>
        <ModalBody>
          {selectedContact && (
            <div>
              <p><strong>Email:</strong> {selectedContact.email}</p>
              <textarea
                className="form-control"
                rows="5"
                placeholder="Enter your message..."
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
              ></textarea>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <button className="btn btn-primary" onClick={handleSendEmail}>Send</button>
          <button className="btn btn-secondary" onClick={handleCancelSendEmail}>Cancel</button>
        </ModalFooter>
      </Modal>
    </Row>
  );
};

export default ContactIndex;
