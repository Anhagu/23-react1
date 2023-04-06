import React from "react";
import Comment from "./Comment";

const comments = [
  {
    name: "이재형",
    comment: "안녕하세요. 이재형입니다.",
  },
  {
    name: "이재형",
    comment: "안녕하세요. 이재형입니다.",
  },
  {
    name: "이재형",
    comment: "안녕하세요. 이재형입니다.",
  },
];


function CommentList(props) {
  return(
    <div>
      {comments.map((comment) => {
        return (
          <Comment name={comment.name} comment={comment.comment}/>
        );
      })}
    </div>
  );
}

export default CommentList;