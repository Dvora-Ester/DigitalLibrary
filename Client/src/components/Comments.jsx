import { useState, useEffect, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import '../styleSheets/Comments.css';

const Comments = ({ bookId }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const titleRef = useRef(null);
  const [editingComment, setEditingComment] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('CurrentUser'));
  const token = currentUser?.token;


  useEffect(() => {
    console.log(bookId)
    fetch(`http://localhost:3000/api/comments/getAllByBookId/${bookId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`, 
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            alert("expired or invalid token, you are redictering to the login page")
            navigate('/login');
            return;

          }
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {

        setComments(data);
        console.log('data from server:', data);
      })
      .catch((err) => {
        console.error('Error fetching comments:', err);
      });
  }, [bookId]);

  const handleAddComment = () => {
    const commentData = {
      title: titleRef.current?.value || '',  
      content: newComment,  
    };

    fetch(`http://localhost:3000/api/comments/addComment/${bookId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(commentData),
    })

      .then(response => {
        if (!response.ok) throw new Error('Failed to add comment');
        return response.json();
      })
      .then(data => {
        console.log('Comment added:', data);
        setComments(prev=>[...prev,{Id:data.commentId,User_Id:currentUser.Id,Book_Id:bookId,content: commentData.content,title:commentData.title,Created_At:`${Date.now()}`}])
        if (titleRef.current) {
  titleRef.current.value = '';
}
        setNewComment('');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };



  const handleDeleteComment = (commentId) => {
    const commentToDelete = comments.find((comment) => comment.id === commentId);
    if (commentToDelete?.email === currentUser?.email) {
      fetch(`http://localhost:3000/comments/${commentId}`, { method: 'DELETE' })
        .then(() => setComments(comments.filter((comment) => comment.id !== commentId)))
        .catch(console.error);
    }
  };

  const handleEditComment = (commentId) => {
    const commentToEdit = comments.find((comment) => comment.id === commentId);
    if (commentToEdit?.email === currentUser?.email) {
      setEditingComment(commentToEdit);
      setNewComment(commentToEdit.body);
    }
  };

  const handleSaveEdit = () => {
    const updatedComment = { ...editingComment, body: newComment };
    fetch(`http://localhost:3000/comments/${editingComment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedComment),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 401) {
          alert("expired or invalid token, you are redictering to the login page")
          return <Navigate to="/login" />;

        }
        setComments(comments.map((comment) => (comment.id === data.id ? data : comment)));
        setEditingComment(null);
        setNewComment('');
      })
      .catch(console.error);
  };

  return (
    <div className="comments-page-container">
      <div className="comments-container">
        

        <h1 className="comments-title">Readers comments for book number: {bookId}</h1>

        <div className="comments-list">

          {comments.map((comment) => (
            <div key={comment.Id} className="comment-card">
              <p>{comment.Id}</p>
              <p><strong>{comment.title}</strong> ({comment.title})</p>
              <p>{comment.content}</p>

              {comment.email === currentUser?.email && (
                <div>
                  <button className="edit-comment-button" onClick={() => handleEditComment(comment.Id)}>
                    Edit
                  </button>
                  <button className="delete-comment-button" onClick={() => handleDeleteComment(comment.Id)}>
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}

        </div>


        {editingComment ? (
          <>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="new-comment-textarea"
            />
            <button className="add-comment-button" onClick={handleSaveEdit}>
              Save Edit
            </button>
          </>
        ) : (
          <>
            <input id="titleOfComment" ref={titleRef} placeholder='title' />
            <textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="new-comment-textarea"
            />
            <button className="add-comment-button" onClick={handleAddComment}>
              Add Comment
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Comments;
