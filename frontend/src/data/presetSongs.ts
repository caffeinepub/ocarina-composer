import { PresetSong, Note, SongCategory } from '../types/music';

let _noteId = 0;
function n(name: Note['name'], octave: number, duration: Note['duration'] = 'quarter'): Note {
  return { id: `preset-${_noteId++}`, name, octave, duration };
}

// ─── Classic Folk ────────────────────────────────────────────────────────────

const twinkleTwinkle: PresetSong = {
  id: 'twinkle-twinkle',
  title: 'Twinkle Twinkle Little Star',
  category: 'Classic Folk',
  tempo: 100,
  notes: [
    n('C', 5), n('C', 5), n('G', 5), n('G', 5),
    n('A', 5), n('A', 5), n('G', 5, 'half'),
    n('F', 5), n('F', 5), n('E', 5), n('E', 5),
    n('D', 5), n('D', 5), n('C', 5, 'half'),
    n('G', 5), n('G', 5), n('F', 5), n('F', 5),
    n('E', 5), n('E', 5), n('D', 5, 'half'),
    n('G', 5), n('G', 5), n('F', 5), n('F', 5),
    n('E', 5), n('E', 5), n('D', 5, 'half'),
    n('C', 5), n('C', 5), n('G', 5), n('G', 5),
    n('A', 5), n('A', 5), n('G', 5, 'half'),
    n('F', 5), n('F', 5), n('E', 5), n('E', 5),
    n('D', 5), n('D', 5), n('C', 5, 'half'),
  ],
};

const happyBirthday: PresetSong = {
  id: 'happy-birthday',
  title: 'Happy Birthday',
  category: 'Classic Folk',
  tempo: 90,
  notes: [
    n('C', 5, 'eighth'), n('C', 5, 'eighth'), n('D', 5, 'quarter'), n('C', 5, 'quarter'), n('F', 5, 'quarter'), n('E', 5, 'half'),
    n('C', 5, 'eighth'), n('C', 5, 'eighth'), n('D', 5, 'quarter'), n('C', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'half'),
    n('C', 5, 'eighth'), n('C', 5, 'eighth'), n('C', 6, 'quarter'), n('A', 5, 'quarter'), n('F', 5, 'quarter'), n('E', 5, 'quarter'), n('D', 5, 'half'),
    n('A#', 5, 'eighth'), n('A#', 5, 'eighth'), n('A', 5, 'quarter'), n('F', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'half'),
  ],
};

const maryHadALittleLamb: PresetSong = {
  id: 'mary-had-a-little-lamb',
  title: 'Mary Had a Little Lamb',
  category: 'Classic Folk',
  tempo: 110,
  notes: [
    n('E', 5), n('D', 5), n('C', 5), n('D', 5),
    n('E', 5), n('E', 5), n('E', 5, 'half'),
    n('D', 5), n('D', 5), n('D', 5, 'half'),
    n('E', 5), n('G', 5), n('G', 5, 'half'),
    n('E', 5), n('D', 5), n('C', 5), n('D', 5),
    n('E', 5), n('E', 5), n('E', 5), n('E', 5),
    n('D', 5), n('D', 5), n('E', 5), n('D', 5),
    n('C', 5, 'whole'),
  ],
};

// ─── Video Games ─────────────────────────────────────────────────────────────

const zeldasLullaby: PresetSong = {
  id: 'zeldas-lullaby',
  title: "Zelda's Lullaby",
  category: 'Video Games',
  tempo: 80,
  notes: [
    n('B', 5, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'half'),
    n('G', 5, 'eighth'), n('A', 5, 'eighth'), n('B', 5, 'quarter'), n('D', 6, 'quarter'), n('A', 5, 'half'),
    n('B', 5, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'quarter'), n('B', 5, 'quarter'),
    n('G', 5, 'half'), n('G', 5, 'half'),
    n('B', 5, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'half'),
    n('G', 5, 'eighth'), n('A', 5, 'eighth'), n('B', 5, 'quarter'), n('D', 6, 'quarter'), n('A', 5, 'half'),
    n('B', 5, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'quarter'), n('B', 5, 'quarter'),
    n('G', 5, 'whole'),
  ],
};

