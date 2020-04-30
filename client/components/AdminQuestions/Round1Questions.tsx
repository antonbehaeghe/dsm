import firebase from "../../firebase";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import tw from "tailwind.macro";

const Question = styled.div`
  ${tw`pb-4 px-2`}

  &:not(:last-of-type) {
    ${tw`mb-4 border-b border-gray-300`}
  }

  h1 {
    ${tw`mb-1`}
  }

  p {
    ${tw`font-bold text-sm`}
  }
`;

function Round1Questions() {
  const [snapshot, loading, error] = useCollection(
    firebase.firestore().collection("round1")
  );

  if (loading) return <p>Loading...</p>;

  if (snapshot) {
    const questions = snapshot.docs.map((doc) => doc.data().questions).flat();
    return (
      <div>
        {questions.map((q) => (
          <Question>
            <h1>{q.question}</h1>
            <p>{q.answer}</p>
          </Question>
        ))}
      </div>
    );
  }
}

export default Round1Questions;
