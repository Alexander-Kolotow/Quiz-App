import React, { useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { mutate } from 'swr';
import useLocalStorageState from 'use-local-storage-state';

const Container = styled.div`
  position: relative;
  margin-top: 50px;
  text-align: center;
  max-width: 800px;
  margin: auto;
  background-color: #f8fbff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.4);
`;

const ResetButton = styled.button`
  padding: 5px 20px;
  background-color: red;
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  position: absolute;
  top: 0;
  left: 0;
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px;
`;

const Stat = styled.div`
  margin: 0 10px;
  font-size: 20px;
  color: black;
`;

const CheckAnswerButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
  opacity: ${(props) => (props.answered ? 0.5 : 1)};
  pointer-events: ${(props) => (props.answered ? 'none' : 'auto')};

  &:hover {
    background-color: #43A047; 
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;
const Header = styled.h1`
  font-size: 32px;
  color: #217aff; 
  margin-bottom: 30px;
`;

const QuizCard = styled.div`
  background-color: #ffffff; 
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
`;

const Question = styled.h2`
  font-size: 25px;
  color: #217aff; 
  margin-bottom: 20px;
`;

const Option = styled.button`
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: whitesmoke;
  border: ${(props) => (props.selected && !props.answered ? '4px solid #006400' : '2px solid #217aff')};
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
  

  &:hover {
    border: 4px solid #006400;
    transform: translateY(-5px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
    pointer-events: ${(props) => (props.answered ? 'none' : 'auto')};
  }
`;

const Toast = styled.div`
  background-color: ${(props) => (props.type === 'correct' ? '#4CAF50' : '#F44336')};
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: opacity 0.5s ease-out;
`;

const NavigationButton = styled.button`
  margin: 0 10px;
  padding: 10px 20px;
  background-color: #FFD700;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;

  &:hover {
    background-color: #CC9900;
  }

  &:disabled {
    background-color: #cccccc;
    opacity: 0.5;
    cursor: default;
  }
`;


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

const resetQuizStatus = async () => {
  const response = await fetch(`/api/quizzes/`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to reset quiz status');
  }

  return response.json();
};

const HomePage = () => {

  const { data: quizData, error } = useSWR(`/api/quizzes`, fetcher);
 

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('');

  const [correctCount, setCorrectCount] = useLocalStorageState('correctCount', 0);
  console.log(correctCount);
  const [wrongCount, setWrongCount] = useLocalStorageState('wrongCount', 0);  
  const [totalCount, setTotalCount] = useLocalStorageState('totalCount', 0);

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
  
    let isCorrect = false;
    if (selectedOption === correctAnswer) {
      setShowToast(true);
      setToastType('correct');
      setCorrectCount((correctCount) => correctCount + 1);
      isCorrect = true;
    } else {
      setShowToast(true);
      setToastType('wrong');
      setWrongCount((wrongCount) => wrongCount + 1);
    }
    setTotalCount((totalCount) => totalCount + 1);
  
    // Setzen des answered Zustands für die aktuelle Frage auf true, bevor die Netzwerkanfrage gesendet wird
    const updatedQuizData = [...quizData];
    updatedQuizData[currentQuestion].answered = true;
    // Aktualisieren des lokalen Zustands sofort, um die UI zu reflektieren
    mutate(`/api/quizzes`, updatedQuizData, false); 
  
    try {
      // Netzwerkanfrage, um den answered Zustand im Backend zu aktualisieren
      await updateQuizStatus(quizData[currentQuestion]._id, true);
      // Kein erneuter Aufruf von mutate() notwendig, da der Zustand bereits aktualisiert wurde
    } catch (error) {
      console.error("Failed to update quiz status", error);
      // Optional: Rückgängig machen der Zustandsänderung im Fehlerfall
      updatedQuizData[currentQuestion].answered = false;
      mutate(`/api/quizzes`, updatedQuizData, false);
    }
  
    return isCorrect;
  };
  

const handleResetQuiz = async () => {
  const confirmReset = window.confirm('Are you sure you want to reset all Quiz Cards? Accordingly, your statistics will be reset to 0, and you will start the quiz from the beginning.');
  if (confirmReset) {

    setCorrectCount(0);
    setWrongCount(0);
    setTotalCount(0);

    try {
      await resetQuizStatus();
      const updatedQuizData = quizData.map(quiz => ({ ...quiz, answered: false }));
      mutate(`/api/quizzes`, updatedQuizData, false);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowToast(false);
    } catch (error) {
      console.error("Failed to reset quiz status", error);
    }
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
      <ResetButton onClick={handleResetQuiz}>&#10227;</ResetButton>

      <Header>My Quiz App
      <StatsContainer>
        <Stat>✅: {correctCount}</Stat>
        <Stat>❌: {wrongCount}</Stat>
        <Stat>Total: {totalCount}</Stat>
      </StatsContainer>
      </Header>


      {showToast && <Toast type={toastType}>{toastType === 'correct' ? 'Correct!' : 'Wrong!'}</Toast>}

      <QuizCard>
        <Question>{quizData[currentQuestion]?.question}</Question>

        {quizData[currentQuestion]?.options.map((option, index) => (
          <Option
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={quizData[currentQuestion].answered}
            answered={quizData[currentQuestion].answered}
            selected={selectedOption === option} 
          >
            {option}
          </Option>
        ))}

        <CheckAnswerButton onClick={handleCheckAnswer} answered={quizData[currentQuestion].answered}>
          Check Answer
        </CheckAnswerButton>
      </QuizCard>

      <div>
        <NavigationButton onClick={handlePreviousQuestion} disabled={currentQuestion === 0}>
         &larr;
        </NavigationButton>
        <NavigationButton onClick={handleNextQuestion} disabled={currentQuestion >= quizData.length - 1}>
         &rarr;
        </NavigationButton>
      </div>
    </Container>
  );
};

export default HomePage;
