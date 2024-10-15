export const hasUserCommented = (comments, userId, productId) => {
  return comments.some(
    (comment) =>
      comment.customerId === userId && comment.productId === productId
  );
};
