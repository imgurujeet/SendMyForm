"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Placeholder } from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Undo2,
  Redo2,
  Link2,
  ImagePlus,
  Table2,
  Minus,
  Code2,
  Variable,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TipTapEditorProps {
  value: string;
  onChange: (html: string, json: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({
  value,
  onChange,
  placeholder = "Write your campaign content here. Select templates or write from scratch...",
}: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-rose-500 underline hover:text-rose-400 transition-colors",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-2xl border border-white/5 my-6 mx-auto block",
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-6 text-sm text-slate-300",
        },
      }),
      TableRow,
      TableCell.configure({
        HTMLAttributes: {
          class: "border border-white/10 p-3 bg-slate-900/40 text-left",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: "border border-white/10 p-3 bg-slate-800/80 font-black uppercase text-xs text-slate-100",
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "before:content-[attr(data-placeholder)] before:text-slate-600 before:float-left before:pointer-events-none before:h-0",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), JSON.stringify(editor.getJSON()));
    },
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[350px] p-6 text-slate-100 text-sm leading-relaxed",
      },
    },
  });

  // Keep editor in sync if value changed externally (e.g. template selection)
  React.useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, false as any);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const { from, to } = editor.state.selection;
    const isTextSelected = from !== to;
    
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // Add protocol helper if missing
    let finalUrl = url.trim();
    if (finalUrl && !/^(https?:\/\/|mailto:|tel:)/i.test(finalUrl)) {
      finalUrl = `https://${finalUrl}`;
    }

    if (!isTextSelected) {
      const text = window.prompt("Enter link text:", "Link");
      if (!text) return;
      editor.chain().focus().insertContent(`<a href="${finalUrl}">${text}</a>`).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink({ href: finalUrl }).run();
    }
  };

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      let finalUrl = url.trim();
      if (finalUrl && !/^(https?:\/\/)/i.test(finalUrl)) {
        finalUrl = `https://${finalUrl}`;
      }
      editor.chain().focus().setImage({ src: finalUrl }).run();
    }
  };

  const insertVariable = (variable: string) => {
    editor.chain().focus().insertContent(variable).run();
  };

  const addTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  const toolbarBtnStyle = (active: boolean) =>
    cn(
      "p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors",
      active && "text-rose-500 bg-rose-500/10 hover:text-rose-400 hover:bg-rose-500/15"
    );

  return (
    <div className="border border-white/5 bg-slate-950/80 backdrop-blur-md rounded-3xl overflow-hidden focus-within:border-rose-500/30 transition-all">
      {/* --- TOOLBAR --- */}
      <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/5 bg-slate-950/50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={toolbarBtnStyle(editor.isActive("bold"))}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={toolbarBtnStyle(editor.isActive("italic"))}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={toolbarBtnStyle(editor.isActive("code"))}
          title="Code Inline"
        >
          <Code2 size={16} />
        </button>
        
        <div className="w-px h-5 bg-white/5 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={toolbarBtnStyle(editor.isActive("heading", { level: 1 }))}
          title="Heading 1"
        >
          <Heading1 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={toolbarBtnStyle(editor.isActive("heading", { level: 2 }))}
          title="Heading 2"
        >
          <Heading2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={toolbarBtnStyle(editor.isActive("blockquote"))}
          title="Blockquote"
        >
          <Quote size={16} />
        </button>

        <div className="w-px h-5 bg-white/5 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={toolbarBtnStyle(editor.isActive("bulletList"))}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={toolbarBtnStyle(editor.isActive("orderedList"))}
          title="Ordered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="w-px h-5 bg-white/5 mx-1" />

        <button
          type="button"
          onClick={setLink}
          className={toolbarBtnStyle(editor.isActive("link"))}
          title="Insert Link"
        >
          <Link2 size={16} />
        </button>
        <button
          type="button"
          onClick={addImage}
          className={toolbarBtnStyle(false)}
          title="Insert Image"
        >
          <ImagePlus size={16} />
        </button>
        <button
          type="button"
          onClick={addTable}
          className={toolbarBtnStyle(editor.isActive("table"))}
          title="Insert Table"
        >
          <Table2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className={toolbarBtnStyle(false)}
          title="Horizontal Rule"
        >
          <Minus size={16} />
        </button>

        <div className="w-px h-5 bg-white/5 mx-1" />

        {/* --- MERGE VARIABLES --- */}
        <div className="relative group/var">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-xs font-bold"
            title="Insert Subscriber variables"
          >
            <Variable size={14} className="text-rose-500" />
            Merge Tags
          </button>
          <div className="absolute left-0 mt-1 hidden group-hover/var:block bg-slate-900 border border-white/5 rounded-2xl shadow-xl p-2 z-50 min-w-[160px]">
            {[
              { label: "Subscriber Name", value: "{{name}}" },
              { label: "Subscriber Email", value: "{{email}}" },
              { label: "Unsubscribe Link", value: "{{unsubscribe_link}}" },
            ].map((v) => (
              <button
                key={v.value}
                type="button"
                onClick={() => insertVariable(v.value)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
              >
                {v.label} <code className="text-rose-500 float-right font-mono ml-2">{v.value}</code>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-2 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
          title="Undo"
        >
          <Undo2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-2 rounded-xl text-slate-500 hover:text-white disabled:opacity-30 disabled:hover:text-slate-500"
          title="Redo"
        >
          <Redo2 size={16} />
        </button>
      </div>

      {/* --- CONTENT AREA --- */}
      <EditorContent editor={editor} />
      
      {/* ProseMirror styling overrides */}
      <style jsx global>{`
        .ProseMirror p {
          margin-bottom: 1rem;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 800;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: white;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #f43f5e;
          padding-left: 1rem;
          font-style: italic;
          color: #94a3b8;
          margin: 1.5rem 0;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror table {
          border-collapse: collapse;
          width: 100%;
          margin: 1.5rem 0;
        }
        .ProseMirror th, .ProseMirror td {
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
        }
        .ProseMirror code {
          background-color: rgba(244, 63, 94, 0.1);
          color: #f43f5e;
          padding: 0.2rem 0.4rem;
          border-radius: 0.375rem;
          font-family: monospace;
          font-size: 0.875rem;
        }
        .ProseMirror pre {
          background-color: #020617;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1rem;
          border-radius: 1rem;
          margin: 1.5rem 0;
          overflow-x: auto;
        }
        .ProseMirror pre code {
          background-color: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
          font-size: inherit;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 1rem;
          margin: 1.5rem 0;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #475569;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </div>
  );
}
