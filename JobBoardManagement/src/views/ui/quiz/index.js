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
  ModalBody
} from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuizzesAsync, removeQuiz } from '../../../features/quizSlice';
import FormQuiz from './FormQuiz';
import FormQuestion from './FormQuestion';

const Quiz = () => {
  const dispatch = useDispatch();
  const quizzes = useSelector((state) => state.quizzes.quizzes || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEdit, setIsEdit] = useState(null);
  const [newQuizModal, setNewQuizModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null); 
  const [questionModal, setQuestionModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null); 

  useEffect(() => {
    setLoading(true);
    dispatch(fetchQuizzesAsync())
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
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="d-flex">
          <button onClick={() => handleEdit(row.id)} className="btn btn-info">
            Edit
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
          <button
            onClick={() => handleShowQuestions(row)}
            className="btn btn-primary"
          >
            Show Questions
          </button>
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
                    {question.questionText} - Correct Answer: {question.correctAnswer}
                    <button
                      className="btn btn-info btn-sm ms-2"
                      onClick={() => handleEditQuestion(question)}
                    >
                      Edit
                    </button>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary"
                onClick={() => setQuestionModal(true)}
              >
                Add Question
              </button>
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
