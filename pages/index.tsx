import React, { useState, useEffect, Suspense, use} from 'react';
import { Container, Header, StatsContainer, Stat, ResetButton, QuizCard, Question, Option, CheckAnswerButton, NavigationButton, Toast } from '../quizstyles/quizStyles';
import useSWR, { mutate } from 'swr';
import useLocalStorageState from 'use-local-storage-state';
import Confetti from 'react-confetti';
import SkeletonQuizCard from '../quizstyles/quizSkeleton';

const fetcher = (...args: [string, RequestInit?]) => fetch(...args).then(res => res.json());

const updateQuizStatus = async (id: string, answered: boolean) => {
  
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  interface Quiz {
    _id: string;
    question: string;
    options: string[];
    selectedOption: string | null;
    correctOption: number;
    answered: boolean;
  }
  
  const { data: quizData, error } = useSWR<Quiz[]>(`/api/quizzes`, fetcher, { suspense: true });

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState<'correct' | 'wrong' | ''>('');
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

  const checkAllQuizzesAnswered = () => {

  const allAnswered = quizData.every(quiz => quiz.answered);
  setShowConfetti(allAnswered);
  };
 
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  
  if (error) return <div>Failed to load</div>;
  
  if (!isClient) {
    return <Container>Loading...</Container>;
  }

  

  const handleOptionSelect = (option: string) => {
    if (!quizData[currentQuestion].answered) {
      setSelectedOption(option);
      setIsOptionSelected(true);
    }
  };

  const handleCheckAnswer = async () => {
  // Index der ausgewählten Option ermitteln
    const selectedOptionIndex = quizData[currentQuestion].options.indexOf(selectedOption);
  
    try {
      // Senden der ausgewählten Antwort an das Backend zur Überprüfung
      const response = await fetch(`/api/quizzes/verify-answer/verify-answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quizData[currentQuestion]._id,
          selectedOptionIndex: selectedOptionIndex,
        }),
      });
  
      const result = await response.json();
  
      // Überprüfen, ob die Antwort korrekt war basierend auf der Backend-Antwort
      if (result.isCorrect) {
        setShowToast(true);
        setToastType('correct');
        setCorrectCount((correctCount) => correctCount + 1);
      } else {
        setShowToast(true);
        setToastType('wrong');
        setWrongCount((wrongCount) => wrongCount + 1);
      }
  
      setTotalCount((totalCount) => totalCount + 1);
  
      // Markieren des aktuellen Quiz als beantwortet
      const updatedQuizData = [...quizData];
      updatedQuizData[currentQuestion].answered = true;
  
      // Aktualisieren des Quiz-Status in der lokalen Zustandsverwaltung und im Backend
      mutate(`/api/quizzes`, updatedQuizData, false);
      await updateQuizStatus(quizData[currentQuestion]._id, true);
  
      checkAllQuizzesAnswered();
    } catch (error) {
      console.error("Failed to verify answer or update quiz status", error);
      // Bei einem Fehler, stellen Sie sicher, dass das aktuelle Quiz nicht fälschlicherweise als beantwortet markiert wird
      const updatedQuizData = [...quizData];
      updatedQuizData[currentQuestion].answered = false;
      mutate(`/api/quizzes`, updatedQuizData, false);
    }
  
    setIsOptionSelected(false);
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
      setShowConfetti(false);
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


      {showToast && (toastType === 'correct' || toastType === 'wrong') && (
  <Toast toastType={toastType}>{toastType === 'correct' ? 'Correct!' : 'Wrong!'}</Toast>
)}


<Suspense fallback={<SkeletonQuizCard />}>
          <QuizCard>
          {quizData && quizData.length > 0 && (
            <>
              <Question>{quizData[currentQuestion]?.question}</Question>
              {quizData[currentQuestion] && quizData[currentQuestion].options ? (
                quizData[currentQuestion].options.map((option, index) => (
                  <Option
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={quizData[currentQuestion].answered}
                    $isanswered={quizData[currentQuestion].answered}
                    $selected={selectedOption === option}
                  >
                    {option}
                  </Option>
                ))
              ) : null}
              {selectedOption && (
                <CheckAnswerButton onClick={handleCheckAnswer} $isanswered={quizData[currentQuestion]?.answered}>
                  Check Answer
                </CheckAnswerButton>
              )}
            </>
          )}
        </QuizCard>
      </Suspense>
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