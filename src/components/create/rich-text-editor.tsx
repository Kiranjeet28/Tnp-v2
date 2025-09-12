'use client';
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export type RichTextEditorHandle = {
    getContent: () => string;
    setContent: (content: string) => void;
};

interface RichTextEditorProps {
    onContentChange?: (content: string) => void; // Callback for content changes
    initialContent?: string; // Initial content
    debounceMs?: number; // Debounce delay in milliseconds
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(
    ({ onContentChange, initialContent = '', debounceMs = 300 }, ref) => {
        const editorRef = useRef<HTMLDivElement>(null);
        const quillRef = useRef<Quill | null>(null);
        const debounceRef = useRef<NodeJS.Timeout | null>(null);
        const isInitializedRef = useRef(false);

        useEffect(() => {
            // Prevent multiple initializations
            if (isInitializedRef.current || !editorRef.current) {
                return;
            }

            // Create Quill instance
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['link', 'image'],
                        ['clean'],
                    ],
                },
                placeholder: 'Write something...',
            });

            // Set initial content if provided
            if (initialContent) {
                quillRef.current.root.innerHTML = initialContent;
            }

            // Listen for text changes with debouncing
            const handleTextChange = () => {
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }

                debounceRef.current = setTimeout(() => {
                    if (quillRef.current && onContentChange) {
                        const content = quillRef.current.root.innerHTML;
                        onContentChange(content);
                    }
                }, debounceMs);
            };

            quillRef.current.on('text-change', handleTextChange);
            isInitializedRef.current = true;

            // Cleanup function
            return () => {
                if (debounceRef.current) {
                    clearTimeout(debounceRef.current);
                }
                if (quillRef.current) {
                    quillRef.current.off('text-change', handleTextChange);
                    // Don't destroy the Quill instance here as it might cause issues
                }
            };
        }, []); // Empty dependency array - only run once

        // Handle initial content changes separately
        useEffect(() => {
            if (quillRef.current && isInitializedRef.current && initialContent !== quillRef.current.root.innerHTML) {
                quillRef.current.root.innerHTML = initialContent;
            }
        }, [initialContent]);

        useImperativeHandle(ref, () => ({
            getContent: () => {
                if (quillRef.current) {
                    return quillRef.current.root.innerHTML;
                }
                return '';
            },
            setContent: (content: string) => {
                if (quillRef.current) {
                    quillRef.current.root.innerHTML = content;
                }
            },
        }));

        return (
            <div
                ref={editorRef}
                style={{ height: '300px' }}
                key="quill-editor" // Add a key to help React identify this element
            />
        );
    }
);

RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;