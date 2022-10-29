import { useRef } from "react";

import CommentCard from "./CommentCard";

function CommentList({ comments }) {
    let commentCard = [];


    if (comments) {
        commentCard = Object.entries(comments).map(([key, comment]) => {
            return (
                <CommentCard
                    key={key}
                    comment={comment}
                />
            );
        });
    }

    if (commentCard.length > 0) {
        return <div className="list">{commentCard}</div>;
    } else {
        return <p className="notification">There are no comments in this document at the moment</p>;
    }
}

export default CommentList;
