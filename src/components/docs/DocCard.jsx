function DocCard({ doc, key }) {
    return (
        <div className="card">
            <p className="fat">{doc.title}</p>
            <p className="slim">{doc.description}</p>
        </div>
    );
}

export default DocCard;
