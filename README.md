# Church Setlist & Lyrics App

A web app for displaying weekly church setlists and song lyrics to congregants, with a password-protected admin panel for managing songs and setlists.

---

## Features

### Public View
- Displays the currently active weekly setlist
- Shows all songs in order with title and artist
- Tap a song to view full lyrics, broken into labelled sections (verse, chorus, bridge, etc.)
- Dark/light mode toggle on the lyrics view
- Responsive — works on phones, tablets, and desktops

### Admin Panel
- Password-protected login
- **Songs** — add, edit, and delete songs with structured lyric sections (verse, chorus, bridge, pre-chorus, intro, outro, tag)
- **Setlists** — create setlists with a name and service date, manage which songs are included and their order, and set one setlist as "live" at a time

---

## Tech Stack

- **Frontend** — React + Vite
- **Database** — [Supabase](https://supabase.com) (PostgreSQL)
- **Hosting** — deploy anywhere that serves static files (Vercel, Netlify, etc.)

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase project

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd <project-folder>
npm install
```

### 2. Set up Supabase

In your Supabase project, create the following tables:

**`songs`**
| Column | Type |
|--------|------|
| id | uuid (primary key) |
| title | text |
| artist | text (nullable) |

**`song_sections`**
| Column | Type |
|--------|------|
| id | uuid (primary key) |
| song_id | uuid (foreign key → songs.id) |
| type | text |
| label | text |
| content | text |
| position | integer |

**`weekly_setlists`**
| Column | Type |
|--------|------|
| id | uuid (primary key) |
| name | text |
| service_date | date |
| is_active | boolean |

**`setlist_songs`**
| Column | Type |
|--------|------|
| id | uuid (primary key) |
| setlist_id | uuid (foreign key → weekly_setlists.id) |
| song_id | uuid (foreign key → songs.id) |
| position | integer |

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_ADMIN_PASSWORD=your-admin-password
```

> ⚠️ The admin password is stored client-side and is suitable for low-stakes internal use. Do not use this to protect sensitive data.

### 4. Run locally

```bash
npm run dev
```

The public view is at `http://localhost:5173`.  
The admin panel is at `http://localhost:5173/admin` (configured via your Vite router or a separate entry point).

---

## Project Structure

```
src/
├── components/
│   ├── SongCard.jsx        # Song list item
│   ├── SongDetails.jsx     # Full lyrics view
│   └── SongList.jsx        # Setlist overview
├── hooks/
│   └── useSetlist.js       # Fetches active setlist + songs from Supabase
├── admin/
│   ├── AdminApp.jsx        # Login screen
│   ├── AdminDashboard.jsx  # Shell with sidebar nav
│   ├── admin.css           # Admin-specific styles
│   ├── admin-main.jsx      # Admin entry point
│   └── pages/
│       ├── SongsPage.jsx   # Song CRUD with section editor
│       └── SetlistsPage.jsx # Setlist management
├── supabaseClient.js       # Supabase client setup
├── App.jsx                 # Public app root
└── main.jsx                # Public entry point
```

---

## Deployment

Build the app:

```bash
npm run build
```

Deploy the `dist/` folder to any static host. Make sure your environment variables are set in your hosting provider's dashboard.

---

## License

MIT