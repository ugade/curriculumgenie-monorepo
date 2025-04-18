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
const docTypes = [
  'Unit Planner',
  'Lesson Plan',
  'Assessment Task',
  'Quiz',
  'Scope and Sequence',
  'Knowledge & Skills',
  'Assessment Matrix',
  'Term Planner',
  'Assessment Planner',
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
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">CurriculumGenie</h1>

      <h2 className="text-xl font-semibold mb-4">Step 1: Select Curriculum Filters</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <select value={yearLevel} onChange={e => setYearLevel(e.target.value)} className="p-2 border rounded">
          <option value="">Year Level</option>
          {yearLevels.map(level => <option key={level}>{level}</option>)}
        </select>

        <select value={strand} onChange={e => setStrand(e.target.value)} className="p-2 border rounded">
          <option value="">Strand</option>
          {strands.map(s => <option key={s}>{s}</option>)}
        </select>

        <input
          type="text"
          placeholder="Content Descriptions"
          value={contentDesc}
          onChange={e => setContentDesc(e.target.value)}
          className="p-2 border rounded"
        />
      </div>

      <h2 className="text-xl font-semibold mb-4">Step 2: Choose Document Type</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {docTypes.map(type => (
          <button
            key={type}
            className={`flex flex-col items-center justify-center border rounded-lg p-4 text-center shadow hover:shadow-md ${
              docType === type ? 'bg-gray-200 border-blue-500' : 'bg-white'
            }`}
            onClick={() => setDocType(type)}
          >
            <span className="text-3xl">📄</span>
            <span className="mt-2 font-medium">{type}</span>
          </button>
        ))}
      </div>

      <h2 className="text-xl font-semibold mb-2">Step 3: Generate</h2>
      <button onClick={handleGenerate} className="mb-6 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Generate Document
      </button>

      {generatedHTML && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Step 4: Edit & Export</h2>
          <ReactQuill theme="snow" value={generatedHTML} onChange={setGeneratedHTML} className="mb-4" />

          <div className="flex flex-wrap gap-4 mb-10">
            <button onClick={() => exportToWord(generatedHTML)} className="px-4 py-2 bg-green-600 text-white rounded">
              Export to Word
            </button>
            <button onClick={() => exportToPDF('generated-editor')} className="px-4 py-2 bg-red-600 text-white rounded">
              Export to PDF
            </button>
            <button onClick={handleSave} className="px-4 py-2 bg-gray-600 text-white rounded">
              Save to My Library
            </button>
          </div>

          <div id="generated-editor" dangerouslySetInnerHTML={{ __html: generatedHTML }} className="hidden" />
        </div>
      )}

      {savedDocs.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold mb-2">My Library</h2>
          <ul className="space-y-4">
            {savedDocs.map(doc => (
              <li key={doc.id} className="p-4 bg-white border rounded shadow">
                <strong>{doc.title}</strong>
                <div dangerouslySetInnerHTML={{ __html: doc.content }} className="mt-2 text-sm" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
