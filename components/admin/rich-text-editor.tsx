'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading3, 
  Quote, 
  Link as LinkIcon, 
  Eraser 
} from 'lucide-react';

type RichTextEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const MenuButton = ({ 
  onClick, 
  active, 
  disabled, 
  children,
  title 
}: { 
  onClick: () => void; 
  active?: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
  title: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-colors ${
      active 
        ? 'bg-[#ea580c]/20 text-[#ea580c]' 
        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
    } disabled:opacity-30 disabled:cursor-not-allowed`}
  >
    {children}
  </button>
);

export function RichTextEditor({ value, onChange, placeholder = 'Escribe aquí...' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[160px] p-4 text-sm text-white',
      },
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="border border-zinc-800 rounded-xl bg-zinc-950/40 overflow-hidden">
      <div className="flex flex-wrap gap-1 p-2 border-b border-zinc-800 bg-zinc-900/40">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          title="Negrita"
        >
          <Bold size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          title="Cursiva"
        >
          <Italic size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Subtítulo"
        >
          <Heading3 size={16} />
        </MenuButton>
        <div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          title="Lista de viñetas"
        >
          <List size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          title="Lista numerada"
        >
          <ListOrdered size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          title="Cita"
        >
          <Quote size={16} />
        </MenuButton>
        <div className="w-px h-6 bg-zinc-800 mx-1 self-center" />
        <MenuButton
          onClick={setLink}
          active={editor.isActive('link')}
          title="Insertar enlace"
        >
          <LinkIcon size={16} />
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
          title="Limpiar formato"
        >
          <Eraser size={16} />
        </MenuButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
