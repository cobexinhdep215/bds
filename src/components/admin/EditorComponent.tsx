'use client';
import React, { useRef } from 'react';
import JoditEditor from 'jodit-react';

export default function EditorComponent({ value, onChange }: { value: string, onChange: (val: string) => void }) {
	const editor = useRef(null);
	
	const config: any = {
		readonly: false,
        height: 400,
        placeholder: "Bắt đầu viết...",
        askBeforePasteHTML: false,
        askBeforePasteFromWord: false,
        defaultActionOnPaste: "insert_clear_html",
        uploader: { insertImageAsBase64URI: true }
	};

	return (
        <div className="jodit-wrapper">
            <JoditEditor
                ref={editor}
                value={value || ''}
                config={config}
                onBlur={newContent => onChange(newContent)}
                onChange={newContent => {}}
            />
            <style jsx global>{`
                .jodit-wrapper .jodit-container { 
                    border-radius: 8px !important; 
                    overflow: hidden; 
                    border: 1px solid #e2e8f0 !important; 
                    font-family: inherit !important;
                }
                .jodit-wrapper .jodit-toolbar__box { 
                    background: #f8fafc !important; 
                    border-bottom: 1px solid #e2e8f0 !important; 
                }
                .jodit-wrapper .jodit-wysiwyg p {
                    font-size: 1.15rem;
                    line-height: 1.6;
                }
            `}</style>
        </div>
	);
}
