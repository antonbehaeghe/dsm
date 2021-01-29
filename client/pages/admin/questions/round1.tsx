import { useState } from "react";
import firebase from "../../../firebase";
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

function round1() {
  const [snapshot, loading, error] = useCollection(
    firebase.firestore().collection("round1")
  );

  if (loading) return <p>Loading...</p>;

  if (snapshot) {
    const questions = snapshot.docs.map((doc) => {
      return {
        ref: doc.ref,
        content: doc.data().questions,
      };
    });

    return (
      <div>
        {questions.map((q) => (
          <Round1QuestionCard card={q} />
        ))}
      </div>
    );
  }
}

function Round1QuestionCard({ card }) {
  function handleEdit(i, content) {
    const newCard = { ...card };
    newCard.content[i] = content;

    firebase
      .firestore()
      .collection("round1")
      .doc(card.ref.id)
      .set({ questions: newCard.content });
  }

  return (
    <>
      {card.content.map((q, i) => (
        <Round1Question
          question={q}
          index={i}
          handleQEdit={handleEdit}
        ></Round1Question>
      ))}
    </>
  );
}

function Round1Question({ question, index, handleQEdit }) {
  const [editMode, setEditMode] = useState(false);

  const [content, setContent] = useState({
    question: question.question,
    answer: question.answer,
  });

  function handleEditMode() {
    setEditMode(true);
  }

  function handleEdit() {
    handleQEdit(index, content);
    setEditMode(false);
  }

  function handleInputChange(e) {
    setContent({ ...content, [e.currentTarget.name]: e.currentTarget.value });
  }

  if (editMode) {
    return (
      <Question>
        <label className="">Question</label>
        <input
          type="text"
          value={content.question}
          onChange={handleInputChange}
          name="question"
        />
        <label htmlFor="">Answer</label>
        <input
          type="text"
          value={content.answer}
          onChange={handleInputChange}
          name="answer"
        />
        <SaveButton onClick={handleEdit}>save</SaveButton>
      </Question>
    );
  }

  return (
    <Question>
      <h1>{question.question}</h1>
      <p>{question.answer}</p>
      <EditButton onClick={handleEditMode}>edit</EditButton>
    </Question>
  );
}

export default round1;
