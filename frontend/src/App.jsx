import { useCallback, useEffect, useMemo, useState } from "react";
import { NavLink, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { Activity, ArrowDownRight, ArrowUpRight, CalendarDays, Check, ChevronRight, CirclePlus, Clock3, LayoutDashboard, MapPin, Pencil, Search, Sparkles, Ticket, Trash2, Users, X } from "lucide-react";
import api from "./api";

const dateLabel = (value) => new Date(value).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const dateInput = (value) => value ? new Date(value).toISOString().slice(0, 10) : "";
const shortId = (id) => id ? `EV-${id.slice(-6).toUpperCase()}` : "—";

function Shell({ children }) {
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><Sparkles size={20} /></div><div><strong>gatherwell</strong><span>EVENT DESK</span></div></div>
      <div className="workspace-label">WORKSPACE</div>
      <nav className="side-nav">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><LayoutDashboard size={18} />Dashboard</NavLink>
        <NavLink to="/add" className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}><CirclePlus size={18} />Add event</NavLink>
      </nav>
      <div className="sidebar-bottom"><div className="sidebar-orbit"><div className="orbit-dot" /></div><p>Good events bring people together.</p><span>Make room for memorable.</span></div>
      <div className="profile"><div className="profile-avatar">AD</div><div><strong>Event admin</strong><span>Workspace manager</span></div><div className="online-dot" /></div>
    </aside>
    <main className="main-area">
      <header className="topbar"><div className="breadcrumb"><span>Workspace</span><ChevronRight size={14} /><strong>Event management</strong></div><div className="topbar-right"><span className="live-indicator" /><span>System online</span><div className="top-avatar">A</div></div></header>
      <div className="page-content">{children}</div>
      <footer className="footer"><span>GATHERWELL <span className="footer-dot">·</span> EVENT DESK</span><span>Make every gathering count.</span></footer>
    </main>
  </div>;
}

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const navigate = useNavigate();

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/events");
      setEvents(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not connect to the server. Check that the backend and MongoDB Atlas are running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadEvents(); }, [loadEvents]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return events;
    return events.filter((event) => [event.name, event.venue, event._id].some((item) => String(item).toLowerCase().includes(term)));
  }, [events, search]);

  const registrations = events.reduce((sum, event) => sum + Number(event.totalRegistrations || 0), 0);
  const upcoming = events.filter((event) => new Date(event.date).setHours(23, 59, 59, 999) >= Date.now()).length;

  const removeEvent = async (event) => {
    const confirmed = window.confirm(`Delete “${event.name}”? This cannot be undone.`);
    if (!confirmed) return;
    try {
      await api.delete(`/events/${event._id}`);
      setEvents((current) => current.filter((item) => item._id !== event._id));
      setNotice("Event deleted successfully.");
      window.setTimeout(() => setNotice(""), 3200);
    } catch (err) {
      setError(err.response?.data?.message || "The event could not be deleted.");
    }
  };

  return <>
    <section className="welcome-row"><div><div className="eyebrow"><span className="eyebrow-line" />YOUR EVENT OVERVIEW</div><h1>Make it <span>happen.</span></h1><p className="page-subtitle">A clear view of what’s coming together.</p></div><button className="primary-button" onClick={() => navigate("/add")}><CirclePlus size={17} /> Create event</button></section>
    {notice && <div className="toast-success"><Check size={17} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss"><X size={16} /></button></div>}
    {error && <div className="alert-error"><span>{error}</span><button onClick={loadEvents}>Try again</button></div>}
    <section className="stats-grid">
      <article className="stat-card stat-primary"><div className="stat-top"><span>All events</span><span className="stat-icon"><CalendarDays size={18} /></span></div><div className="stat-value">{loading ? "—" : events.length.toString().padStart(2, "0")}</div><div className="stat-foot"><span className="stat-trend"><ArrowUpRight size={14} /> Your event library</span><span>01</span></div><div className="stat-watermark"><CalendarDays size={82} /></div></article>
      <article className="stat-card"><div className="stat-top"><span>Upcoming events</span><span className="stat-icon mint"><Clock3 size={18} /></span></div><div className="stat-value">{loading ? "—" : upcoming.toString().padStart(2, "0")}</div><div className="stat-foot"><span className="stat-trend mint-text"><Activity size={14} /> Still on the calendar</span></div></article>
      <article className="stat-card"><div className="stat-top"><span>Total registrations</span><span className="stat-icon peach"><Users size={18} /></span></div><div className="stat-value">{loading ? "—" : registrations.toLocaleString("en-IN")}</div><div className="stat-foot"><span className="stat-trend peach-text"><ArrowDownRight size={14} /> Across all events</span></div></article>
    </section>
    <section className="events-panel">
      <div className="panel-heading"><div><div className="eyebrow small-eyebrow">THE LINEUP</div><h2>All events <span className="count-pill">{events.length}</span></h2><p>Keep the details up to date.</p></div><label className="search-box"><Search size={17} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events or venues" /><kbd>⌕</kbd></label></div>
      <div className="table-wrap"><table><thead><tr><th>EVENT ID</th><th>EVENT DETAILS</th><th>DATE</th><th>VENUE</th><th>REGISTRATIONS</th><th className="actions-head">ACTIONS</th></tr></thead><tbody>
        {loading && <tr><td colSpan="6"><div className="table-state"><span className="loader" />Loading your events…</div></td></tr>}
        {!loading && !error && filtered.length === 0 && <tr><td colSpan="6"><div className="empty-state"><div className="empty-icon"><Ticket size={23} /></div><strong>{search ? "No matching events" : "Your next event starts here"}</strong><p>{search ? "Try a different name, ID or venue." : "Create an event and it will appear in this dashboard."}</p>{!search && <button className="primary-button" onClick={() => navigate("/add")}><CirclePlus size={16} /> Add your first event</button>}</div></td></tr>}
        {!loading && filtered.map((event, index) => <tr key={event._id}>
          <td><span className="event-code">{shortId(event._id)}</span></td>
          <td><div className="event-title-cell"><div className={`event-symbol symbol-${index % 4}`}><CalendarDays size={17} /></div><div><strong>{event.name}</strong><span>{event.description}</span></div></div></td>
          <td><div className="date-cell"><strong>{dateLabel(event.date)}</strong><span>{new Date(event.date).toLocaleDateString("en-IN", { weekday: "short" })}</span></div></td>
          <td><div className="venue-cell"><MapPin size={15} /><span>{event.venue}</span></div></td>
          <td><span className="registration-count"><Users size={14} />{Number(event.totalRegistrations || 0).toLocaleString("en-IN")}</span></td>
          <td><div className="row-actions"><button className="icon-button edit-button" onClick={() => navigate(`/edit/${event._id}`)} title="Update event" aria-label={`Update ${event.name}`}><Pencil size={15} /></button><button className="icon-button delete-button" onClick={() => removeEvent(event)} title="Delete event" aria-label={`Delete ${event.name}`}><Trash2 size={15} /></button></div></td>
        </tr>)}
      </tbody></table></div>
      <div className="panel-bottom"><span>Showing <strong>{filtered.length}</strong> of <strong>{events.length}</strong> events</span><span className="secure-note"><span className="secure-dot" />Synced with your event database</span></div>
    </section>
  </>;
}

