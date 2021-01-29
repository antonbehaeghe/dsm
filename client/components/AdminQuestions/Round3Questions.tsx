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
    ${tw`mb-1 font-bold`}
  }

  p {
    ${tw`text-sm`}
  }

  input {
    &:read-only {
      ${tw`opacity-50 cursor-not-allowed`}
    }
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

function Round3Questions() {
  const [snapshot, loading, error] = useCollection(
    firebase.firestore().collection("round3")
  );

  if (loading) return <p>Loading...</p>;

  if (snapshot) {
    const questions = snapshot.docs.map((doc) => {
      return {
        ref: doc.ref,
        content: doc.data().puzzle,
      };
    });

    return (
      <div>
        {questions.map((q) => (
          <Round3QuestionCard card={q} />
        ))}
      </div>
    );
  }
}

function Round3QuestionCard({ card }) {
  function handleEdit(i, content) {
    const newCard = { ...card };
    newCard.content[i] = content;

    firebase
      .firestore()
      .collection("round3")
      .doc(card.ref.id)
      .set({ puzzle: newCard.content });
  }

  return (
    <>
      {Object.keys(card.content).map((key) => (
        <Round3Question
          question={card.content[key]}
          index={key}
          handleQEdit={handleEdit}
        ></Round3Question>
      ))}
    </>
  );
}

function Round3Question({ question, index, handleQEdit }) {
  const [editMode, setEditMode] = useState(false);

  const [content, setContent] = useState({
    pieces: question.pieces,
    answers: question.answers,
  });

  function handleEditMode() {
    setEditMode(true);
  }

  function handleEdit() {
    handleQEdit(index, content);
    setEditMode(false);
  }

  function handleAnswerChange(e, i) {
    const newAnswers = [...content.answers];
    newAnswers[i].text = e.currentTarget.value;
    setContent({ ...content, answers: newAnswers });
  }

  function handlePieceChange(e, i, pi) {
    const newAnswers = [...content.answers];
    newAnswers[i].pieces[pi].text = e.currentTarget.value;
    setContent({ ...content, answers: newAnswers });
  }

  return (
    <Question className="grid grid-cols-12 col-gap-4">
      {content.answers.map((puzzle, i) => (
        <div className="col-span-4 mb-4">
          <label className="">Answer</label>
          <input
            type="text"
            value={puzzle.text}
            onChange={(e) => handleAnswerChange(e, i)}
            readOnly={!editMode}
          />
          <label className="">Pieces</label>
          {puzzle.pieces.map((piece, pi) => (
            <input
              type="text"
              value={piece.text}
              onChange={(e) => handlePieceChange(e, i, pi)}
              readOnly={!editMode}
            />
          ))}
        </div>
      ))}
      {editMode ? (
        <SaveButton onClick={handleEdit}>save</SaveButton>
      ) : (
        <EditButton onClick={handleEditMode}>edit</EditButton>
      )}
    </Question>
  );
}

export default Round3Questions;
