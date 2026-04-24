'use client';
import React, { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagsInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
}

export default function TagsInput({ tags, onChange }: TagsInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = inputValue.trim().replace(/^,+|,+$/g, '');
      if (newTag && !tags.includes(newTag)) {
        onChange([...tags, newTag]);
      }
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="tags-input-container">
      <div className="tags-list">
        {tags.map((tag, index) => (
          <span key={index} className="tag-chip">
            {tag}
            <button type="button" onClick={() => removeTag(tag)}><X size={12} /></button>
          </span>
        ))}
        <input
          type="text"
          placeholder={tags.length === 0 ? "Nhập tag và Enter..." : "Thêm tag..."}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="tag-input"
        />
      </div>
      <style jsx>{`
        .tags-input-container {
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 6px;
          background: #fff;
          transition: 0.2s;
        }
        .tags-input-container:focus-within {
          border-color: #005B4B;
        }
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          align-items: center;
        }
        .tag-chip {
          background: #f0fdf9;
          color: #005B4B;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .tag-chip button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          color: #005B4B;
          background: transparent;
          cursor: pointer;
          border-radius: 50%;
          opacity: 0.7;
          border: none;
        }
        .tag-chip button:hover {
          opacity: 1;
        }
        .tag-input {
          flex: 1;
          min-width: 120px;
          border: none;
          outline: none;
          padding: 4px;
          font-size: 0.9rem;
          background: transparent;
        }
      `}</style>
    </div>
  );
}
