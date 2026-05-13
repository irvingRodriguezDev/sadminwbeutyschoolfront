import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, ToggleButton, ToggleButtonGroup, Divider } from "@mui/material";
import {
  FormatBold,
  FormatItalic,
  FormatListBulleted,
  FormatListNumbered,
  FormatQuote,
} from "@mui/icons-material";

const TipTapEditor = ({ value, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      // Enviamos el HTML al formData del stepper
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  return (
    <Box
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.23)",
        borderRadius: "12px",
        overflow: "hidden",
        "&:focus-within": {
          borderColor: "#f06292",
          borderWidth: "2px",
        },
      }}
    >
      {/* Barra de Herramientas */}
      <Box
        sx={{
          p: 0.5,
          bgcolor: "#f8f9fa",
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <ToggleButtonGroup size='small' aria-label='text formatting'>
          <ToggleButton
            value='bold'
            selected={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FormatBold fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='italic'
            selected={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FormatItalic fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation='vertical' flexItem />

        <ToggleButtonGroup size='small' aria-label='lists'>
          <ToggleButton
            value='bulletList'
            selected={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FormatListBulleted fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='orderedList'
            selected={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FormatListNumbered fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Divider />

      {/* Área de Texto */}
      <Box
        sx={{
          p: 2,
          minHeight: "150px",
          maxHeight: "300px",
          overflowY: "auto",
          "& .ProseMirror": {
            outline: "none",
            fontFamily: "Roboto, sans-serif",
            fontSize: "1rem",
          },
          "& .ProseMirror p": { margin: "0 0 1em 0" },
          "& .ProseMirror ul, & .ProseMirror ol": { paddingLeft: "1.5em" },
        }}
      >
        <EditorContent editor={editor} />
      </Box>
    </Box>
  );
};

export default TipTapEditor;
