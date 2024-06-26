import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import axiosRequest from '../../../configs/axiosConfig';

import { createQuestion, updateQuestion, deleteQuestion } from '../../../features/quizSlice';

const FormQuestion = ({ quizId, selectedQuestion, toggleModal, isOpen }) => {
  const dispatch = useDispatch();
  const [questionText, setQuestionText] = useState('');
  const [options, setOptions] = useState({
    A: '',
    B: '',
    C: '',
    D: '',
  });
  const [correctAnswer, setCorrectAnswer] = useState('');

  useEffect(() => {
    if (selectedQuestion) {
      setQuestionText(selectedQuestion.questionText || '');
      const existingOptions = selectedQuestion.options?.split(', ') || [];
      setOptions({
        A: existingOptions[0]?.split('. ')[1] || '',
        B: existingOptions[1]?.split('. ')[1] || '',
        C: existingOptions[2]?.split('. ')[1] || '',
        D: existingOptions[3]?.split('. ')[1] || '',
      });
      setCorrectAnswer(selectedQuestion.correctAnswer || '');
    } else {
      setQuestionText('');
      setOptions({
        A: '',
        B: '',
        C: '',
        D: '',
      });
      setCorrectAnswer('');
    }
  }, [selectedQuestion]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const optionsString = `A. ${options.A}, B. ${options.B}, C. ${options.C}, D. ${options.D}`;

    const queryParams = new URLSearchParams({
      questionText,
      options: optionsString,
      correctAnswer,
    });

    try {
      let response;
      if (selectedQuestion) {
        response = await axiosRequest.put(
          `/quizzes/${quizId}/questions/${selectedQuestion.id}?${queryParams.toString()}`
        );
        dispatch(updateQuestion({ quizId, questionId: selectedQuestion.id, questionText, options: optionsString, correctAnswer }));
      } else {
        response = await axiosRequest.post(
          `/quizzes/${quizId}/questions?${queryParams.toString()}`
        );
        dispatch(createQuestion({ quizId, questionText, options: optionsString, correctAnswer }));
      }

      console.log('Created/updated question:', response);
      toggleModal();
    } catch (error) {
      console.error('Error creating/updating question:', error);
    }
  };

  const handleDelete = async () => {
    if (selectedQuestion) {
      try {
        await axiosRequest.delete(`/quizzes/${quizId}/questions/${selectedQuestion.id}`);
        dispatch(deleteQuestion({ quizId, questionId: selectedQuestion.id }));
        toggleModal();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggleModal}>
      <ModalHeader toggle={toggleModal}>
        {selectedQuestion ? `Edit Question ${selectedQuestion.id}` : 'Add Question'}
      </ModalHeader>
      <ModalBody>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="questionText">Question</Label>
            <Input
              type="text"
              id="questionText"
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Label>Options</Label>
            {['A', 'B', 'C', 'D'].map((option) => (
              <FormGroup key={option}>
                <Label>
                  {option}.{' '}
                  <Input
                    type="text"
                    value={options[option]}
                    onChange={(e) => setOptions({ ...options, [option]: e.target.value })}
                    required
                  />
                </Label>
              </FormGroup>
            ))}
          </FormGroup>
          <FormGroup>
            <Label for="correctAnswer">Correct Answer</Label>
            <Input
              type="text"
              id="correctAnswer"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />
          </FormGroup>
          <Button type="submit" color="primary">
            {selectedQuestion ? 'Update' : 'Add'}
          </Button>
          {selectedQuestion && (
            <Button type="button" color="danger" onClick={handleDelete} className="ml-2">
              Delete
            </Button>
          )}
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default FormQuestion;
