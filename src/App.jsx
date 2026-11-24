import { useState, useEffect } from "react";
import { GALLERY } from "./gallery";
import "./App.css";

const SERVICES = [
  { id: 1, icon: "✂️", name: "Men Haircut", price: 3000, desc: "Tap to Select" },
  { id: 2, icon: "🧔", name: "Beard Trim", price: 2000, desc: "Tap to Select" },
  { id: 3, icon: "👦", name: "Kids Haircut", price: 2000, desc: "Tap to Select" },
  { id: 4, icon: "💇‍♀️", name: "Ladies Haircut", price: 3500, desc: "Tap to Select" },
  { id: 5, icon: "🎨", name: "Haircut and Dye", price: 4000, desc: "Tap to Select" },
  { id: 6, icon: "🏠", name: "Home Service", price: 7000, desc: "Price might change depending on location :Tap to Select" },
  { id: 7, icon: "👶", name: "New Baby Haircut", price: 5000, desc: "Tap to Select" },
  { id: 8, icon: "🧴", name: "Hair Tint and Wash", price: 8000, desc: "Tap to Select" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [selected, setSelected] = useState(SERVICES[4]);
  const [showBook, setShowBook] = useState(false);
  const [bookings, setBookings] = useState(() => JSON.parse(localStorage.getItem("bookings") || "[]"));
  const [likes, setLikes] = useState(() => JSON.parse(localStorage.getItem("likes") || "{}"));
  const [comments, setComments] = useState(() => JSON.parse(localStorage.getItem("comments") || "{}"));
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "" });

  useEffect(() => { localStorage.setItem("bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("likes", JSON.stringify(likes)); }, [likes]);
  useEffect(() => { localStorage.setItem("comments", JSON.stringify(comments)); }, [comments]);

  const pickService = (s) => {
    setSelected(s);
    setShowBook(true);
    setPage("book");
  };

    const handleBook = (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) return alert("Please fill all fields");
    const newBooking = { ...form, service: `${selected.name} - ₦${selected.price.toLocaleString()}`, id: Date.now(), status: "Pending" };
    setBookings([newBooking, ...bookings]);
    setForm({ name: "", phone: "", date: "", time: "" });
    setShowBook(false);
    alert("Booking saved! Check Admin page to approve.");
  };

  const updateStatus = (id, status) => setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
  const toggleLike = (id) => setLikes({ ...likes, [id]: !likes[id] });
  const addComment = (id) => {
    if (!commentName || !commentText) return alert("Type your name and comment");
    const list = comments[id] || [];
    setComments({ ...comments, [id]: [...list, { name: commentName, text: commentText }] });
    setCommentText("");
    setActiveCommentId(null);
  };

  return (
    <div className="app">
       <div className="top-banner"> 
      <header className="header">
        <h1 className="banner-logo">✂️ Lebo's Cut</h1> <br></br>
        <p className="subtitle">Fresh Fades • Ibadan, Nigeria</p>
      </header>
      </div> <br></br>

      <nav className="nav">
        <button onClick={() => setPage("home")} className={page === "home" ? "nav-btn active" : "nav-btn"}>🏠 Home</button>
        <button onClick={() => setPage("book")} className={page === "book" ? "nav-btn active" : "nav-btn"}>📅 Book</button>
        <button onClick={() => setPage("gallery")} className={page === "gallery" ? "nav-btn active" : "nav-btn"}>🖼️ Gallery</button>
        <button onClick={() => setPage("admin")} className={page === "admin" ? "nav-btn active" : "nav-btn"}>🔒 Admin</button>
      </nav>

      {page === "home" && (
        <div>
          <div className="hero">
            <img src="public/lebo.jpeg" alt="Lebo's Cut" className="hero-img" />
            <div className="hero-overlay">
              <h2 className="hero-title">Look Sharp.<br />Feel Confident.</h2>
              <p className="hero-text">Ibadan's home for clean fades, sharp line-ups and fresh styles.</p>
              <button onClick={() => { setPage("book"); setShowBook(false); }} className="btn-primary hero-btn">📅 Book Your Session →</button>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">About Lebo's Cut</h2>
            <p className="about-text">Welcome to Lebo's Cut Salon - where every cut is clean, sharp and made for you. From classic fades to modern styles, dreads retouch and beard grooming - our barbers take their time to give you the perfect look. No rush, No wahala, Just good vibes and clean cuts.</p>
            <div className="stats">
              <div className="stat"><b className="stat-number">500+</b><span>Happy Clients</span></div>
              <div className="stat"><b className="stat-number">5★</b><span>Top Rated</span></div>
              <div className="stat"><b className="stat-number">7 Days</b><span>Open Weekly</span></div>
            </div>
          </div>

          <div className="card">
            <h2 className="section-title">Popular Services</h2>
            <div className="service-row"><span>✂️ Haircut</span><b>₦3,000</b></div>
            <div className="service-row"><span>🧔 Beard Trim</span><b>₦2,000</b></div>
            <div className="service-row"><span>👦 Kids Cut</span><b>₦2,000</b></div>
            <div className="service-row"><span>🌀 Haircut and Dye</span><b>₦4,000</b></div>
            <button onClick={() => { setPage("book"); setShowBook(false); }} className="btn-primary full">Book Now →</button>
          </div>

          <div className="card">
            <h2 className="section-title">Why Choose Us?</h2>
            <p className="why-item">✅ Sharp, clean fades every time</p>
            <p className="why-item">✅ No long waiting - Book online</p>
            <p className="why-item">✅ Friendly barbers, good vibes</p>
            <p className="why-item">✅ Affordable prices</p>
            <button onClick={() => setPage("gallery")} className="btn-secondary full">See Our Work →</button>
          </div>
        </div>
      )}

      {page === "book" && (
        <div className="booking-page">
          <div className="top-banner">
            <p className="banner-sub">Premium Cuts • Ibadan • 0707 880 9788</p>
            <a href="https://wa.me/2347078809786" target="_blank" rel="noreferrer" className="whatsapp-btn">💬 Chat on WhatsApp</a>
          </div>

          <h2 className="services-heading">✂️ Our Services & Prices</h2><br></br>
          <div className="services-grid">
            {SERVICES.map(s => (
              <button key={s.id} onClick={() => { setSelected(s); setShowBook(true); }} className={selected.id === s.id ? "service-card selected" : "service-card"}>
                <span className="service-icon">{s.icon}</span>
                <span className="service-name">{s.name}</span>
                <b className="service-price">₦{s.price.toLocaleString()}</b>
                <span className="service-desc">{s.desc}</span>
              </button>
            ))}
          </div>

          {showBook ? (
            <form onSubmit={handleBook} className="booking-form">
              <div className="booking-header">
                <div>
                  <p className="booking-label">Selected Service</p>
                  <h3 className="booking-service">{selected.icon} {selected.name}</h3>
                </div>
                <b className="booking-total">₦{selected.price.toLocaleString()}</b>
              </div>
              <input className="input-light" placeholder="Your Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
              <input className="input-light" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              <div className="form-row">
                <input className="input-light" type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                <input className="input-light" type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
              </div>
              <p className="total-line">Total to Pay: <b>₦{selected.price.toLocaleString()}</b></p>
              <button type="submit" className="btn-confirm">Confirm Booking</button>
              <p className="booking-note">You just need to confirm your booking details.</p>
            </form>
          ) : (
            <button onClick={() => setShowBook(true)} className="btn-primary full booking-continue">Continue to Book →</button>
          )}
        </div>
      )}

      {page === "gallery" && (
        <div>
          <h2 className="page-title">Our Work - Real Cuts</h2>
          {GALLERY.map(item => {
            const liked = !!likes[item.id];
            const totalLikes = item.likes + (liked ? 1 : 0);
            const list = comments[item.id] || [];
            return (
              <div key={item.id} className="card">
                <img src={item.img} alt={item.title} className="gallery-img" />
                <h3 className="gallery-title">{item.title}</h3>
                <div className="actions">
                  <button onClick={() => toggleLike(item.id)} className="like-btn">{liked ? "❤️" : "🤍"} {totalLikes}</button>
                  <button onClick={() => setActiveCommentId(activeCommentId === item.id ? null : item.id)} className="comment-toggle">💬 Comment ({list.length})</button>
                </div>
                {list.map((c, i) => (<p key={i} className="comment"><b>{c.name}:</b> {c.text}</p>))}
                {activeCommentId === item.id && (
                  <div className="comment-form">
                    <input className="input" placeholder="Your Name" value={commentName} onChange={e => setCommentName(e.target.value)} />
                    <input className="input" placeholder="Write a comment..." value={commentText} onChange={e => setCommentText(e.target.value)} />
                    <button onClick={() => addComment(item.id)} className="btn-primary full">Post Comment</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {page === "admin" && (
        <div>
          <h2 className="page-title">Bookings ({bookings.length})</h2>
          {bookings.length === 0 && <p className="empty-text">No bookings yet.</p>}
          {bookings.map(b => (
            <div key={b.id} className="card">
              <b>{b.name}</b> - {b.phone}<br />{b.service} | {b.date} at {b.time}<br />
              Status: <b className={`status-${b.status.toLowerCase()}`}>{b.status}</b>
              <div className="admin-actions">
                <button onClick={() => updateStatus(b.id, "Approved")} className="btn-primary flex-1">Approve</button>
                <button onClick={() => updateStatus(b.id, "Rejected")} className="btn-danger flex-1">Reject</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="footer">
        <p className="footer-logo">✂️ Lebo's Cut Salon</p>
        <p className="footer-text">Fresh Fades • Ibadan, Nigeria • Open Daily 10am - 8pm</p>
        <p className="footer-copy">© {new Date().getFullYear()} Lebo's Cut Salon. All rights reserved.</p>
      </footer>
    </div>
  );
}