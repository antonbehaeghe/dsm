import { useState } from "react";
import firebase from "../../firebase";
import { useCollection } from "react-firebase-hooks/firestore";
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

  input {
    ${tw`appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none`}
  }

  label {
    ${tw`block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2`}
  }
`;

const EditButton = styled.button`
  ${tw`border border-blue-500 text-blue-500 px-4 py-1 mt-2 rounded`}
`;

const SaveButton = styled.button`
  ${tw`bg-blue-500 text-white px-4 py-1 mt-2 rounded`}
`;

function Round2Questions() {
  const [snapshot, loading, error] = useCollection(
    firebase.firestore().collection("round2")
  );

  if (loading) return <p>Loading...</p>;

  if (snapshot) {
    const questions = snapshot.docs.map((doc) => {
      return {
        ref: doc.ref,
        content: doc.data(),
      };
    });

    return (
      <div>
        {questions.map((q) => (
          <Round2Question question={q} />
        ))}
      </div>
    );
  }
}

function Round2Question({ question }) {
  const [editMode, setEditMode] = useState(false);

  function submitEdit(content) {
    firebase
      .firestore()
      .collection("round2")
      .doc(question.ref.id)
      .set({ ...content });
  }

  const [content, setContent] = useState({
    question: question.content.question,
    answers: question.content.answers,
  });

  function handleEditMode() {
    setEditMode(true);
  }

  function handleEdit() {
    submitEdit(content);
    setEditMode(false);
  }

  function handleQuestionChange(e) {
    setContent({ ...content, question: e.currentTarget.value });
  }

  function handleAnswerChange(e, i) {
    const newAnswers = [...content.answers];
    newAnswers[i] = e.currentTarget.value;
    setContent({ ...content, answers: newAnswers });
  }

  if (editMode) {
    return (
      <Question>
        <label className="">Question</label>
        <input
          type="text"
          value={content.question}
          onChange={handleQuestionChange}
          name="question"
        />
        <label htmlFor="">Answers</label>
        {content.answers.map((a, i) => (
          <input
            type="text"
            value={content.answers[i]}
            onChange={(e) => handleAnswerChange(e, i)}
            name={`answer-${i}`}
          />
        ))}
        <SaveButton onClick={handleEdit}>save</SaveButton>
      </Question>
    );
  }

  return (
    <Question>
      <h1>{content.question}</h1>
      {content.answers.map((a) => (
        <p>{a}</p>
      ))}
      <EditButton onClick={handleEditMode}>edit</EditButton>
    </Question>
  );
}

export default Round2Questions;
