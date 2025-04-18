import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { generateDocument } from '../api';
import { exportToWord, exportToPDF } from '../utils/exportUtils';

const yearLevels = ['Foundation', '1-2', '3-4', '5-6', '7-8', '9-10'];
const strands = [
  'Digital Systems and Security',
  'Data, Information and Privacy',
  'Creating Digital Solutions',
];
const documentTypes = [
  'Unit Planner',
  'Lesson Plan',
  'Rubric',
  'Assessment Task',
  'Quiz',
  'Scope and Sequence',
  'Term Planner',
];

export default function Dashboard() {
  const [yearLevel, setYearLevel] = useState('');
  const [strand, setStrand] = useState('');
  const [contentDesc, setContentDesc] = useState('');
  const [docType, setDocType] = useState('');
  const [generatedHTML, setGeneratedHTML] = useState('');
  const [savedDocs, setSavedDocs] = useState(() => {
    const stored = localStorage.getItem('curriculumLibrary');
    return stored ? JSON.parse(stored) : [];
  });

  const handleGenerate = async () => {
    const prompt = `Create a ${docType} for ${yearLevel} in the '${strand}' strand of the Victorian Digital Technologies Curriculum 2.0, using the following content descriptions: ${contentDesc}. Format it in an editable and printable structure.`;
    const output = await generateDocument(prompt);
    setGeneratedHTML(output.replace(/\n/g, '<br/>'));
  };

  const handleSave = () => {
    const newDoc = {
      id: Date.now(),
      title: `${docType} - ${yearLevel}`,
      content: generatedHTML,
    };
    const updated = [...savedDocs, newDoc];
    setSavedDocs(updated);
    localStorage.setItem('curriculumLibrary', JSON.stringify(updated));
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">CurriculumGenie Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <select value={yearLevel} onChange={e => setYearLevel(e.target.value)}>
          <option value="">Select Year Level</option>
          {yearLevels.map(level => (
            <option key={level}>{level}</option>
          ))}
        </select>

        <select value={strand} onChange={e => setStrand(e.target.value)}>
          <option value="">Select Strand</option>
          {strands.map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>

        <select value={docType} onChange={e => setDocType(e.target.value)}>
          <option value="">Select Document Type</option>
          {documentTypes.map(d => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <textarea
        placeholder="Paste or write the content descriptions here..."
        value={contentDesc}
        onChange={e => setContentDesc(e.target.value)}
        className="w-full h-24 p-2 border rounded"
      />

      <button onClick={handleGenerate} className="px-4 py-2 bg-blue-600 text-white rounded">
        Generate Document
      </button>

      {generatedHTML && (
        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-semibold">Edit Before Export:</h2>
          <ReactQuill theme="snow" value={generatedHTML} onChange={setGeneratedHTML} />

          <div className="flex flex-wrap gap-4 mt-4">
            <button onClick={() => exportToWord(generatedHTML)} className="bg-green-600 text-white px-4 py-2 rounded">
              Export to Word
            </button>
            <button onClick={() => exportToPDF('generated-editor')} className="bg-red-600 text-white px-4 py-2 rounded">
              Export to PDF
            </button>
            <button onClick={handleSave} className="bg-gray-600 text-white px-4 py-2 rounded">
              Save to My Library
            </button>
          </div>

          <div id="generated-editor" dangerouslySetInnerHTML={{ __html: generatedHTML }} className="hidden" />
        </div>
      )}

      {savedDocs.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-2">My Library</h2>
          <ul className="space-y-3">
            {savedDocs.map(doc => (
              <li key={doc.id} className="border p-3 bg-white rounded shadow-sm">
                <strong>{doc.title}</strong>
                <div dangerouslySetInnerHTML={{ __html: doc.content }} className="text-sm mt-2" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
