import { useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';

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

// Funktion zum Datenholen
const fetcher = (...args) => fetch(...args).then(res => res.json());

const updateQuizStatus = async (id, answered) => {
  
  const response = await fetch(`/api/quizzes/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ answered }),
  });

  if (!response.ok) {
    throw new Error('Failed to update quiz status');
  }

  return response.json();
};

const HomePage = () => {

  const { data: quizData, error } = useSWR(`/api/quizzes`, fetcher);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');

  if (error) return <div>Failed to load</div>;
  if (!quizData) return <div>Loading...</div>;

  const handleOptionSelect = (option) => {
    if (!quizData[currentQuestion].answered) {
      setSelectedOption(option);
    }
  };

  const handleCheckAnswer = async () => {
    const correctAnswerIndex = quizData[currentQuestion].correctOption;
    const correctAnswer = quizData[currentQuestion].options[correctAnswerIndex];
  
    if (selectedOption === correctAnswer) {
      setShowToast(true);
      setToastType('correct');
    } else {
      setShowToast(true);
      setToastType('wrong');
    }
    try {
      await updateQuizStatus(quizData[currentQuestion]._id, true);
      const updatedQuizData = [...quizData];
      updatedQuizData[currentQuestion].answered = true; 
    
      mutate(`/api/quizzes`, updatedQuizData, false); 
    } catch (error) {
      console.error("Failed to update quiz status", error);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setShowToast(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowToast(false);
    }
  };

  return (
    <Container>
      <Header>My Quiz App</Header>

      {showToast && <Toast type={toastType}>{toastType === 'correct' ? 'Correct!' : 'Wrong!'}</Toast>}

      <QuizCard>
        <Question>{quizData[currentQuestion]?.question}</Question>

        {quizData[currentQuestion]?.options.map((option, index) => (
          <Option
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={quizData[currentQuestion].answered}
            style={{ backgroundColor: selectedOption === option ? 'blue' : '#eee' }}
          >
            {option}
          </Option>
        ))}

        <button onClick={handleCheckAnswer} disabled={!selectedOption || quizData[currentQuestion].answered}>
          Check Answer
        </button>
      </QuizCard>

      <div>
        <PreviousButton onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
          Previous
        </PreviousButton>
        <NextButton onClick={handleNextQuestion} disabled={currentQuestion >= quizData.length - 1}>
          Next
        </NextButton>
      </div>
    </Container>
  );
};

export default HomePage;
