import { useState } from "react";
import { GALLERY } from "./gallery";
import "./Gallery.css";

export default function Gallery() {
  const [comments, setComments] = useState(() => {
    const saved = localStorage.getItem("lebo-comments");
    return saved ? JSON.parse(saved) : {};
  });
  const [likes, setLikes] = useState({});
  const [inputs, setInputs] = useState({});

  function addComment(photoId) {
    const name = inputs[photoId]?.name?.trim();
    const text = inputs[photoId]?.text?.trim();
    if (!name || !text) return alert("Please add your name and comment");
    const newComments = { ...comments, [photoId]: [...(comments[photoId] || []), { name, text }] };
    setComments(newComments);
    localStorage.setItem("lebo-comments", JSON.stringify(newComments));
    setInputs({ ...inputs, [photoId]: { name: "", text: "" } });
  }

  return (
    <div className="container">
      <h2 className="section-title">✂️ Our Previous Work</h2>
      <p style={{ textAlign: "center", color: "#aaa" }}>Real cuts from LEBO's Cut Salon. Tap ❤️ and leave a comment!</p>
      <div className="gallery-grid">
        {GALLERY.map(photo => (
          <div key={photo.id} className="gallery-card">
            <img src={photo.img} alt={photo.title} />
            <div className="gallery-body">
              <h3>{photo.title}</h3>
              <div className="gallery-actions">
                <button className={`btn-like ${likes[photo.id] ? "liked" : ""}`} onClick={() => setLikes({ ...likes, [photo.id]: !likes[photo.id] })}>❤️ {photo.likes + (likes[photo.id] ? 1 : 0)}</button>
                <span>💬 {(comments[photo.id] || []).length} comments</span>
              </div>
              <div className="comments-list">
                {(comments[photo.id] || []).map((c, i) => (
                  <div key={i} className="comment"><b>{c.name}:</b> {c.text}</div>
                ))}
              </div>
              <div className="comment-form">
                <input className="comment-input" placeholder="Your Name" value={inputs[photo.id]?.name || ""} onChange={e => setInputs({ ...inputs, [photo.id]: { ...inputs[photo.id], name: e.target.value } })} />
                <input className="comment-input" placeholder="Nice cut! 🔥" value={inputs[photo.id]?.text || ""} onChange={e => setInputs({ ...inputs, [photo.id]: { ...inputs[photo.id], text: e.target.value } })} />
                <button className="btn-comment" onClick={() => addComment(photo.id)}>Post Comment</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}