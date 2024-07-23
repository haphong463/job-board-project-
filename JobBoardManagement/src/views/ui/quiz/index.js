import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
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
  Button
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzesAsync, removeQuiz } from '../../../features/quizSlice';
import { fetchCategoryQuiz } from '../../../features/quizCategorySlice';
import FormQuiz from './FormQuiz';
import FormQuestion from './FormQuestion';
import axios from 'axios';
// import axiosRequest from '../../../configs/axiosConfig';
import './quiz.css';
const Quiz = ({ quizId }) => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.quizzes || []);
  const categories = useSelector((state) => state.categoryQuiz.categories || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [isEdit, setIsEdit] = useState(null);
  const [newQuizModal, setNewQuizModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [questionModal, setQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchQuizzesAsync())
      .then(() => dispatch(fetchCategoryQuiz()))
      .then(() => setLoading(false))
      .catch(() => setLoading(false));
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      dispatch(removeQuiz(id));
    }
  };

  const toggleNewQuizModal = () => {
    setNewQuizModal(!newQuizModal);
    setIsEdit(null);
  };

  const handleEdit = (id) => {
    const editQuiz = quizzes.find((quiz) => quiz.id === id);
    if (editQuiz) {
      setIsEdit(editQuiz);
      setNewQuizModal(true);
    }
  };

  const handleShowQuestions = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const toggleQuestionsModal = () => {
    setSelectedQuiz(null);
  };

  const toggleQuestionModal = () => {
    setQuestionModal(!questionModal);
    setSelectedQuestion(null);
  };

  const handleEditQuestion = (question) => {
    setSelectedQuestion(question);
    setQuestionModal(true);
  };

  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions((prevSelected) => {
      if (prevSelected.includes(questionId)) {
        return prevSelected.filter((id) => id !== questionId);
      } else {
        return [...prevSelected, questionId];
      }
    });
  };

  const handleDeleteSelectedQuestions = async () => {
    if (window.confirm('Are you sure you want to delete the selected questions?')) {
      try {
        if (!selectedQuestions || selectedQuestions.length === 0) {
          alert("No questions selected for deletion.");
          return;
        }
  
        await axios.delete(`http://localhost:8080/api/quizzes/questions`, {
          data: selectedQuestions
        });
  
        // Optionally reset the selectedQuestions if needed
        setSelectedQuestions([]);
  
        // Dispatch an action to fetch quizzes again or update your state as necessary
        dispatch(fetchQuizzesAsync());
      } catch (error) {
        console.error("There was an error deleting the questions:", error);
        alert("An error occurred while deleting the questions. Please try again.");
      }
    }
  };
  const exportQuiz = (quizId, quizTitle) => {
    axios({
      url: `http://localhost:8080/api/quizzes/${quizId}/export`,
      method: 'GET',
      responseType: 'blob',
    })
      .then((response) => {
        const blob = new Blob([response.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute(
          'download',
          `quiz_${quizId}_${quizTitle.replaceAll(' ', '_')}.xls`
        );
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      })
      .catch((error) => {
        console.error('Error exporting quiz:', error);
      });
  };

  const columns = [
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      cell: (row) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {row.imageUrl && (
            <img
              src={row.imageUrl}
              alt={`Thumbnail for quiz titled "${row.title}"`}
              style={{
                width: '50px',
                height: 'auto',
                marginRight: '10px',
              }}
            />
          )}
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            [{row.id}] {row.title}
          </div>
        </div>
      ),
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
      cell: (row) => (
        <div className="description-cell">
          {row.description}
        </div>
      ),
    },
    {
      name: "Category Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => {
        const category = categories.find(cat => cat.id === row.name);
        return <div className="categoryId-cell">{category }</div>;
      }
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex">
          <Button onClick={() => handleEdit(row.id)} color="info">
            Edit
          </Button>
          <Button onClick={() => handleDelete(row.id)} color="danger">
            Delete
          </Button>
          <Button onClick={() => handleShowQuestions(row)} color="primary">
            Show Questions
          </Button>
          <Button onClick={() => exportQuiz(row.id, row.title)} color="success">
            Export
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Row>
      <Col lg="12">
        <FormQuiz
          isEdit={isEdit}
          setIsEdit={setIsEdit}
          toggleNewQuizModal={toggleNewQuizModal}
          newQuizModal={newQuizModal}
        />
      </Col>
      <Col lg="12">
        <Card>
          <CardTitle tag="h6" className="border-bottom p-3 mb-0">
            <i className="bi bi-card-text me-2"></i> Quiz List
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
          {loading ? (
            <p>Loading quizzes...</p>
          ) : (
            <DataTable
              columns={columns}
              data={quizzes.filter((quiz) =>
                quiz.title.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              pagination
              paginationPerPage={5}
              paginationRowsPerPageOptions={[5, 10, 15]}
            />
          )}
        </Card>
      </Col>

      {/* Modal for showing questions */}
      <Modal isOpen={!!selectedQuiz} toggle={toggleQuestionsModal}>
        <ModalHeader toggle={toggleQuestionsModal}>Questions</ModalHeader>
        <ModalBody>
          {selectedQuiz && (
            <>
              <ul>
                {(selectedQuiz.questions || []).map((question) => (
                  <li key={question.id}>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleSelectQuestion(question.id)}
                    />
                    {question.questionText} - Correct Answer: {question.correctAnswer}
                    <Button
                      color="info"
                      size="sm"
                      className="ms-2"
                      onClick={() => handleEditQuestion(question)}
                    >
                      Edit
                    </Button>
                  </li>
                ))}
              </ul>
              <Button color="danger" onClick={handleDeleteSelectedQuestions}>
                Delete Selected Questions
              </Button>
              <Button
                color="primary"
                onClick={() => setQuestionModal(true)}
              >
                Add Question
              </Button>
            </>
          )}
        </ModalBody>
      </Modal>

      {/* Modal for creating/updating questions */}
      <FormQuestion
        quizId={selectedQuiz?.id}
        selectedQuestion={selectedQuestion}
        toggleModal={toggleQuestionModal}
        isOpen={questionModal}
      />
    </Row>
  );
};

export default Quiz;
