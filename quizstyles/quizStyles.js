import styled from 'styled-components';

export const Container = styled.div`
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

export const ResetButton = styled.button`
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

export const CheckAnswerButton = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50; 
  color: white; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, transform 0.2s;
  opacity: ${(props) => (props.isanswered ? 0.5 : 1)};
  pointer-events: ${(props) => (props.isanswered ? 'none' : 'auto')};

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

export const Option = styled.button`
  display: inline-block;
  margin: 10px;
  padding: 10px 20px;
  background-color: whitesmoke;
  border: ${(props) => (props.selected && !props.isanswered ? '4px solid #006400' : '2px solid #217aff')};
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
    pointer-events: ${(props) => (props.isanswered ? 'none' : 'auto')};
  }
`;

export const Toast = styled.div`
  background-color: ${(props) => (props.type === 'correct' ? '#4CAF50' : '#F44336')};
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