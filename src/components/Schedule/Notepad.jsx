import { useEffect, useRef } from 'react';
import { Bold, Italic, Underline, Text } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import useLocalStorage from '../../hooks/useLocalStorage';
import './Schedule.css';

const Notepad = () => {
  const [notesHtml, setNotesHtml] = useLocalStorage('notepadContent', '');
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== notesHtml) {
      editorRef.current.innerHTML = notesHtml;
    }
  }, [notesHtml]);

  const applyFormat = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
  };

  const applyBlock = (tag) => {
    applyFormat('formatBlock', tag);
  };

  const handleInput = () => {
    if (editorRef.current) {
      setNotesHtml(editorRef.current.innerHTML);
    }
  };

  return (
    <Card className="notepad-card" title="Notepad" icon={Text}>
      <div className="notepad-toolbar">
        <Button variant="ghost" size="sm" icon={Bold} onClick={() => applyFormat('bold')} aria-label="Bold" />
        <Button variant="ghost" size="sm" icon={Italic} onClick={() => applyFormat('italic')} aria-label="Italic" />
        <Button variant="ghost" size="sm" icon={Underline} onClick={() => applyFormat('underline')} aria-label="Underline" />
        <div className="notepad-size-toggle">
          <button type="button" onClick={() => applyBlock('H3')}>Heading</button>
          <button type="button" onClick={() => applyBlock('H4')}>Subheading</button>
          <button type="button" onClick={() => applyBlock('P')}>Body</button>
          <button type="button" onClick={() => applyBlock('PRE')}>Monospace</button>
        </div>
      </div>
      <div
        ref={editorRef}
        className="notepad-editor"
        contentEditable
        onInput={handleInput}
        data-placeholder="Type your notes here..."
        spellCheck
      />
    </Card>
  );
};

export default Notepad;
