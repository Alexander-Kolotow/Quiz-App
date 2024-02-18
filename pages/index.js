import { useState } from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { mutate } from 'swr';


const Container = styled.div`
  text-align: center;
  max-width: 800px;
  margin: auto;
  background-color: #f8fbff; /* Ein etwas dunklerer Pastellton für den Container-Hintergrund */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1); /* Leichter Schatten für Tiefe */
`;

const ResetButton = styled.button`
  padding: 10px 20px;
  background-color: #996515; /* Dunkles Gelb für den Hintergrund */
  color: white; /* Weißer Text für Kontrast */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #cc9900; /* Helleres Gelb beim Hover für eine visuelle Rückmeldung */
    transform: scale(1.05); /* Leichtes Vergrößern beim Darüberfahren */
  }

  &:active {
    transform: scale(0.95); /* Kleiner Effekt beim Klicken */
  }
`;

// CheckAnswerButton - Hervorgehoben für die Wichtigkeit der Aktion
const CheckAnswerButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50; /* Grüne Farbe für "Go" oder "Check" Aktion */
  color: white; /* Weißer Text für Kontrast */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    background-color: #43A047; /* Ein dunkleres Grün für den Hover-Effekt */
    transform: scale(1.05); /* Leichtes Vergrößern beim Darüberfahren */
  }

  &:active {
    transform: scale(0.95); /* Kleiner Effekt beim Klicken */
  }
`;
const Header = styled.h1`
  font-size: 32px;
  color: #217aff; /* Kräftigeres Blau für den Titel */
  margin-bottom: 30px;
`;

const QuizCard = styled.div`
  background-color: #ffffff; /* Weißer Hintergrund für die Quizkarten */
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05); /* Feiner Schatten für eine subtile Tiefe */
`;

const Question = styled.h2`
  font-size: 20px;
  color: #217aff; /* Wieder das kräftigere Blau */
  margin-bottom: 20px;
`;

const Option = styled.button`
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: whitesmoke; 
  border: 2px solid #217aff; 
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;

  &:hover {
    border: 2px solid #ff4a11;
    transform: translateY(-5px); 
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
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
    background-color: #cccccc; /* Grau wenn deaktiviert */
    opacity: 0.5;
    cursor: default;
  }
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

const handleResetQuiz = async () => {
  const confirmReset = window.confirm('Are you sure you want to reset all Quiz Cards? Accordingly, your statistics will be reset to 0, and you will start the quiz from the beginning.');
  if (confirmReset) {
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

      <Header>My Quiz App</Header>

      {showToast && <Toast type={toastType}>{toastType === 'correct' ? 'Correct!' : 'Wrong!'}</Toast>}

      <QuizCard>
        <Question>{quizData[currentQuestion]?.question}</Question>

        {quizData[currentQuestion]?.options.map((option, index) => (
          <Option
            key={index}
            onClick={() => handleOptionSelect(option)}
            disabled={quizData[currentQuestion].answered}
            title={quizData[currentQuestion].answered ? "Already answered" : ""}
          >
            {option}
          </Option>
        ))}

        <CheckAnswerButton onClick={handleCheckAnswer} disabled={!selectedOption || quizData[currentQuestion].answered} title={quizData[currentQuestion].answered ? "Already answered" : ""}>
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
