import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import { generateDocument } from '../api';
import { exportToWord, exportToPDF } from '../utils/exportUtils';
export default function Dashboard() {
  const [generatedHTML, setGeneratedHTML] = useState('');
  const handleGenerate = async () => {
    const prompt = 'Example prompt for CurriculumGenie';
    const output = await generateDocument(prompt);
    setGeneratedHTML(output.replace(/\n/g, '<br/>'));
  };
  return (
    <div>
      <button onClick={handleGenerate}>Generate</button>
      <ReactQuill value={generatedHTML} onChange={setGeneratedHTML} />
      <button onClick={() => exportToWord(generatedHTML)}>Word</button>
      <button onClick={() => exportToPDF('editor')}>PDF</button>
      <div id="editor" dangerouslySetInnerHTML={{ __html: generatedHTML }} className="hidden" />
    </div>
  );
}