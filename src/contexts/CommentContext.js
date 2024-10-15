import React, { createContext, useContext, useState } from "react";
import { hasUserCommented } from "../utils/commentUtils";

const CommentContext = createContext();

export const useComments = () => useContext(CommentContext);

export const CommentProvider = ({ children }) => {
  const [comments, setComments] = useState([]);

  const addComment = (comment) => {
    setComments((prevComments) => [...prevComments, comment]);
  };

  const setAllComments = (newComments) => {
    setComments(newComments);
  };

  return (
    <CommentContext.Provider
      value={{
        comments,
        addComment,
        setAllComments,
        hasUserCommented: (userId, productId) =>
          hasUserCommented(comments, userId, productId),
      }}
    >
      {children}
    </CommentContext.Provider>
  );
};
