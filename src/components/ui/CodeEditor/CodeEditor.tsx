import React, { useState, useEffect } from 'react';
import MonacoEditor, { Monaco } from '@monaco-editor/react';
import { FiCopy, FiCheck, FiDownload } from 'react-icons/fi';
import classNames from 'classnames';
import Button from '../Button/Button';
import styles from './CodeEditor.module.css';

export interface CodeEditorProps {
  value: string;
  onChange?: (value: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string | number;
  minHeight?: string | number;
  maxHeight?: string | number;
  showLineNumbers?: boolean;
  theme?: 'light' | 'vs-dark' | 'custom';
  className?: string;
  placeholder?: string;
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  filename?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language = 'python',
  readOnly = false,
  height = '400px',
  minHeight = '200px',
  maxHeight = '600px',
  showLineNumbers = true,
  theme = 'custom',
  className,
  showCopyButton = true,
  showDownloadButton = false,
  filename = 'code.py',
}) => {
  const [copied, setCopied] = useState(false);
  const [editorTheme, setEditorTheme] = useState(theme);

  // Синхронизация темы с приложением
  useEffect(() => {
    const handleThemeChange = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      setEditorTheme(isDark ? 'vs-dark' : 'light');
    };

    handleThemeChange();
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditorDidMount = (_editor: any, monaco: Monaco) => {
    // Кастомная тема для Python (Allure-код)
    monaco.editor.defineTheme('custom', {
      base: editorTheme === 'vs-dark' ? 'vs-dark' : 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: '569CD6' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'decorator', foreground: 'C586C0' },
        { token: 'function', foreground: 'DCDCAA' },
        { token: 'class', foreground: '4EC9B0' },
      ],
      colors: {
        'editor.background': editorTheme === 'vs-dark' ? '#1e1e1e' : '#ffffff',
        'editor.lineNumbers': editorTheme === 'vs-dark' ? '#858585' : '#237893',
        'editor.selectionBackground': editorTheme === 'vs-dark' ? '#264F78' : '#ADD6FF',
      },
    });

    monaco.editor.setTheme('custom');
  };

  const containerClasses = classNames(styles.container, className);

  return (
    <div className={containerClasses}>
      <div className={styles.toolbar}>
        <div className={styles.languageBadge}>
          {language.toUpperCase()}
        </div>
        <div className={styles.actions}>
          {showCopyButton && (
            <Button
              variant="ghost"
              size="small"
              onClick={handleCopy}
              leftIcon={copied ? <FiCheck /> : <FiCopy />}
              className={styles.actionButton}
            >
              {copied ? 'Скопировано' : 'Копировать'}
            </Button>
          )}
          {showDownloadButton && (
            <Button
              variant="ghost"
              size="small"
              onClick={handleDownload}
              leftIcon={<FiDownload />}
              className={styles.actionButton}
            >
              Скачать
            </Button>
          )}
        </div>
      </div>
      
      <div
        className={styles.editorWrapper}
        style={{
          height,
          minHeight,
          maxHeight,
        }}
      >
        <MonacoEditor
          value={value}
          onChange={(value) => onChange?.(value || '')}
          language={language}
          theme="custom"
          options={{
            readOnly,
            minimap: { enabled: false },
            lineNumbers: showLineNumbers ? 'on' : 'off',
            scrollBeyondLastLine: false,
            fontSize: 14,
            wordWrap: 'on',
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
            tabSize: 2,
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            snippetSuggestions: 'inline',
            folding: true,
            foldingHighlight: true,
            showFoldingControls: 'mouseover',
            renderLineHighlight: 'all',
            renderWhitespace: 'boundary',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              useShadows: false,
            },
          }}
          onMount={handleEditorDidMount}
        />
      </div>
    </div>
  );
};

export default CodeEditor;