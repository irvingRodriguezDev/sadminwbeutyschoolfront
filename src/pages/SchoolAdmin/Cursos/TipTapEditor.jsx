import React, { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";

import {
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Divider,
  Select,
  MenuItem,
  IconButton,
  Tooltip,
  Menu,
  Tabs,
  Tab,
} from "@mui/material";

import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
  FormatListBulleted,
  FormatListNumbered,
  InsertLink,
  LinkOff,
  Undo,
  Redo,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  FormatAlignJustify,
  FormatColorText,
  BorderColor,
  InsertEmoticon,
} from "@mui/icons-material";

const EMOJI_CATEGORIES = [
  {
    label: "Gestos",
    emojis: [
      "💅",
      "✨",
      "💖",
      "💋",
      "👑",
      "🎨",
      "🛍️",
      "🎀",
      "⭐",
      "🔥",
      "🙌",
      "🥰",
      "👍",
      "✌️",
    ],
  },
  {
    label: "Caritas",
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
    ],
  },
  {
    label: "Objetos",
    emojis: [
      "📝",
      "📚",
      "🎓",
      "💼",
      "📱",
      "💻",
      "⏰",
      "🔮",
      "💡",
      "📢",
      "🎁",
      "🎈",
      "🏆",
      "📍",
      "🔑",
    ],
  },
];

