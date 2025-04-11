
import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Heading from '@tiptap/extension-heading';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Quote,
  Undo,
  Redo,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import FormField from './FormField';

interface RichTextEditorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  description?: string;
  error?: string;
}

const RichTextEditor = ({
  label,
  value,
  onChange,
  placeholder = 'Start typing...',
  required = false,
  description,
  error,
}: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-form-purple underline',
        },
      }),
      Image,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    content: value || '',
    editorProps: {
      attributes: {
        class: 'outline-none tiptap-content p-3 min-h-[150px]',
        'data-placeholder': placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Insert link dialog
  const [linkUrl, setLinkUrl] = React.useState('');
  const [showLinkDialog, setShowLinkDialog] = React.useState(false);

  const setLink = () => {
    if (!linkUrl) return;
    
    if (editor) {
      // Using the correct method to set a link in TipTap
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
    }
    
    setLinkUrl('');
    setShowLinkDialog(false);
  };

  // Insert image dialog
  const [imageUrl, setImageUrl] = React.useState('');
  const [showImageDialog, setShowImageDialog] = React.useState(false);

  const insertImage = () => {
    if (!imageUrl) return;
    
    if (editor) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl })
        .run();
    }
    
    setImageUrl('');
    setShowImageDialog(false);
  };

  if (!editor) {
    return null;
  }

  return (
    <FormField 
      label={label} 
      required={required}
      description={description}
      error={error}
    >
      <div className={cn(
        "border rounded-md overflow-hidden",
        error ? "border-form-red" : "border-border"
      )}>
        <div className="tiptap-toolbar bg-gray-50">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={cn("tiptap-toolbar-button", editor.isActive('bold') && "is-active")}
            aria-label="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={cn("tiptap-toolbar-button", editor.isActive('italic') && "is-active")}
            aria-label="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.toggleMark('underline')}
            className={cn("tiptap-toolbar-button", editor.isActive('underline') && "is-active")}
            aria-label="Underline"
          >
            <UnderlineIcon size={16} />
          </button>
          
          <span className="mx-1 text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={cn("tiptap-toolbar-button", editor.isActive('heading', { level: 1 }) && "is-active")}
            aria-label="Heading 1"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={cn("tiptap-toolbar-button", editor.isActive('heading', { level: 2 }) && "is-active")}
            aria-label="Heading 2"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={cn("tiptap-toolbar-button", editor.isActive('heading', { level: 3 }) && "is-active")}
            aria-label="Heading 3"
          >
            <Heading3 size={16} />
          </button>
          
          <span className="mx-1 text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={cn("tiptap-toolbar-button", editor.isActive('bulletList') && "is-active")}
            aria-label="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={cn("tiptap-toolbar-button", editor.isActive('orderedList') && "is-active")}
            aria-label="Ordered List"
          >
            <ListOrdered size={16} />
          </button>
          
          <span className="mx-1 text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => editor.commands.setTextAlign('left')}
            className={cn("tiptap-toolbar-button", editor.isActive({ textAlign: 'left' }) && "is-active")}
            aria-label="Align Left"
          >
            <AlignLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.setTextAlign('center')}
            className={cn("tiptap-toolbar-button", editor.isActive({ textAlign: 'center' }) && "is-active")}
            aria-label="Align Center"
          >
            <AlignCenter size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.setTextAlign('right')}
            className={cn("tiptap-toolbar-button", editor.isActive({ textAlign: 'right' }) && "is-active")}
            aria-label="Align Right"
          >
            <AlignRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.commands.setTextAlign('justify')}
            className={cn("tiptap-toolbar-button", editor.isActive({ textAlign: 'justify' }) && "is-active")}
            aria-label="Justify"
          >
            <AlignJustify size={16} />
          </button>
          
          <span className="mx-1 text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => setShowLinkDialog(true)}
            className={cn("tiptap-toolbar-button", editor.isActive('link') && "is-active")}
            aria-label="Insert Link"
          >
            <LinkIcon size={16} />
          </button>
          <button
            type="button"
            onClick={() => setShowImageDialog(true)}
            className="tiptap-toolbar-button"
            aria-label="Insert Image"
          >
            <ImageIcon size={16} />
          </button>
          
          <span className="mx-1 text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={cn("tiptap-toolbar-button", editor.isActive('codeBlock') && "is-active")}
            aria-label="Code Block"
          >
            <Code size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={cn("tiptap-toolbar-button", editor.isActive('blockquote') && "is-active")}
            aria-label="Blockquote"
          >
            <Quote size={16} />
          </button>
          
          <span className="mx-1 text-gray-300">|</span>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="tiptap-toolbar-button"
            aria-label="Undo"
          >
            <Undo size={16} />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="tiptap-toolbar-button"
            aria-label="Redo"
          >
            <Redo size={16} />
          </button>
        </div>
        
        <EditorContent editor={editor} />
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-medium mb-3">Insert Link</h3>
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full p-2 border rounded mb-3"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowLinkDialog(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={setLink}
                className="px-3 py-1 bg-form-purple text-white rounded"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-medium mb-3">Insert Image</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full p-2 border rounded mb-3"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowImageDialog(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={insertImage}
                className="px-3 py-1 bg-form-purple text-white rounded"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </FormField>
  );
};

export default RichTextEditor;