const marioUnderground: PresetSong = {
  id: 'mario-underground',
  title: 'Mario Underground Theme',
  category: 'Video Games',
  tempo: 160,
  notes: [
    n('C', 5, 'eighth'), n('C', 6, 'eighth'), n('C', 5, 'eighth'), n('C', 6, 'eighth'),
    n('A#', 5, 'eighth'), n('C', 6, 'eighth'), n('A#', 5, 'eighth'), n('C', 6, 'eighth'),
    n('A', 5, 'eighth'), n('C', 6, 'eighth'), n('A', 5, 'eighth'), n('C', 6, 'eighth'),
    n('G#', 5, 'eighth'), n('C', 6, 'eighth'), n('G#', 5, 'eighth'), n('C', 6, 'eighth'),
    n('A', 5, 'quarter'), n('C', 5, 'quarter'), n('E', 5, 'quarter'), n('G', 5, 'quarter'),
    n('A', 5, 'quarter'), n('G', 5, 'quarter'), n('E', 5, 'quarter'), n('C', 5, 'quarter'),
    n('D', 5, 'quarter'), n('F', 5, 'quarter'), n('A', 5, 'quarter'), n('C', 6, 'quarter'),
    n('D', 6, 'quarter'), n('C', 6, 'quarter'), n('A', 5, 'quarter'), n('F', 5, 'quarter'),
  ],
};

