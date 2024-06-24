import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { useDispatch } from 'react-redux';
import axiosRequest from '../../../configs/axiosConfig';

import { createQuestion, updateQuestion } from '../../../features/quizSlice';

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
      setOptions({
        A: selectedQuestion.options && selectedQuestion.options.A ? selectedQuestion.options.A : '',
        B: selectedQuestion.options && selectedQuestion.options.B ? selectedQuestion.options.B : '',
        C: selectedQuestion.options && selectedQuestion.options.C ? selectedQuestion.options.C : '',
        D: selectedQuestion.options && selectedQuestion.options.D ? selectedQuestion.options.D : '',
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

    const formData = new FormData();
    formData.append('questionText', questionText);
    formData.append('options', JSON.stringify(options));
    formData.append('correctAnswer', correctAnswer);

    try {
      let response;
      if (selectedQuestion) {
        response = await axiosRequest.put(
          `/quizzes/${quizId}/questions/${selectedQuestion.id}`,
          formData
        );
        dispatch(updateQuestion({ quizId, questionId: selectedQuestion.id, ...formData }));
      } else {
        response = await axiosRequest.post(
          `/quizzes/${quizId}/questions`,
          formData
        );
        dispatch(createQuestion({ quizId, ...formData }));
      }

      console.log('Created/updated question:', response);
      toggleModal(); 

    } catch (error) {
      console.error('Error creating/updating question:', error);
    
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
            <FormGroup check>
              <Label check>
                <Input
                  type="text"
                  value={options.A}
                  onChange={(e) => setOptions({ ...options, A: e.target.value })}
                  required
                />{' '}
                A. {options.A}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="text"
                  value={options.B}
                  onChange={(e) => setOptions({ ...options, B: e.target.value })}
                  required
                />{' '}
                B. {options.B}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="text"
                  value={options.C}
                  onChange={(e) => setOptions({ ...options, C: e.target.value })}
                  required
                />{' '}
                C. {options.C}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input
                  type="text"
                  value={options.D}
                  onChange={(e) => setOptions({ ...options, D: e.target.value })}
                  required
                />{' '}
                D. {options.D}
              </Label>
            </FormGroup>
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
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default FormQuestion;
