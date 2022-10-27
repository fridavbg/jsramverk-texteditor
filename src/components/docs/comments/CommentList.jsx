import { useEffect } from "react";

import CommentCard from "./CommentCard";

import docModel from "../../../models/documents";

function CommentList({ doc }) {
    let commentCard = [];

    // console.log(doc);
    // console.log(typeof doc);

    if (doc) {
        commentCard = Object.entries(doc.comments).map(([key, comment]) => {
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
