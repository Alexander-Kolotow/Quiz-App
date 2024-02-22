import React, { useState, useEffect } from 'react';
import { Container, Header, StatsContainer, Stat, ResetButton, QuizCard, Question, Option, CheckAnswerButton, NavigationButton, Toast } from '../quizstyles/quizStyles';
import useSWR, { mutate } from 'swr';
import useLocalStorageState from 'use-local-storage-state';
import Confetti from 'react-confetti';


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
  const [isOptionSelected, setIsOptionSelected] = useState(false);

  const [correctCount, setCorrectCount] = useLocalStorageState('correctCount', {
    defaultValue: 0
  });
  const [wrongCount, setWrongCount] = useLocalStorageState('wrongCount', {
    defaultValue: 0
  });  
  const [totalCount, setTotalCount] = useLocalStorageState('totalCount', {
    defaultValue: 0
  });

  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (totalCount === 20) {
      setShowConfetti(true);
  
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);
  
      return () => clearTimeout(timer);
    }
  }, [totalCount]); 
  
  if (error) return <div>Failed to load</div>;
  if (!quizData) return <div>Loading...</div>; 

  

  const handleOptionSelect = (option) => {
    if (!quizData[currentQuestion].answered) {
      setSelectedOption(option);
      setIsOptionSelected(true);
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
  
    const updatedQuizData = [...quizData];
    updatedQuizData[currentQuestion].answered = true;
    
    mutate(`/api/quizzes`, updatedQuizData, false); 
  
    try {
      
      await updateQuizStatus(quizData[currentQuestion]._id, true);
      
    } catch (error) {
      console.error("Failed to update quiz status", error);
      
      updatedQuizData[currentQuestion].answered = false;
      mutate(`/api/quizzes`, updatedQuizData, false);
    }
    
    setIsOptionSelected(false);

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
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <ResetButton onClick={handleResetQuiz}>&#10227;</ResetButton>

      <Header>My Quiz App
      <StatsContainer>
        <Stat>✅: {correctCount}</Stat>
        <Stat>❌: {wrongCount}</Stat>
        <Stat>&sum;: {totalCount}</Stat>
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
            isanswered={quizData[currentQuestion].answered}
            selected={selectedOption === option} 
          >
            {option}
          </Option>
        ))}
        
        {selectedOption && (
        <CheckAnswerButton onClick={handleCheckAnswer} isanswered={quizData[currentQuestion].answered}>
          Check Answer
        </CheckAnswerButton>
        )} 
      </QuizCard>

      <div>
        <NavigationButton onClick={handlePreviousQuestion} disabled={currentQuestion === 0 || isOptionSelected}>
         &larr;
        </NavigationButton>
        <NavigationButton onClick={handleNextQuestion} disabled={currentQuestion >= quizData.length - 1 || isOptionSelected}>
         &rarr;
        </NavigationButton>
      </div>
    </Container>
  );
};

export default HomePage;