import { useState, useEffect } from "react";
import { GALLERY } from "./gallery";
import "./Gallery.css";
import { db } from "../firebase"; // Change this if your firebase file is elsewhere
import { collection, addDoc, onSnapshot, query, where, doc, setDoc, deleteDoc, orderBy, serverTimestamp } from "firebase/firestore";

export default function Gallery() {
  const [comments, setComments] = useState({});
  const [likesCount, setLikesCount] = useState({});
  const [myLikes, setMyLikes] = useState({});
  const [inputs, setInputs] = useState({});

  // Give this phone a unique ID so we know who liked what
  const [deviceId] = useState(() => {
    let id = localStorage.getItem("lebo-device-id");
    if (!id) {
      id = "device_" + Math.random().toString(36).slice(2) + Date.now();
      localStorage.setItem("lebo-device-id", id);
    }
    return id;
  });

  // Listen to COMMENTS live from Firestore
  useEffect(() => {
    const q = query(collection(db, "galleryComments"), orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, (snap) => {
      const grouped = {};
      snap.forEach(d => {
        const data = d.data();
        if (!grouped[data.photoId]) grouped[data.photoId] = [];
        grouped[data.photoId].push({ id: d.id, name: data.name, text: data.text });
      });
      setComments(grouped);
    });
    return () => unsub();
  }, []);

  // Listen to LIKES live from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "galleryLikes"), (snap) => {
      const counts = {};
      const mine = {};
      snap.forEach(d => {
        const data = d.data();
        counts[data.photoId] = (counts[data.photoId] || 0) + 1;
        if (data.deviceId === deviceId) mine[data.photoId] = true;
      });
      setLikesCount(counts);
      setMyLikes(mine);
    });
    return () => unsub();
  }, [deviceId]);

  async function toggleLike(photoId) {
    const likeDocId = `${photoId}_${deviceId}`;
    const ref = doc(db, "galleryLikes", likeDocId);
    if (myLikes[photoId]) {
      await deleteDoc(ref); // Unlike
    } else {
      await setDoc(ref, { photoId, deviceId, createdAt: serverTimestamp() });
    }
  }

  async function addComment(photoId) {
    const name = inputs[photoId]?.name?.trim();
    const text = inputs[photoId]?.text?.trim();
    if (!name || !text) return alert("Please add your name and comment");
    await addDoc(collection(db, "galleryComments"), {
      photoId,
      name,
      text,
      createdAt: serverTimestamp()
    });
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
                <button
                  className={`btn-like ${myLikes[photo.id] ? "liked" : ""}`}
                  onClick={() => toggleLike(photo.id)}
                >
                  ❤️ {photo.likes + (likesCount[photo.id] || 0)}
                </button>
                <span>💬 {(comments[photo.id] || []).length} comments</span>
              </div>
              <div className="comments-list">
                {(comments[photo.id] || []).map((c) => (
                  <div key={c.id} className="comment"><b>{c.name}:</b> {c.text}</div>
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