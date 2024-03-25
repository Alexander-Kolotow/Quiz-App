import React from 'react';
import styled, { keyframes } from 'styled-components';
import { QuizCard, Question, Option } from './quizStyles';

const loadingAnimation = keyframes`
  0% {
    background-color: #f0f0f0;
  }
  50% {
    background-color: #e0e0e0;
  }
  100% {
    background-color: #f0f0f0;
  }
`;

const SkeletonWrapper = styled(QuizCard)`
  animation: ${loadingAnimation} 1.5s infinite;
  * {
    visibility: hidden;
  }
`;

const SkeletonBar = styled.div`
  height: 20px;
  width: ${(props) => props.width || '100%'};
  background-color: #e0e0e0;
  margin: 10px 0;
  border-radius: 4px;
`;

const SkeletonQuizCard = () => (
  <SkeletonWrapper>
    <Question></Question>
    <SkeletonBar width="70%" />
    <Option></Option><SkeletonBar width="80%" />
    <Option></Option><SkeletonBar width="60%" />
    <Option></Option><SkeletonBar width="90%" />
  </SkeletonWrapper>
);

export default SkeletonQuizCard;
