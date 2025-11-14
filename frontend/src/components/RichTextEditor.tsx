import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { useEffect, useRef } from 'react';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Quote,
    Undo,
    Redo,
    Link as LinkIcon,
    Image as ImageIcon,
    AlignLeft,
    AlignCenter,
    AlignRight,
    AlignJustify,
} from 'lucide-react';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
    const imageInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-[#a2e535] underline hover:text-[#a6cf63]',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded-lg',
                },
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Underline,
            TextStyle,
            Color,
        ],
        content: content,
        editorProps: {
            attributes: {
                class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-3',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('Enter URL:', previousUrl || '');

        // Cancelled
        if (url === null) {
            return;
        }

        // Empty string removes the link
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // Update link
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    const addImage = () => {
        imageInputRef.current?.click();
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Check file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Check file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB');
            return;
        }

        // Convert to base64 and insert
        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target?.result as string;
            editor.chain().focus().setImage({ src: base64 }).run();
        };
        reader.readAsDataURL(file);

        // Reset input
        event.target.value = '';
    };

    const ToolbarButton = ({
        onClick,
        isActive = false,
        disabled = false,
        children,
        title
    }: {
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
        children: React.ReactNode;
        title: string;
    }) => (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`p-2 rounded hover:bg-slate-700 transition-colors ${isActive ? 'bg-slate-700 text-[#a2e535]' : 'text-slate-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-slate-700 rounded-lg bg-slate-800/50 overflow-hidden">
            {/* Hidden file input for image upload */}
            <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
            />

            {/* Toolbar */}
            <div className="border-b border-slate-700 p-2 flex flex-wrap gap-1 bg-slate-900/50">
                {/* Text Formatting */}
                <div className="flex gap-1 border-r border-slate-700 pr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        isActive={editor.isActive('bold')}
                        title="Bold (Ctrl+B)"
                    >
                        <Bold size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        isActive={editor.isActive('italic')}
                        title="Italic (Ctrl+I)"
                    >
                        <Italic size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        isActive={editor.isActive('underline')}
                        title="Underline (Ctrl+U)"
                    >
                        <UnderlineIcon size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        isActive={editor.isActive('strike')}
                        title="Strikethrough"
                    >
                        <Strikethrough size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleCode().run()}
                        isActive={editor.isActive('code')}
                        title="Inline Code"
                    >
                        <Code size={18} />
                    </ToolbarButton>
                </div>

                {/* Headings */}
                <div className="flex gap-1 border-r border-slate-700 pr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        isActive={editor.isActive('heading', { level: 1 })}
                        title="Heading 1"
                    >
                        <Heading1 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        isActive={editor.isActive('heading', { level: 2 })}
                        title="Heading 2"
                    >
                        <Heading2 size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        isActive={editor.isActive('heading', { level: 3 })}
                        title="Heading 3"
                    >
                        <Heading3 size={18} />
                    </ToolbarButton>
                </div>

                {/* Lists */}
                <div className="flex gap-1 border-r border-slate-700 pr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        isActive={editor.isActive('bulletList')}
                        title="Bullet List"
                    >
                        <List size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        isActive={editor.isActive('orderedList')}
                        title="Numbered List"
                    >
                        <ListOrdered size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        isActive={editor.isActive('blockquote')}
                        title="Quote"
                    >
                        <Quote size={18} />
                    </ToolbarButton>
                </div>

                {/* Alignment */}
                <div className="flex gap-1 border-r border-slate-700 pr-2">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        isActive={editor.isActive({ textAlign: 'left' })}
                        title="Align Left"
                    >
                        <AlignLeft size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        isActive={editor.isActive({ textAlign: 'center' })}
                        title="Align Center"
                    >
                        <AlignCenter size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        isActive={editor.isActive({ textAlign: 'right' })}
                        title="Align Right"
                    >
                        <AlignRight size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                        isActive={editor.isActive({ textAlign: 'justify' })}
                        title="Justify"
                    >
                        <AlignJustify size={18} />
                    </ToolbarButton>
                </div>

                {/* Link & Image */}
                <div className="flex gap-1 border-r border-slate-700 pr-2">
                    <ToolbarButton
                        onClick={addLink}
                        isActive={editor.isActive('link')}
                        title="Add Link"
                    >
                        <LinkIcon size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={addImage}
                        title="Add Image"
                    >
                        <ImageIcon size={18} />
                    </ToolbarButton>
                </div>

                {/* Undo/Redo */}
                <div className="flex gap-1">
                    <ToolbarButton
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo size={18} />
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo size={18} />
                    </ToolbarButton>
                </div>
            </div>

            {/* Editor Content */}
            <div className="bg-slate-800/50">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
};

export default RichTextEditor;