const TipTapEditor = ({
  value,
  onChange,
  placeholder = "Escribe el temario con estilo...",
}) => {
  const colorInputRef = useRef(null);
  const [anchorElEmoji, setAnchorElEmoji] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const openEmojiMenu = Boolean(anchorElEmoji);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right", "justify"],
        defaultAlignment: "left",
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "tiptap-link" },
      }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Introduce la URL del enlace:", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <Grid
      container
      sx={{
        border: "1px solid rgba(0, 0, 0, 0.15)",
        borderRadius: "16px",
        backgroundColor: "#FFFFFF",
        overflow: "hidden",
        transition: "all 0.3s ease",
        "&:focus-within": {
          borderColor: "#E91E63",
          boxShadow: "0px 0px 0px 2px rgba(233, 30, 99, 0.15)",
        },
      }}
    >
      {/* 1. BARRA DE HERRAMIENTAS */}
      <Grid
        size={12}
        sx={{
          p: 1,
          backgroundColor: "#FAFAFA",
          display: "flex",
          gap: 1,
          flexWrap: "wrap",
          alignItems: "center",
          borderBottom: "1px solid rgba(0, 0, 0, 0.06)",
        }}
      >
        <ToggleButtonGroup size='small'>
          <ToggleButton
            value='undo'
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='redo'
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <Select
          size='small'
          value={
            editor.isActive("heading", { level: 1 })
              ? "h1"
              : editor.isActive("heading", { level: 2 })
                ? "h2"
                : "p"
          }
          onChange={(e) => {
            if (e.target.value === "p")
              editor.chain().focus().setParagraph().run();
            if (e.target.value === "h1")
              editor.chain().focus().toggleHeading({ level: 1 }).run();
            if (e.target.value === "h2")
              editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          sx={{
            height: 34,
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "0.8rem",
            minWidth: 110,
          }}
        >
          <MenuItem value='p'>Texto Normal</MenuItem>
          <MenuItem value='h1'>Título Grande</MenuItem>
          <MenuItem value='h2'>Subtítulo</MenuItem>
        </Select>

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <ToggleButtonGroup size='small'>
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
          <ToggleButton
            value='underline'
            selected={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <FormatUnderlined fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <ToggleButtonGroup
          size='small'
          value={editor.getAttributes("paragraph").textAlign || "left"}
          exclusive
        >
          <ToggleButton
            value='left'
            selected={editor.isActive({ textAlign: "left" })}
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
          >
            <FormatAlignLeft fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='center'
            selected={editor.isActive({ textAlign: "center" })}
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
          >
            <FormatAlignCenter fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='right'
            selected={editor.isActive({ textAlign: "right" })}
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
          >
            <FormatAlignRight fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='justify'
            selected={editor.isActive({ textAlign: "justify" })}
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          >
            <FormatAlignJustify fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <ToggleButtonGroup size='small'>
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

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <Grid
          sx={{ display: "flex", alignItems: "center", position: "relative" }}
        >
          <input
            type='color'
            ref={colorInputRef}
            value={editor.getAttributes("textStyle").color || "#2A2628"}
            onChange={(e) =>
              editor.chain().focus().setColor(e.target.value).run()
            }
            style={{
              position: "absolute",
              width: 0,
              height: 0,
              opacity: 0,
              pointerEvents: "none",
            }}
          />
          <Tooltip title='Color infinito'>
            <IconButton
              size='small'
              onClick={() => colorInputRef.current?.click()}
            >
              <FormatColorText
                fontSize='small'
                sx={{
                  color: editor.getAttributes("textStyle").color || "#2A2628",
                }}
              />
            </IconButton>
          </Tooltip>
        </Grid>

        <IconButton
          size='small'
          onClick={() =>
            editor.chain().focus().toggleHighlight({ color: "#FFE4E1" }).run()
          }
          color={editor.isActive("highlight") ? "primary" : "default"}
        >
          <BorderColor fontSize='small' />
        </IconButton>

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <ToggleButtonGroup size='small'>
          <ToggleButton
            value='link'
            selected={editor.isActive("link")}
            onClick={setLink}
          >
            <InsertLink fontSize='small' />
          </ToggleButton>
          <ToggleButton
            value='unlink'
            onClick={() => editor.chain().focus().unsetLink().run()}
            disabled={!editor.isActive("link")}
          >
            <LinkOff fontSize='small' />
          </ToggleButton>
        </ToggleButtonGroup>

        <Divider orientation='vertical' flexItem sx={{ my: 0.5 }} />

        <Tooltip title='Insertar Emojis'>
          <IconButton
            size='small'
            onClick={(e) => setAnchorElEmoji(e.currentTarget)}
          >
            <InsertEmoticon fontSize='small' sx={{ color: "#655F62" }} />
          </IconButton>
        </Tooltip>

        <Menu
          anchorEl={anchorElEmoji}
          open={openEmojiMenu}
          onClose={() => setAnchorElEmoji(null)}
          slotProps={{
            paper: {
              sx: {
                p: 1,
                width: "290px",
                maxHeight: "350px",
                borderRadius: "12px",
                boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
              },
            },
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant='fullWidth'
            sx={{
              minHeight: 32,
              mb: 1,
              "& .MuiTab-root": { fontSize: "0.72rem", py: 0.5, minHeight: 32 },
            }}
          >
            {EMOJI_CATEGORIES.map((cat) => (
              <Tab key={cat.label} label={cat.label} />
            ))}
          </Tabs>

          <Grid
            container
            spacing={0.5}
            sx={{ p: 0.5, justifyContent: "flex-start" }}
          >
            {EMOJI_CATEGORIES[activeTab].emojis.map((emoji) => (
              <Grid key={emoji}>
                <IconButton
                  size='small'
                  onClick={() => {
                    editor.chain().focus().insertContent(emoji).run();
                    setAnchorElEmoji(null);
                  }}
                  sx={{ fontSize: "1.2rem", p: 0.5, borderRadius: "8px" }}
                >
                  {emoji}
                </IconButton>
              </Grid>
            ))}
          </Grid>
        </Menu>
      </Grid>

      {/* 2. ÁREA DE EDICIÓN CON AJUSTES DE INTERLINEADO OPTIMIZADOS */}
      <Grid
        size={12}
        sx={{
          p: 3,
          minHeight: "220px",
          maxHeight: "auto",
          overflowY: "auto",
          "& .ProseMirror": {
            outline: "none",
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.95rem",
            color: "#2A2628",
            minHeight: "180px",
            // 🌟 OPTIMIZACIÓN: Cambiado de 1.7 a 1.5 para un ritmo visual más compacto y moderno
            lineHeight: "1.2",
          },
          "& .ProseMirror p, & .ProseMirror h1, & .ProseMirror h2, & .ProseMirror li":
            {
              textAlign: "left",
            },
          "& .ProseMirror [style*='text-align: center']": {
            textAlign: "center !important",
          },
          "& .ProseMirror [style*='text-align: right']": {
            textAlign: "right !important",
          },
          "& .ProseMirror [style*='text-align: justify']": {
            textAlign: "justify !important",
          },
          "& .ProseMirror [style*='text-align: left']": {
            textAlign: "left !important",
          },

          "& .ProseMirror h1": {
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1.6rem",
            margin: "0 0 0.6rem 0", // Margen equilibrado para títulos
            fontWeight: 800,
            color: "#2A2628 !important",
          },
          "& .ProseMirror h1[style*='color']": { color: "inherit !important" },

          "& .ProseMirror h2": {
            fontFamily: "'Montserrat', sans-serif",
            fontSize: "1.25rem",
            margin: "1rem 0 0.5rem 0", // Agrega un poco de aire arriba y menos abajo
            fontWeight: 700,
            color: "#2A2628",
          },

          // 🌟 CORRECCIÓN CRÍTICA: Reducción drástica del margen inferior de los párrafos creados por Enter
          "& .ProseMirror p": {
            margin: "0 0 0.4rem 0",
          },

          // 🌟 ADICIÓN: Controlamos que los elementos de lista (bullets) queden juntos y limpios
          "& .ProseMirror ul, & .ProseMirror ol": {
            paddingLeft: "1.5em",
            margin: "0 0 0.6rem 0",
          },
          "& .ProseMirror li": {
            margin: "0 0 0.25rem 0", // Espaciado fino entre cada elemento de la lista
          },

          "& .tiptap-link": {
            color: "#E91E63",
            textDecoration: "underline",
            fontWeight: 600,
          },
          "& .ProseMirror p.is-editor-empty:first-of-type::before": {
            color: "#ADB5BD",
            content: "attr(data-placeholder)",
            float: "left",
            height: 0,
            pointerEvents: "none",
          },
        }}
      >
        <EditorContent editor={editor} />
      </Grid>
    </Grid>
  );
};

export default TipTapEditor;
