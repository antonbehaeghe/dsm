import { useState } from "react";
import styled from "styled-components";
import tw from "tailwind.macro";
import Round1Questions from "./AdminQuestions/Round1Questions";
import Round2Questions from "./AdminQuestions/Round2Questions";
import Round3Questions from "./AdminQuestions/Round3Questions";
import Round4Questions from "./AdminQuestions/Round4Questions";
import Round5Questions from "./AdminQuestions/Round5Questions";

const QuestionGrid = styled.div``;

const QuestionNav = styled.div``;

const QuestionContent = styled.div`
  ${tw`bg-white shadow p-4 rounded`}
`;

const NavButton = styled.button`
  ${tw`block text-blue-500 mb-4 active:outline-none focus:outline-none`}
  ${(props) => props.isActive && tw`font-bold`}
`;

function AdminQuestions() {
  const [active, setActive] = useState("Round 1");

  const rounds = ["Round 1", "Round 2", "Round 3", "Round 4", "Round 5"];

  const questionRounds = {
    "Round 1": <Round1Questions />,
    "Round 2": <Round2Questions />,
    "Round 3": <Round3Questions />,
    "Round 4": <Round4Questions />,
    "Round 5": <Round5Questions />,
  };

  return (
    <QuestionGrid className="grid grid-cols-12">
      <QuestionNav className="col-span-2">
        {rounds.map((round) => (
          <NavButton
            key={round}
            isActive={active === round}
            onClick={() => setActive(round)}
          >
            {round}
          </NavButton>
        ))}
      </QuestionNav>
      <QuestionContent className="col-span-10">
        {questionRounds[active]}
      </QuestionContent>
    </QuestionGrid>
  );
}

export default AdminQuestions;