const tetrisTheme: PresetSong = {
  id: 'tetris-theme',
  title: 'Tetris Theme (Korobeiniki)',
  category: 'Video Games',
  tempo: 140,
  notes: [
    n('E', 5, 'quarter'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('D', 5, 'quarter'), n('C', 5, 'eighth'), n('B', 4, 'eighth'),
    n('A', 4, 'quarter'), n('A', 4, 'eighth'), n('C', 5, 'eighth'), n('E', 5, 'quarter'), n('D', 5, 'eighth'), n('C', 5, 'eighth'),
    n('B', 4, 'quarter'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('D', 5, 'quarter'), n('E', 5, 'quarter'),
    n('C', 5, 'quarter'), n('A', 4, 'quarter'), n('A', 4, 'half'),
    n('D', 5, 'quarter'), n('F', 5, 'eighth'), n('A', 5, 'quarter'), n('G', 5, 'eighth'), n('F', 5, 'eighth'),
    n('E', 5, 'quarter'), n('E', 5, 'eighth'), n('C', 5, 'eighth'), n('E', 5, 'quarter'), n('D', 5, 'eighth'), n('C', 5, 'eighth'),
    n('B', 4, 'quarter'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('D', 5, 'quarter'), n('E', 5, 'quarter'),
    n('C', 5, 'quarter'), n('A', 4, 'quarter'), n('A', 4, 'half'),
  ],
};

const finalFantasyPrelude: PresetSong = {
  id: 'final-fantasy-prelude',
  title: 'Final Fantasy Prelude',
  category: 'Video Games',
  tempo: 120,
  notes: [
    n('C', 5, 'eighth'), n('E', 5, 'eighth'), n('G', 5, 'eighth'), n('C', 6, 'eighth'),
    n('E', 6, 'eighth'), n('G', 5, 'eighth'), n('C', 6, 'eighth'), n('E', 6, 'eighth'),
    n('D', 5, 'eighth'), n('F', 5, 'eighth'), n('A', 5, 'eighth'), n('D', 6, 'eighth'),
    n('F', 6, 'eighth'), n('A', 5, 'eighth'), n('D', 6, 'eighth'), n('F', 6, 'eighth'),
    n('B', 4, 'eighth'), n('D', 5, 'eighth'), n('G', 5, 'eighth'), n('B', 5, 'eighth'),
    n('D', 6, 'eighth'), n('G', 5, 'eighth'), n('B', 5, 'eighth'), n('D', 6, 'eighth'),
    n('C', 5, 'eighth'), n('E', 5, 'eighth'), n('G', 5, 'eighth'), n('C', 6, 'eighth'),
    n('E', 6, 'eighth'), n('G', 5, 'eighth'), n('C', 6, 'eighth'), n('E', 6, 'eighth'),
  ],
};

const minecraftSweden: PresetSong = {
  id: 'minecraft-sweden',
  title: 'Sweden (Minecraft)',
  category: 'Video Games',
  tempo: 70,
  notes: [
    n('F', 5, 'quarter'), n('G', 5, 'quarter'), n('A', 5, 'half'),
    n('F', 5, 'quarter'), n('G', 5, 'quarter'), n('A', 5, 'half'),
    n('A', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('G', 5, 'quarter'),
    n('A', 5, 'whole'),
    n('C', 6, 'quarter'), n('A', 5, 'quarter'), n('G', 5, 'half'),
    n('F', 5, 'quarter'), n('G', 5, 'quarter'), n('A', 5, 'half'),
    n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('E', 5, 'quarter'), n('D', 5, 'quarter'),
    n('C', 5, 'whole'),
    n('E', 5, 'quarter'), n('F', 5, 'quarter'), n('G', 5, 'half'),
    n('E', 5, 'quarter'), n('F', 5, 'quarter'), n('G', 5, 'half'),
    n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('E', 5, 'quarter'), n('F', 5, 'quarter'),
    n('G', 5, 'whole'),
  ],
};

const megalovania: PresetSong = {
  id: 'megalovania',
  title: 'Megalovania (Undertale)',
  category: 'Video Games',
  tempo: 120,
  notes: [
    n('D', 5, 'eighth'), n('D', 5, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'quarter'),
    n('G#', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('D', 5, 'eighth'), n('F', 5, 'eighth'), n('G', 5, 'eighth'),
    n('C', 5, 'eighth'), n('C', 5, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'quarter'),
    n('G#', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('D', 5, 'eighth'), n('F', 5, 'eighth'), n('G', 5, 'eighth'),
    n('B', 4, 'eighth'), n('B', 4, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'quarter'),
    n('G#', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('D', 5, 'eighth'), n('F', 5, 'eighth'), n('G', 5, 'eighth'),
    n('A#', 4, 'eighth'), n('A#', 4, 'eighth'), n('D', 6, 'quarter'), n('A', 5, 'quarter'),
    n('G#', 5, 'quarter'), n('G', 5, 'quarter'), n('F', 5, 'quarter'), n('D', 5, 'eighth'), n('F', 5, 'eighth'), n('G', 5, 'eighth'),
  ],
};

// ─── Mixed Genres ─────────────────────────────────────────────────────────────

const smokeOnTheWater: PresetSong = {
  id: 'smoke-on-the-water',
  title: 'Smoke on the Water (Rock)',
  category: 'Mixed Genres',
  tempo: 112,
  notes: [
    n('G', 4, 'quarter'), n('A#', 4, 'quarter'), n('C', 5, 'half'),
    n('G', 4, 'quarter'), n('A#', 4, 'quarter'), n('C#', 5, 'quarter'), n('C', 5, 'half'),
    n('G', 4, 'quarter'), n('A#', 4, 'quarter'), n('C', 5, 'quarter'), n('A#', 4, 'quarter'), n('G', 4, 'half'),
    n('G', 4, 'quarter'), n('A#', 4, 'quarter'), n('C', 5, 'half'),
    n('G', 4, 'quarter'), n('A#', 4, 'quarter'), n('C#', 5, 'quarter'), n('C', 5, 'half'),
    n('G', 4, 'quarter'), n('A#', 4, 'quarter'), n('C', 5, 'quarter'), n('A#', 4, 'quarter'), n('G', 4, 'whole'),
  ],
};

const blueDaBaDee: PresetSong = {
  id: 'blue-da-ba-dee',
  title: 'Blue (Da Ba Dee) (Electronic)',
  category: 'Mixed Genres',
  tempo: 130,
  notes: [
    n('E', 5, 'eighth'), n('D', 5, 'eighth'), n('E', 5, 'eighth'), n('D', 5, 'eighth'), n('E', 5, 'eighth'), n('B', 4, 'eighth'), n('D', 5, 'quarter'),
    n('C', 5, 'eighth'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('G', 4, 'eighth'), n('B', 4, 'quarter'),
    n('A', 4, 'eighth'), n('G', 4, 'eighth'), n('A', 4, 'eighth'), n('G', 4, 'eighth'), n('A', 4, 'eighth'), n('E', 4, 'eighth'), n('G', 4, 'quarter'),
    n('F#', 4, 'quarter'), n('G', 4, 'quarter'), n('A', 4, 'half'),
    n('E', 5, 'eighth'), n('D', 5, 'eighth'), n('E', 5, 'eighth'), n('D', 5, 'eighth'), n('E', 5, 'eighth'), n('B', 4, 'eighth'), n('D', 5, 'quarter'),
    n('C', 5, 'eighth'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('B', 4, 'eighth'), n('C', 5, 'eighth'), n('G', 4, 'eighth'), n('B', 4, 'quarter'),
    n('A', 4, 'quarter'), n('G', 4, 'quarter'), n('F#', 4, 'quarter'), n('E', 4, 'quarter'),
    n('D', 4, 'whole'),
  ],
};

const riversOfBabylon: PresetSong = {
  id: 'rivers-of-babylon',
  title: 'Rivers of Babylon (Reggae)',
  category: 'Mixed Genres',
  tempo: 95,
  notes: [
    n('G', 5, 'quarter'), n('G', 5, 'quarter'), n('G', 5, 'quarter'), n('E', 5, 'quarter'),
    n('G', 5, 'quarter'), n('G', 5, 'quarter'), n('G', 5, 'quarter'), n('E', 5, 'quarter'),
    n('G', 5, 'quarter'), n('A', 5, 'quarter'), n('G', 5, 'quarter'), n('E', 5, 'quarter'),
    n('D', 5, 'half'), n('D', 5, 'half'),
    n('G', 5, 'quarter'), n('G', 5, 'quarter'), n('G', 5, 'quarter'), n('E', 5, 'quarter'),
    n('G', 5, 'quarter'), n('A', 5, 'quarter'), n('B', 5, 'quarter'), n('A', 5, 'quarter'),
    n('G', 5, 'quarter'), n('E', 5, 'quarter'), n('D', 5, 'quarter'), n('C', 5, 'quarter'),
    n('G', 4, 'whole'),
  ],
};

const gasolina: PresetSong = {
  id: 'gasolina',
  title: 'Gasolina (Reggaeton)',
  category: 'Mixed Genres',
  tempo: 100,
  notes: [
    n('A', 5, 'eighth'), n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('A', 5, 'eighth'),
    n('F', 5, 'eighth'), n('G', 5, 'eighth'), n('A', 5, 'quarter'),
    n('A', 5, 'eighth'), n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('A', 5, 'eighth'),
    n('F', 5, 'eighth'), n('E', 5, 'eighth'), n('D', 5, 'quarter'),
    n('D', 5, 'eighth'), n('E', 5, 'eighth'), n('F', 5, 'eighth'), n('G', 5, 'eighth'),
    n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('F', 5, 'quarter'),
    n('E', 5, 'quarter'), n('D', 5, 'quarter'), n('C', 5, 'half'),
    n('A', 5, 'eighth'), n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('A', 5, 'eighth'),
    n('F', 5, 'eighth'), n('G', 5, 'eighth'), n('A', 5, 'quarter'),
    n('G', 5, 'eighth'), n('F', 5, 'eighth'), n('E', 5, 'eighth'), n('D', 5, 'eighth'),
    n('C', 5, 'half'), n('C', 5, 'half'),
  ],
};

const wonderwall: PresetSong = {
  id: 'wonderwall',
  title: 'Wonderwall (Rock)',
  category: 'Mixed Genres',
  tempo: 87,
  notes: [
    n('F#', 5, 'eighth'), n('E', 5, 'eighth'), n('B', 4, 'eighth'), n('B', 4, 'eighth'),
    n('F#', 5, 'eighth'), n('E', 5, 'eighth'), n('B', 4, 'quarter'),
    n('F#', 5, 'eighth'), n('E', 5, 'eighth'), n('B', 4, 'eighth'), n('B', 4, 'eighth'),
    n('F#', 5, 'eighth'), n('E', 5, 'eighth'), n('B', 4, 'quarter'),
    n('G', 5, 'eighth'), n('F#', 5, 'eighth'), n('E', 5, 'eighth'), n('E', 5, 'eighth'),
    n('G', 5, 'eighth'), n('F#', 5, 'eighth'), n('E', 5, 'quarter'),
    n('A', 5, 'quarter'), n('B', 5, 'quarter'), n('G', 5, 'quarter'), n('F#', 5, 'quarter'),
    n('E', 5, 'half'), n('B', 4, 'half'),
    n('D', 5, 'quarter'), n('E', 5, 'quarter'), n('F#', 5, 'quarter'), n('G', 5, 'quarter'),
    n('A', 5, 'quarter'), n('G', 5, 'quarter'), n('F#', 5, 'quarter'), n('E', 5, 'quarter'),
    n('D', 5, 'whole'),
  ],
};

const aroundTheWorld: PresetSong = {
  id: 'around-the-world',
  title: 'Around the World (Electronic)',
  category: 'Mixed Genres',
  tempo: 121,
  notes: [
    n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('E', 5, 'eighth'), n('G', 5, 'eighth'),
    n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('E', 5, 'eighth'), n('G', 5, 'eighth'),
    n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('E', 5, 'eighth'), n('G', 5, 'eighth'),
    n('A', 5, 'eighth'), n('G', 5, 'eighth'), n('E', 5, 'eighth'), n('G', 5, 'eighth'),
    n('F', 5, 'eighth'), n('E', 5, 'eighth'), n('C', 5, 'eighth'), n('E', 5, 'eighth'),
    n('F', 5, 'eighth'), n('E', 5, 'eighth'), n('C', 5, 'eighth'), n('E', 5, 'eighth'),
    n('G', 5, 'eighth'), n('F', 5, 'eighth'), n('D', 5, 'eighth'), n('F', 5, 'eighth'),
    n('G', 5, 'eighth'), n('F', 5, 'eighth'), n('D', 5, 'eighth'), n('F', 5, 'eighth'),
  ],
};

// ─── Exports ──────────────────────────────────────────────────────────────────

export const ALL_PRESET_SONGS: PresetSong[] = [
  twinkleTwinkle,
  happyBirthday,
  maryHadALittleLamb,
  zeldasLullaby,
  marioUnderground,
  tetrisTheme,
  finalFantasyPrelude,
  minecraftSweden,
  megalovania,
  smokeOnTheWater,
  blueDaBaDee,
  riversOfBabylon,
  gasolina,
  wonderwall,
  aroundTheWorld,
];

export const SONGS_BY_CATEGORY: Record<SongCategory, PresetSong[]> = {
  'Classic Folk': ALL_PRESET_SONGS.filter((s) => s.category === 'Classic Folk'),
  'Video Games': ALL_PRESET_SONGS.filter((s) => s.category === 'Video Games'),
  'Mixed Genres': ALL_PRESET_SONGS.filter((s) => s.category === 'Mixed Genres'),
};

export const CATEGORY_ICONS: Record<SongCategory, string> = {
  'Classic Folk': '🎵',
  'Video Games': '🎮',
  'Mixed Genres': '🎸',
};
