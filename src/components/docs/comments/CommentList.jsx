import CommentCard from "./CommentCard";

function CommentList({ docs }) {

    const commentCard = Object.entries(docs.comments).map(([key, comment]) => {
        return (
            <CommentCard
                key={key}
                comment={comment}
            />
        );
    });

    if (commentCard.length > 0) {
        return <div className="list">{commentCard}</div>;
    } else {
        return <p className="notification">There are no comments in this document at the moment</p>;
    }
}

export default CommentList;
