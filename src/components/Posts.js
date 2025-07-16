import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  getDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/Posts.css";

export default function Posts({ onlyOwnPosts = false, profileUserId = null }) {
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    let q;
    if (profileUserId) {
      q = query(
        collection(db, "posts"),
        where("userId", "==", profileUserId),
        orderBy("timestamp", "desc")
      );
    } else if (onlyOwnPosts) {
      q = query(
        collection(db, "posts"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
    } else {
      q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsArray);
    });

    return () => unsubscribe();
  }, [user, onlyOwnPosts, profileUserId]);

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const username = userDoc.exists() ? userDoc.data().username : user.email;

      await addDoc(collection(db, "posts"), {
        userId: user.uid,
        username,
        content: newPostContent,
        timestamp: Timestamp.now(),
        likes: [],
      });
      setNewPostContent("");
    } catch (error) {
      console.error("Erro a criar post:", error);
    }
  };

  const toggleLike = async (post) => {
    if (!user) return;

    const postRef = doc(db, "posts", post.id);
    const hasLiked = post.likes.includes(user.uid);

    try {
      await updateDoc(postRef, {
        likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (error) {
      console.error("Erro a atualizar likes:", error);
    }
  };

  const canPost = !profileUserId || profileUserId === user?.uid;

  return (
    <div className="posts-container">
      {canPost && (
        <>
          <h3>Fazer um post</h3>
          <div className="new-post-area">
            <textarea
              rows={3}
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              placeholder="O que tens para dizer?"
            />
            <button onClick={handlePost}>Publicar</button>
          </div>

          <hr style={{ margin: "20px 0" }} />
        </>
      )}

      <h3>Posts</h3>
      {posts.length === 0 && <p>Nenhum post ainda.</p>}

      {posts.map((post) => (
        <PostItem
          key={post.id}
          post={post}
          user={user}
          toggleLike={toggleLike}
          canDelete={post.userId === user?.uid}
        />
      ))}
    </div>
  );
}

function PostItem({ post, user, toggleLike, canDelete }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const commentsCol = collection(db, "posts", post.id, "comments");
    const q = query(commentsCol, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsArray = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentsArray);
    });

    return () => unsubscribe();
  }, [post.id]);

  const handleComment = async () => {
    if (!newComment.trim()) return;
    if (!user) return;

    try {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const username = userDoc.exists() ? userDoc.data().username : user.email;

      const commentsCol = collection(db, "posts", post.id, "comments");
      await addDoc(commentsCol, {
        userId: user.uid,
        username,
        commentText: newComment,
        timestamp: Timestamp.now(),
      });
      setNewComment("");
    } catch (error) {
      console.error("Erro a adicionar comentário:", error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    const confirmDelete = window.confirm("Deseja apagar este comentário?");
    if (!confirmDelete) return;

    try {
      const commentRef = doc(db, "posts", post.id, "comments", commentId);
      await deleteDoc(commentRef);
    } catch (error) {
      console.error("Erro ao apagar comentário:", error);
    }
  };

  const likedByUser = post.likes.includes(user?.uid);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Tem a certeza que quer apagar este post?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "posts", post.id));
    } catch (error) {
      console.error("Erro ao apagar post:", error);
    }
  };

  return (
    <div className="post-item">
      <div className="post-header">@{post.username} disse:</div>
      <div className="post-content">{post.content}</div>

      <button
        onClick={() => toggleLike(post)}
        className={`like-button ${likedByUser ? "liked" : ""}`}
      >
        👍 {post.likes.length}
      </button>

      {canDelete && (
        <button onClick={handleDelete} className="delete-button">
          🗑️ Apagar
        </button>
      )}

      <div className="comments-section">
        <h4>Comentários</h4>
        {comments.length === 0 && <p>Nenhum comentário.</p>}
        {comments.map((comment) => (
          <div key={comment.id} className="comment-item">
            <b>@{comment.username}</b>: {comment.commentText}
            {comment.userId === user?.uid && (
              <button
                className="delete-comment-button"
                onClick={() => handleDeleteComment(comment.id)}
                style={{
                  marginLeft: "10px",
                  color: "red",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                title="Apagar comentário"
              >
                🗑️
              </button>
            )}
          </div>
        ))}
        <textarea
          rows={2}
          className="comment-input"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreve um comentário..."
        />
        <button onClick={handleComment} className="comment-button">
          Comentar
        </button>
      </div>
    </div>
  );
}
