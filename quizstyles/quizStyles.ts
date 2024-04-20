import styled from 'styled-components';

type OptionProps = {
  $selected: boolean;
  $isanswered: boolean;
};

type CheckAnswerButtonProps = {
  $isanswered: boolean;
};

export const QuizContainer = styled.div`
  position: relative;
  margin: 200px;
  text-align: center;
  background-color: #f8fbff;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0,0,0,0.7);

  @media (max-width: 600px) {
    margin: 30px;  
    padding: 60px;     
    border-radius: 10px;
  }
`;

export const ResetButton = styled.button`
  padding: 5px 20px;
  margin: 10px;
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

export const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  padding: 15px;
`;

export const Stat = styled.div`
  margin: 0 10px;
  font-size: 20px;
  color: black;
`;

export const CheckAnswerButton = styled.button<CheckAnswerButtonProps>`
  padding: 5px 15px;
  background-color: #4CAF50; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
  opacity: ${(props) => (props.$isanswered ? 0.5 : 1)};
  pointer-events: ${(props) => (props.$isanswered ? 'none' : 'auto')};

  &:hover {
    background-color: #43A047; 
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const Header = styled.h1`
  font-size: 32px;
  color: #217aff; 
  margin-bottom: 30px;
`;

export const QuizCard = styled.div`
  background-color: #ffffff; 
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 0 15px rgba(0,0,0,0.05);
`;

export const Question = styled.h2`
  font-size: 25px;
  color: #217aff; 
  margin-bottom: 20px;
`;

export const Option = styled.button<OptionProps>`
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: whitesmoke;
  border: ${(props) => (props.$selected && !props.$isanswered ? '4px solid #006400' : '2px solid #217aff')};
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
    pointer-events: ${(props) => (props.$isanswered ? 'none' : 'auto')};
  }
`;

export const Toast = styled.div<{ toastType: 'correct' | 'wrong' }>`
  background-color: ${(props) => (props.toastType === 'correct' ? '#4CAF50' : '#F44336')};
  color: white;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
  transition: opacity 0.5s ease-out;
`;

export const NavigationButton = styled.button`
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