const BookCard = ({ book, onAddToCart, sellerMode, onEdit, onDelete }) => {
  return (
    <article className="card book-card">
      {book.imageUrl && (
        <img
          className="book-image"
          src={`${import.meta.env.VITE_API_ROOT || "http://localhost:5000"}${book.imageUrl}`}
          alt={book.bookName}
        />
      )}

      <div className="book-content">
        <h3>{book.bookName}</h3>
        <p className="muted">{book.publication}</p>
        <p>Condition: {book.condition}</p>
        <p className="price">Rs. {book.price}</p>
        <p className="muted">Seller: {book.seller?.name || "N/A"}</p>

        {!sellerMode ? (
          <button className="btn" onClick={() => onAddToCart?.(book._id)}>
            Add to Cart
          </button>
        ) : (
          <div className="actions-row">
            <button className="btn ghost" onClick={() => onEdit?.(book)}>
              Edit
            </button>
            <button className="btn danger" onClick={() => onDelete?.(book._id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default BookCard;
