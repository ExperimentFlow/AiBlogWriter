"use client";

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { TextAlign } from '@tiptap/extension-text-align';
import { Underline } from '@tiptap/extension-underline';
import { Image } from '@tiptap/extension-image';
import { Color } from '@tiptap/extension-color';
import { TextStyle } from '@tiptap/extension-text-style';
import { Highlight } from '@tiptap/extension-highlight';
import { useGallery } from '@/contexts/gallery-context';
import { MediaItem } from '@/types/media';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  Strikethrough, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Palette,
  Highlighter
} from 'lucide-react';

interface EditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
}

const ToolbarButton = ({ 
  onClick, 
  active, 
  children, 
  title 
}: { 
  onClick: () => void; 
  active?: boolean; 
  children: React.ReactNode; 
  title?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`p-2 rounded hover:bg-gray-100 ${active ? 'bg-blue-100 text-blue-600' : 'text-gray-600'}`}
    title={title}
  >
    {children}
  </button>
);

const ToolbarDivider = () => (
  <div className="w-px h-6 bg-gray-300 mx-1" />
);

const ColorPicker = ({ 
  onColorChange, 
  currentColor, 
  title 
}: { 
  onColorChange: (color: string) => void; 
  currentColor?: string; 
  title: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const colors = [
    '#000000', '#434343', '#666666', '#999999', '#b7b7b7', '#cccccc', '#d9d9d9', '#efefef', '#f3f3f3', '#ffffff',
    '#f5222d', '#fa8c16', '#fadb14', '#52c41a', '#13c2c2', '#1890ff', '#722ed1', '#eb2f96',
    '#ff4d4f', '#ff7a45', '#ffa940', '#b7eb8f', '#87e8de', '#91d5ff', '#adc6ff', '#d3adf7',
    '#ffadd2', '#d9f7be', '#bae7ff', '#d6e4ff', '#fff1b8', '#fff2e8', '#f6ffed', '#e6f7ff'
  ];

  return (
    <div className="relative">
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        active={!!currentColor}
        title={title}
      >
        <Palette className="w-4 h-4" />
      </ToolbarButton>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
          <div className="grid grid-cols-10 gap-1 w-64">
            {colors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onColorChange(color);
                  setIsOpen(false);
                }}
                className={`w-6 h-6 rounded border-2 ${
                  currentColor === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const HighlightPicker = ({ 
  onHighlightChange, 
  currentHighlight 
}: { 
  onHighlightChange: (color: string) => void; 
  currentHighlight?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const highlightColors = [
    '#ffeb3b', '#ff9800', '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3',
    '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107'
  ];

  return (
    <div className="relative">
      <ToolbarButton
        onClick={() => setIsOpen(!isOpen)}
        active={!!currentHighlight}
        title="Highlight"
      >
        <Highlighter className="w-4 h-4" />
      </ToolbarButton>
      
      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10">
          <div className="grid grid-cols-8 gap-1 w-48">
            {highlightColors.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => {
                  onHighlightChange(color);
                  setIsOpen(false);
                }}
                className={`w-6 h-6 rounded border-2 ${
                  currentHighlight === color ? 'border-gray-800' : 'border-gray-300'
                }`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default function Editor({ value, onChange, placeholder }: EditorProps) {
  const [isClient, setIsClient] = useState(false);
  const { openGallery, setOnImageSelect } = useGallery();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded',
        },
      }),
    ],
    content: value || '',
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[300px] p-4',
        placeholder: placeholder || 'Start writing...',
      },
    },
  });

  const handleImageSelect = (image: MediaItem) => {
    if (editor && image && image.url) {
      try {
        editor.chain().focus().setImage({ 
          src: image.url, 
          alt: image.alt || image.name 
        }).run();
      } catch (error) {
        console.error('Error inserting image:', error);
      }
    }
  };

  const handleImageButtonClick = () => {
    setOnImageSelect(handleImageSelect);
    openGallery();
  };

  const handleColorChange = (color: string) => {
    if (editor) {
      editor.chain().focus().setColor(color).run();
    }
  };

  const handleHighlightChange = (color: string) => {
    if (editor) {
      editor.chain().focus().toggleHighlight({ color }).run();
    }
  };

  const getCurrentColor = () => {
    if (editor) {
      return editor.getAttributes('textStyle').color;
    }
    return undefined;
  };

  const getCurrentHighlight = () => {
    if (editor) {
      return editor.getAttributes('highlight').color;
    }
    return undefined;
  };

  if (!isClient || !editor) {
    return (
      <div className="border rounded-md min-h-[400px]">
        <div className="border-b p-2 bg-gray-50">
          <div className="flex items-center gap-1">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
        <div className="p-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-md min-h-[400px]">
      {/* Toolbar */}
      <div className="border-b p-2 bg-gray-50">
        <div className="flex items-center gap-1 flex-wrap">
          {/* Text Formatting */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive('underline')}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive('strike')}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive('code')}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Color */}
          <ColorPicker
            onColorChange={handleColorChange}
            currentColor={getCurrentColor()}
            title="Text Color"
          />

          {/* Highlight */}
          <HighlightPicker
            onHighlightChange={handleHighlightChange}
            currentHighlight={getCurrentHighlight()}
          />

          <ToolbarDivider />

          {/* Headings */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setHeading({ level: 1 }).run()}
            active={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setHeading({ level: 2 }).run()}
            active={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setHeading({ level: 3 }).run()}
            active={editor.isActive('heading', { level: 3 })}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Lists */}
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Image Upload */}
          <ToolbarButton
            onClick={handleImageButtonClick}
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </ToolbarButton>

          <ToolbarDivider />

          {/* Text Alignment */}
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            active={editor.isActive({ textAlign: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            active={editor.isActive({ textAlign: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            active={editor.isActive({ textAlign: 'right' })}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            active={editor.isActive({ textAlign: 'justify' })}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
