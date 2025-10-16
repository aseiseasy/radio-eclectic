import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Music, Users, Settings, LogOut, Moon, Sun, AlertCircle, Download } from 'lucide-react';

const RadioEclecticApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState('songs');
  const [user, setUser] = useState(null);
  const [songs, setSongs] = useState([
    {
      id: 1,
      name: '6th Avenue Heartache',
      artist: 'Wallflowers',
      originalKey: 'F',
      treKey: 'A',
      originalTempo: 80,
      treTempo: 80,
      active: 'Y',
      singer: 'Mark',
      leadGuitar: 'Acoustic',
      voxDifficulty: 1,
      confidence: 4.75
    }
  ]);
  const [setlists, setSetlists] = useState([]);
  const [editingSong, setEditingSong] = useState(null);
  const [filterActive, setFilterActive] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [generatorSettings, setGeneratorSettings] = useState({
    numSets: 2,
    songsPerSet: 8
  });

  const bandMembers = [
    { name: 'Kevin Sherlock', email: 'aseiseasy@gmail.com', instrument: 'Drums' },
    { name: 'Mark Cover', email: 'cover4skers@gmail.com', instrument: 'Guitar' },
    { name: 'Ward Reesman', email: 'hinrees@aol.com', instrument: 'Electric Guitar' },
    { name: 'Matt Donelan', email: 'matthewbdonelan@gmail.com', instrument: 'Bass' }
  ];

  const handleSelectMember = (memberEmail) => {
    const member = bandMembers.find(m => m.email === memberEmail);
    setUser(member);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('songs');
  };

  const handleSaveSong = (song) => {
    try {
      setError('');
      if (song.id) {
        setSongs(songs.map(s => s.id === song.id ? song : s));
      } else {
        setSongs([...songs, { ...song, id: Date.now() }]);
      }
      setEditingSong(null);
    } catch (err) {
      setError('Failed to save song: ' + err.message);
    }
  };

  const handleDeleteSong = (id) => {
    if (window.confirm('Are you sure you want to delete this song?')) {
      try {
        setError('');
        setSongs(songs.filter(s => s.id !== id));
      } catch (err) {
        setError('Failed to delete song: ' + err.message);
      }
    }
  };

  const filteredSongs = songs.filter(song => {
    const matchesFilter = filterActive === 'all' || song.active === filterActive;
    const matchesSearch = song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         song.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const generateSetlist = () => {
    try {
      setError('');
      const activeSongs = songs.filter(s => s.active === 'Y');
      if (activeSongs.length === 0) {
        setError('No active songs available to generate setlist');
        return;
      }

      const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);
      const shuffled = shuffle(activeSongs);
      
      const setlistData = {
        id: Date.now(),
        name: `Gig ${new Date().toLocaleDateString()}`,
        date: new Date().toISOString().split('T')[0],
        createdBy: user.name,
        createdAt: new Date(),
        sets: []
      };

      let songIndex = 0;
      for (let i = 0; i < generatorSettings.numSets; i++) {
        const setSongs = [];
        for (let j = 0; j < generatorSettings.songsPerSet; j++) {
          if (songIndex < shuffled.length) {
            setSongs.push({
              id: shuffled[songIndex].id,
              name: shuffled[songIndex].name,
              artist: shuffled[songIndex].artist,
              singer: shuffled[songIndex].singer
            });
            songIndex++;
          }
        }
        if (setSongs.length > 0) setlistData.sets.push(setSongs);
      }

      setSetlists([...setlists, setlistData]);
      setCurrentView('setlists');
    } catch (err) {
      setError('Failed to generate setlist: ' + err.message);
    }
  };

  const handleDeleteSetlist = (id) => {
    if (window.confirm('Delete this setlist?')) {
      setSetlists(setlists.filter(s => s.id !== id));
    }
  };

  const handleBulkImport = (importedSongs) => {
    setSongs([...songs, ...importedSongs]);
  };

  const bgColor = darkMode ? 'bg-gray-900' : 'bg-white';
  const textColor = darkMode ? 'text-white' : 'text-gray-900';
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

  if (!user) {
    return (
      <div className={`min-h-screen ${bgColor} ${textColor} flex items-center justify-center p-4`}>
        <div className={`${cardBg} p-12 rounded-lg shadow-lg max-w-md w-full border ${borderColor}`}>
          <h1 className="text-4xl font-bold mb-2 text-center">🎵</h1>
          <h2 className="text-2xl font-bold mb-2 text-center">The Radio Eclectic</h2>
          <p className="text-center mb-8 opacity-75">Band Manager</p>
          
          <div className="space-y-3">
            {bandMembers.map(member => (
              <button
                key={member.email}
                onClick={() => handleSelectMember(member.email)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
              >
                {member.name}
              </button>
            ))}
          </div>
          
          <p className="text-xs text-center mt-6 opacity-60">
            Select your name to log in
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bgColor} ${textColor}`}>
      <header className={`${cardBg} border-b ${borderColor} sticky top-0 z-50`}>
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">🎵 The Radio Eclectic</h1>
            <p className="text-sm opacity-75">{user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:opacity-75 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition text-white"
            >
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-100 border-b border-red-400 text-red-700 px-4 py-3 flex items-start gap-2">
          <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={() => setError('')} className="text-red-700 font-bold">✕</button>
        </div>
      )}

      <nav className={`${cardBg} border-b ${borderColor}`}>
        <div className="max-w-7xl mx-auto px-4 flex gap-2 py-4 overflow-x-auto">
          <button
            onClick={() => setCurrentView('songs')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              currentView === 'songs' 
                ? 'bg-blue-600 text-white' 
                : 'hover:opacity-75'
            }`}
          >
            <Music size={18} /> Master Songs
          </button>
          <button
            onClick={() => setCurrentView('setlists')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              currentView === 'setlists' 
                ? 'bg-blue-600 text-white' 
                : 'hover:opacity-75'
            }`}
          >
            <Users size={18} /> Setlists
          </button>
          <button
            onClick={() => setCurrentView('generator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              currentView === 'generator' 
                ? 'bg-blue-600 text-white' 
                : 'hover:opacity-75'
            }`}
          >
            <Settings size={18} /> Generator
          </button>
          <button
            onClick={() => setCurrentView('import')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
              currentView === 'import' 
                ? 'bg-blue-600 text-white' 
                : 'hover:opacity-75'
            }`}
          >
            <Download size={18} /> Bulk Import
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {currentView === 'songs' && (
          <SongsView 
            songs={filteredSongs}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterActive={filterActive}
            setFilterActive={setFilterActive}
            editingSong={editingSong}
            setEditingSong={setEditingSong}
            onSaveSong={handleSaveSong}
            onDeleteSong={handleDeleteSong}
            bandMembers={bandMembers}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            inputBg={inputBg}
          />
        )}

        {currentView === 'setlists' && (
          <SetlistsView 
            setlists={setlists}
            onDeleteSetlist={handleDeleteSetlist}
            cardBg={cardBg}
            borderColor={borderColor}
            darkMode={darkMode}
          />
        )}

        {currentView === 'generator' && (
          <GeneratorView 
            generatorSettings={generatorSettings}
            setGeneratorSettings={setGeneratorSettings}
            songs={songs}
            onGenerate={generateSetlist}
            cardBg={cardBg}
            borderColor={borderColor}
            inputBg={inputBg}
          />
        )}

        {currentView === 'import' && (
          <BulkImportView 
            songs={songs}
            onImport={handleBulkImport}
            darkMode={darkMode}
            cardBg={cardBg}
            borderColor={borderColor}
            inputBg={inputBg}
          />
        )}
      </main>
    </div>
  );
};

const SongsView = ({ songs, searchTerm, setSearchTerm, filterActive, setFilterActive, editingSong, setEditingSong, onSaveSong, onDeleteSong, bandMembers, darkMode, cardBg, borderColor, inputBg }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Master Song List</h2>
        <button
          onClick={() => setEditingSong({})}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg transition text-white font-semibold"
        >
          <Plus size={18} /> Add Song
        </button>
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search songs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`flex-1 min-w-48 px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <select
          value={filterActive}
          onChange={(e) => setFilterActive(e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        >
          <option value="all">All Songs</option>
          <option value="Y">Active</option>
          <option value="N">Inactive</option>
        </select>
      </div>

      {editingSong && (
        <SongForm
          song={editingSong}
          members={bandMembers}
          onSave={onSaveSong}
          onCancel={() => setEditingSong(null)}
          darkMode={darkMode}
        />
      )}

      <div className={`${cardBg} rounded-lg overflow-hidden border ${borderColor}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={`${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              <tr>
                <th className="px-4 py-3 text-left">Song</th>
                <th className="px-4 py-3 text-left">Artist</th>
                <th className="px-4 py-3 text-left">Singer</th>
                <th className="px-4 py-3 text-left">Key</th>
                <th className="px-4 py-3 text-left">BPM</th>
                <th className="px-4 py-3 text-left">Star</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {songs.map(song => (
                <tr key={song.id} className={`border-t ${borderColor} hover:opacity-75`}>
                  <td className="px-4 py-3 font-semibold">{song.name}</td>
                  <td className="px-4 py-3">{song.artist}</td>
                  <td className="px-4 py-3">{song.singer}</td>
                  <td className="px-4 py-3">{song.treKey}</td>
                  <td className="px-4 py-3">{song.treTempo}</td>
                  <td className="px-4 py-3">{song.confidence}</td>
                  <td className="px-4 py-3 text-center flex justify-center gap-2">
                    <button
                      onClick={() => setEditingSong(song)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => onDeleteSong(song.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-75">Total: {songs.length} songs</p>
    </div>
  );
};

const SetlistsView = ({ setlists, onDeleteSetlist, cardBg, borderColor, darkMode }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Setlists</h2>
      <div className="grid gap-6">
        {setlists.length === 0 ? (
          <div className={`${cardBg} rounded-lg p-8 border ${borderColor} text-center opacity-75`}>
            <p>No setlists yet. Generate one using the Generator tab.</p>
          </div>
        ) : (
          setlists.map(setlist => (
            <div key={setlist.id} className={`${cardBg} rounded-lg p-6 border ${borderColor}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{setlist.name}</h3>
                  <p className="text-sm opacity-75">Created by {setlist.createdBy}</p>
                </div>
                <button
                  onClick={() => onDeleteSetlist(setlist.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              {setlist.sets?.map((set, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="font-semibold mb-3 text-lg">Set {idx + 1}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {set.map((song, songIdx) => (
                      <div key={songIdx} className={`${darkMode ? 'bg-gray-700' : 'bg-gray-100'} p-3 rounded`}>
                        <div className="font-semibold">{songIdx + 1}. {song.name}</div>
                        <div className="text-sm opacity-75">{song.artist}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const GeneratorView = ({ generatorSettings, setGeneratorSettings, songs, onGenerate, cardBg, borderColor, inputBg }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Setlist Generator</h2>
      <div className={`${cardBg} rounded-lg p-8 border ${borderColor} max-w-md`}>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-3">Number of Sets</label>
            <input
              type="number"
              min="1"
              max="5"
              value={generatorSettings.numSets}
              onChange={(e) => setGeneratorSettings({
                ...generatorSettings,
                numSets: Math.max(1, parseInt(e.target.value) || 1)
              })}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3">Songs Per Set</label>
            <input
              type="number"
              min="1"
              max="20"
              value={generatorSettings.songsPerSet}
              onChange={(e) => setGeneratorSettings({
                ...generatorSettings,
                songsPerSet: Math.max(1, parseInt(e.target.value) || 1)
              })}
              className={`w-full px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
            />
          </div>
          <button
            onClick={onGenerate}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Generate Setlist
          </button>
        </div>
        <p className="text-sm opacity-75 mt-6">
          Active songs available: {songs.filter(s => s.active === 'Y').length}
        </p>
      </div>
    </div>
  );
};

const SongForm = ({ song, members, onSave, onCancel, darkMode }) => {
  const [formData, setFormData] = useState(song || {});
  const cardBg = darkMode ? 'bg-gray-800' : 'bg-gray-50';
  const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
  const inputBg = darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900';

  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = () => {
    if (formData.name && formData.artist) {
      onSave(formData);
    }
  };

  return (
    <div className={`${cardBg} rounded-lg p-6 border ${borderColor} mb-6`}>
      <h3 className="text-xl font-bold mb-6">{song.id ? 'Edit Song' : 'Add New Song'}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Song Name"
          value={formData.name || ''}
          onChange={(e) => handleChange('name', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="text"
          placeholder="Artist"
          value={formData.artist || ''}
          onChange={(e) => handleChange('artist', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="text"
          placeholder="Original Key"
          value={formData.originalKey || ''}
          onChange={(e) => handleChange('originalKey', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="text"
          placeholder="TRE Key"
          value={formData.treKey || ''}
          onChange={(e) => handleChange('treKey', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="number"
          placeholder="Original Tempo"
          value={formData.originalTempo || ''}
          onChange={(e) => handleChange('originalTempo', parseInt(e.target.value) || '')}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="number"
          placeholder="TRE Tempo"
          value={formData.treTempo || ''}
          onChange={(e) => handleChange('treTempo', parseInt(e.target.value) || '')}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <select
          value={formData.active || 'Y'}
          onChange={(e) => handleChange('active', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        >
          <option value="Y">Active</option>
          <option value="N">Inactive</option>
        </select>
        <select
          value={formData.singer || ''}
          onChange={(e) => handleChange('singer', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        >
          <option value="">Select Singer</option>
          {members.map(m => (
            <option key={m.name} value={m.name}>{m.name}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Confidence (1-5)"
          min="1"
          max="5"
          step="0.25"
          value={formData.confidence || ''}
          onChange={(e) => handleChange('confidence', parseFloat(e.target.value) || '')}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="number"
          placeholder="Difficulty (1-3)"
          min="1"
          max="3"
          value={formData.voxDifficulty || ''}
          onChange={(e) => handleChange('voxDifficulty', parseInt(e.target.value) || '')}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="text"
          placeholder="Lead Guitar"
          value={formData.leadGuitar || ''}
          onChange={(e) => handleChange('leadGuitar', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
        <input
          type="text"
          placeholder="YouTube Link"
          value={formData.youtubeLink || ''}
          onChange={(e) => handleChange('youtubeLink', e.target.value)}
          className={`px-4 py-2 rounded-lg border ${borderColor} ${inputBg}`}
        />
      </div>
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const BulkImportView = ({ songs, onImport, darkMode, cardBg, borderColor, inputBg }) => {
  const [importData, setImportData] = useState('');
  const [preview, setPreview] = useState([]);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState('');

  const handlePaste = (e) => {
    const text = e.target.value;
    setImportData(text);
    
    if (text.trim()) {
      const lines = text.split('\n');
      const headers = lines[0].split('\t');
      const headerMap = {};
      headers.forEach((h, i) => {
        headerMap[h.trim()] = i;
      });

      const parsed = [];
      for (let i = 1; i < lines.length && parsed.length < 5; i++) {
        if (lines[i].trim()) {
          const cols = lines[i].split('\t');
          parsed.push({
            name: (cols[headerMap['SongName']] || '').trim(),
            artist: (cols[headerMap['Artist']] || '').trim(),
            active: (cols[headerMap['SongActive']] || 'Y').trim().toUpperCase(),
            singer: (cols[headerMap['Singer']] || '').trim(),
            confidence: (cols[headerMap['TREConfidence']] || '').trim()
          });
        }
      }
      setPreview(parsed);
    }
  };

  const handleImport = () => {
    if (!importData.trim()) {
      setImportMessage('Please paste data first');
      return;
    }

    setImporting(true);
    setImportMessage('');

    try {
      const lines = importData.split('\n');
      const headers = lines[0].split('\t');
      const headerMap = {};
      headers.forEach((h, i) => {
        headerMap[h.trim()] = i;
      });

      const importedSongs = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;

        const cols = lines[i].split('\t');
        const song = {
          id: Date.now() + i,
          name: (cols[headerMap['SongName']] || '').trim(),
          artist: (cols[headerMap['Artist']] || '').trim(),
          active: ((cols[headerMap['SongActive']] || 'Y').trim()).toUpperCase(),
          singer: (cols[headerMap['Singer']] || '').trim(),
          originalKey: (cols[headerMap['SongKey']] || '').trim(),
          treKey: (cols[headerMap['SongKey']] || '').trim(),
          originalTempo: parseInt(cols[headerMap['SongBPM']] || 0) || 0,
          treTempo: parseInt(cols[headerMap['SongBPM']] || 0) || 0,
          voxDifficulty: parseInt(cols[headerMap['VoxDifficulty']] || 1) || 1,
          confidence: parseFloat(cols[headerMap['TREConfidence']] || 0) || 0,
          leadGuitar: (cols[headerMap['MarkGuitar']] || '').trim(),
          youtubeLink: (cols[headerMap['SongLink_Artist']] || '').trim()
        };

        if (song.name && song.artist) {
          importedSongs.push(song);
        }
      }

      if (importedSongs.length > 0) {
        onImport(importedSongs);
        setImportMessage('Successfully imported ' + importedSongs.length + ' songs');
        setImportData('');
        setPreview([]);
      } else {
        setImportMessage('No valid songs found to import');
      }
    } catch (err) {
      setImportMessage('Error: ' + err.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Bulk Import Songs</h2>
      
      <div className={cardBg + ' rounded-lg p-6 border ' + borderColor + ' mb-6'}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm opacity-75">
            <li>Copy all data from your Google Sheet (including headers)</li>
            <li>Paste it in the textarea below</li>
            <li>Review the preview (first 5 rows)</li>
            <li>Click Import All to add to your song list</li>
          </ol>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold mb-2">Paste Your Data Here:</label>
          <textarea
            value={importData}
            onChange={handlePaste}
            placeholder="Paste tab-separated data from your Google Sheet..."
            className={`w-full h-48 px-4 py-2 rounded-lg border ${borderColor} ${inputBg} font-mono text-sm`}
          />
        </div>

        {importMessage && (
          <div className={`p-4 rounded-lg mb-4 ${
            importMessage.includes('Successfully') 
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}>
            {importMessage}
          </div>
        )}

        {preview.length > 0 && (
          <div className="mb-6">
            <h4 className="font-semibold mb-3 text-sm">Preview (first {preview.length} rows):</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className={darkMode ? 'bg-gray-700' : 'bg-gray-200'}>
                  <tr>
                    <th className="px-2 py-2 text-left">Song</th>
                    <th className="px-2 py-2 text-left">Artist</th>
                    <th className="px-2 py-2 text-left">Singer</th>
                    <th className="px-2 py-2 text-left">Star</th>
                    <th className="px-2 py-2 text-left">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map((song, idx) => (
                    <tr key={idx} className={`border-t ${borderColor}`}>
                      <td className="px-2 py-2">{song.name}</td>
                      <td className="px-2 py-2">{song.artist}</td>
                      <td className="px-2 py-2">{song.singer}</td>
                      <td className="px-2 py-2">{song.confidence}</td>
                      <td className="px-2 py-2">{song.active}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handleImport}
            disabled={importing || preview.length === 0}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            {importing ? 'Importing...' : 'Import All'}
          </button>
          <button
            onClick={() => {
              setImportData('');
              setPreview([]);
              setImportMessage('');
            }}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Clear
          </button>
        </div>
      </div>

      <div className={cardBg + ' rounded-lg p-6 border ' + borderColor}>
        <h3 className="font-semibold mb-3">Current Database:</h3>
        <p className="text-sm opacity-75 mb-2">Total songs: {songs.length}</p>
        <p className="text-sm opacity-75">Active songs: {songs.filter(s => s.active === 'Y').length}</p>
      </div>
    </div>
  );
};

export default RadioEclecticApp;
