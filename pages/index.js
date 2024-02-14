import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  text-align: center;
`;

const Header = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

const QuizCard = styled.div`
  border: 1px solid #ccc;
  padding: 20px;
  margin-bottom: 20px;
`;

const Question = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Option = styled.button`
  margin: 5px;
  padding: 10px;
  background-color: #eee;
  border: none;
  cursor: pointer;
`;

const Toast = styled.div`
  background-color: ${(props) => (props.type === 'correct' ? 'green' : 'red')};
  color: white;
  padding: 10px;
  margin-bottom: 10px;
`;

const PreviousButton = styled.button`
  margin-right: 10px;
`;

const NextButton = styled.button`
  margin-left: 10px;
`;

const HomePage = () => {
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');

  useEffect(() => {
    // Fetch quiz data from MongoDB and update quizData state
    // Replace the fetchQuizData function with your own implementation
    const fetchQuizData = async () => {
      try {
        const response = await fetch('/api/quiz');
        const data = await response.json();
        setQuizData(data);
      } catch (error) {
        console.error('Failed to fetch quiz data:', error);
      }
    };

    fetchQuizData();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleCheckAnswer = () => {
    const correctAnswer = quizData[currentQuestion].correctAnswer;

    if (selectedOption === correctAnswer) {
      setShowToast(true);
      setToastType('correct');
    } else {
      setShowToast(true);
      setToastType('wrong');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption('');
      setShowToast(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption('');
      setShowToast(false);
    }
  };

  return (
    <Container>
      <Header>My Quiz App</Header>

      {showToast && <Toast type={toastType}>{toastType === 'correct' ? 'Correct!' : 'Wrong!'}</Toast>}

      <QuizCard>
        <Question>{quizData[currentQuestion]?.question}</Question>

        {quizData[currentQuestion]?.options.map((option) => (
          <Option
            key={option}
            onClick={() => handleOptionSelect(option)}
            disabled={selectedOption !== ''}
            style={{ backgroundColor: selectedOption === option ? 'blue' : 'inherit' }}
          >
            {option}
          </Option>
        ))}

        <button onClick={handleCheckAnswer} disabled={selectedOption === ''}>
          Check Answer
        </button>
      </QuizCard>

      <div>
        <PreviousButton onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
          Previous
        </PreviousButton>
        <NextButton onClick={handleNextQuestion} disabled={currentQuestion === quizData.length - 1}>
          Next
        </NextButton>
      </div>
    </Container>
  );
};

export default HomePage;
