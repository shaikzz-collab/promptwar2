import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// On Render, only /tmp is writable. Locally use server/database.json
const IS_PROD  = process.env.NODE_ENV === 'production' || process.env.RENDER;
const DB_FILE  = IS_PROD
  ? '/tmp/votesphere-database.json'
  : path.join(__dirname, 'database.json');

const defaultData = {
  users: [],
  elections: [
    {
      id: "lok-sabha-2026",
      title: "Lok Sabha General Elections 2026",
      description: "National elections for the lower house of India's bicameral Parliament.",
      country: "India", status: "active",
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      themeColor: "saffron"
    },
    {
      id: "state-assembly-mh",
      title: "Maharashtra State Assembly Elections",
      description: "Elections for the Legislative Assembly of Maharashtra.",
      country: "India", status: "active",
      endDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      themeColor: "green"
    },
    {
      id: "student-council",
      title: "National Student Council Demo",
      description: "Demo election for student body president.",
      country: "Global", status: "active",
      endDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      themeColor: "blue"
    }
  ],
  candidates: [
    { id: "c1",  electionId: "lok-sabha-2026",    name: "Ramesh Sharma",   party: "National Democratic Alliance",  symbol: "🪷", manifesto: "Focus on infrastructure, digital economy, and national security.", votes: 14500 },
    { id: "c2",  electionId: "lok-sabha-2026",    name: "Priya Singh",     party: "United Progressive Alliance",   symbol: "✋", manifesto: "Empowering rural development, education, and healthcare.", votes: 13200 },
    { id: "c3",  electionId: "lok-sabha-2026",    name: "Arvind Kumar",    party: "Aam Aadmi Party",               symbol: "🧹", manifesto: "Free electricity, water, and improved public schools.", votes: 8900 },
    { id: "c8",  electionId: "lok-sabha-2026",    name: "Anil Desai",      party: "Independent Forward Bloc",      symbol: "🦁", manifesto: "Rooting out corruption and promoting local industries.", votes: 4200 },
    { id: "c9",  electionId: "lok-sabha-2026",    name: "Meera Reddy",     party: "South Regional Front",          symbol: "🚲", manifesto: "Better representation for southern states and tech hubs.", votes: 6700 },
    { id: "c4",  electionId: "state-assembly-mh", name: "Sanjay Patil",    party: "Shiv Sena",                     symbol: "🏹", manifesto: "State pride, local employment, and agricultural reforms.", votes: 5600 },
    { id: "c5",  electionId: "state-assembly-mh", name: "Amit Deshmukh",   party: "Nationalist Congress Party",    symbol: "⏰", manifesto: "Industrial growth and social welfare schemes.", votes: 4800 },
    { id: "c10", electionId: "state-assembly-mh", name: "Rajeev Joshi",    party: "MNS",                           symbol: "🚂", manifesto: "Putting Maharashtra first in all state policies.", votes: 3100 },
    { id: "c6",  electionId: "student-council",   name: "Neha Gupta",      party: "Progressive Students Union",    symbol: "📚", manifesto: "Better cafeteria food and extended library hours.", votes: 340 },
    { id: "c7",  electionId: "student-council",   name: "Rahul Verma",     party: "Student Action Front",          symbol: "💻", manifesto: "Free Wi-Fi on campus and more tech events.", votes: 420 },
    { id: "c11", electionId: "student-council",   name: "Vikram Shah",     party: "Sports & Arts Coalition",       symbol: "⚽", manifesto: "More funding for college sports and annual fests.", votes: 290 }
  ],
  "votes": [],
  "comments": []
};

// Initialize DB from file or seed defaults
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2));
}

export const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));

export const saveDB = () => {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
};