function EventForm({ editing = false }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", description: "", date: "", venue: "", totalRegistrations: "0" });
  const [loading, setLoading] = useState(editing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    let active = true;
    api.get(`/events/${id}`).then(({ data }) => {
      if (active) setForm({ name: data.name, description: data.description, date: dateInput(data.date), venue: data.venue, totalRegistrations: String(data.totalRegistrations ?? 0) });
    }).catch((err) => {
      if (active) setError(err.response?.data?.message || "Could not find this event.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [editing, id]);

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form, totalRegistrations: Number(form.totalRegistrations || 0) };
      if (editing) await api.put(`/events/${id}`, payload);
      else await api.post("/events", payload);
      navigate("/", { state: { saved: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the event. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="form-loading"><span className="loader" />Loading event details…</div>;

  return <section className="form-page">
    <div className="form-intro"><button className="back-link" onClick={() => navigate("/")}>← Back to dashboard</button><div className="eyebrow"><span className="eyebrow-line" />EVENT STUDIO</div><h1>{editing ? "Refine the details." : "Create a moment."}</h1><p>{editing ? "Update the information and keep everyone in the loop." : "Add the essentials. You can polish the details any time."}</p></div>
    <div className="form-layout"><div className="form-card"><div className="form-card-head"><div className="form-card-icon"><CalendarDays size={21} /></div><div><h2>{editing ? "Edit event" : "New event"}</h2><p>Fields marked with * are required.</p></div><span className="form-step">{editing ? "EDIT" : "01 / 01"}</span></div>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={submit} className="event-form">
        <label className="field full-field"><span>Event name <b>*</b></span><input name="name" value={form.name} onChange={updateField} placeholder="e.g. Design Futures Meetup" maxLength="100" required /></label>
        <label className="field full-field"><span>Description <b>*</b></span><textarea name="description" value={form.description} onChange={updateField} placeholder="What is this event about?" rows="4" maxLength="1000" required /></label>
        <div className="field-grid"><label className="field"><span>Event date <b>*</b></span><div className="input-with-icon"><CalendarDays size={16} /><input type="date" name="date" value={form.date} onChange={updateField} required /></div></label><label className="field"><span>Venue <b>*</b></span><div className="input-with-icon"><MapPin size={16} /><input name="venue" value={form.venue} onChange={updateField} placeholder="City or venue name" maxLength="160" required /></div></label></div>
        <label className="field"><span>Total registrations</span><div className="input-with-icon"><Users size={16} /><input type="number" name="totalRegistrations" min="0" step="1" value={form.totalRegistrations} onChange={updateField} required /><span className="field-hint">Set to 0 if none yet</span></div><small>This count is displayed on the dashboard.</small></label>
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => navigate("/")}>Cancel</button><button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving…" : <>{editing ? <Check size={17} /> : <CirclePlus size={17} />}{editing ? "Save changes" : "Create event"}</>}</button></div>
      </form>
    </div><aside className="form-aside"><div className="aside-art"><div className="art-ring ring-one" /><div className="art-ring ring-two" /><div className="art-center"><Sparkles size={32} /></div><span className="art-star star-one">✳</span><span className="art-star star-two">✦</span></div><div className="aside-copy"><span className="aside-kicker">A LITTLE REMINDER</span><h3>Details make the difference.</h3><p>A clear title, useful description and accurate venue help your team stay aligned.</p></div><div className="aside-check"><span><Check size={15} /></span><div><strong>One source of truth</strong><p>Updates are saved to your database.</p></div></div></aside></div>
  </section>;
}

function NotFound() {
  const navigate = useNavigate();
  return <div className="not-found"><div className="empty-icon"><Ticket size={24} /></div><h1>That page wandered off.</h1><p>The page you’re looking for isn’t here.</p><button className="primary-button" onClick={() => navigate("/")}>Return to dashboard <ChevronRight size={16} /></button></div>;
}

export default function App() {
  return <Shell><Routes><Route path="/" element={<Dashboard />} /><Route path="/add" element={<EventForm />} /><Route path="/edit/:id" element={<EventForm editing />} /><Route path="*" element={<NotFound />} /></Routes></Shell>;
}
