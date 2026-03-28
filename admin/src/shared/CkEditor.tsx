/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { BlockQuote, Bold, Code, CodeBlock, Essentials, Heading, Italic, Link, List, Paragraph, Strikethrough } from "ckeditor5";
import "ckeditor5/ckeditor5.css";

import { CKEditorComponentProps } from "@/src/types/shared";
import { useEffect, useRef, useState } from "react";

const CKEditorComponent = ({ value, onChange, placeholder = "Type your answer here...", minHeight = "160px" }: CKEditorComponentProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<any>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    // Inject CSS to fix word wrapping and add dark mode support
    const injectStyles = () => {
      const styleId = "ckeditor-custom-styles";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.textContent = `
          .ck.ck-editor__editable_inline {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
            white-space: normal !important;
            max-width: 100% !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          
          .ck.ck-editor__editable_inline p,
          .ck.ck-editor__editable_inline div {
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            word-break: break-word !important;
            white-space: normal !important;
          }
          
          .ck.ck-editor {
            width: 100% !important;
            max-width: 100% !important;
          }
          .ck.ck-toolbar_grouping{
            background-color: white !important;
          }
          
          .ck.ck-editor__main {
            width: 100% !important;
            max-width: 100% !important;
            overflow: hidden !important;
          }
          
          .ck-editor__editable {
            min-height: 100px !important;
            max-height: 100px !important;
          }
            .ck-placeholder{
              margin-block: 0px !important;
            }
          .ck-editor__editable_inline {
            min-height: 100px !important;
            max-height: 100px !important;
          }
            .ck-editor__editable_inline.ck-focused{
               min-height: 100% !important;
            max-height: 100% !important;
            }
            .ck-editor__editable_inline.ck-focused .ck-placeholder{
              margin-block: 14px !important;
            }

            .ck-loader{
            min-height: 100px !important;
            max-height: 100px !important;
            }

          /* Dark mode support */
          .dark .ck.ck-editor__main>.ck-editor__editable:not(.ck-focused){
            border: none !important;
          }
            .dark .ck.ck-editor__main:focus-visible{
              outline: none !important;
            }
          .dark .ck.ck-sticky-panel__content{
            border: none !important;
          }
          .dark .ck.ck-toolbar {
            background-color: var(--page-body-bg) !important;
            border-color: var(--card-border-color) !important;
          }

          .dark .ck.ck-toolbar .ck-button {
            color: rgb(226 232 240) !important;
          }

          .dark .ck.ck-toolbar .ck-button:hover {
            background-color: var(--dark-sidebar) !important;
          }

          .dark .ck.ck-toolbar .ck-button.ck-on {
            background-color: var(--dark-sidebar) !important;
            color: var(--text-green-primary) !important;
          }

          .dark .ck.ck-content {
            background-color: var(--page-body-bg) !important;
            color: rgb(226 232 240) !important;
          }

          .dark .ck.ck-editor__editable_inline {
            background-color: var(--page-body-bg) !important;
            color: rgb(226 232 240) !important;
          }

          .dark .ck.ck-toolbar .ck-toolbar__separator {
            background-color: var(--card-border-color) !important;
          }
        `;
        document.head.appendChild(style);
      }
    };

    const loadCKEditor = async () => {
      if (typeof window === "undefined") return;

      try {
        injectStyles();

        const { CKEditor } = await import("@ckeditor/ckeditor5-react");
        const { ClassicEditor } = await import("ckeditor5");

        if (isMounted) {
          setEditor({
            CKEditor,
            ClassicEditor: ClassicEditor,
          });
          setIsEditorReady(true);
        }
      } catch (error) {
        console.error("Error loading CKEditor:", error);
      }
    };

    loadCKEditor();

    return () => {
      isMounted = false;
      setIsEditorReady(false);
    };
  }, []);

  if (!isEditorReady || !editor) {
    return (
      <div className="dark:bg-(--card-color) flex items-center ck-loader justify-center border border-gray-300 dark:border-(--card-border-color) rounded-lg bg-gray-50" style={{ minHeight }}>
        <span className="text-gray-500 dark:text-gray-400">Loading editor...</span>
      </div>
    );
  }

  const { CKEditor, ClassicEditor } = editor;

  return (
    <div ref={editorRef} style={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          licenseKey: "GPL",
          placeholder,
          plugins: [Essentials, Paragraph, Bold, Italic, Strikethrough, Link, List, Heading, BlockQuote, Code, CodeBlock],
          toolbar: ["undo", "redo", "|", "heading", "|", "bold", "italic", "strikethrough", "|", "link", "|", "bulletedList", "numberedList", "|", "blockQuote", "code", "codeBlock"],
        }}
        onReady={(editorInstance: any) => {
          // Apply custom styles to the editor
          const editorElement = editorInstance.ui.view.element;
          if (editorElement) {
            // Check if dark mode is active
            const isDarkMode = document.documentElement.classList.contains("dark");

            // Get computed CSS variable values
            const styles = getComputedStyle(document.documentElement);
            const cardColor = styles.getPropertyValue("--card-color").trim();
            const cardBorderColor = styles.getPropertyValue("--card-border-color").trim();

            // Style the toolbar
            const toolbar = editorElement.querySelector(".ck-toolbar");
            if (toolbar instanceof HTMLElement) {
              toolbar.style.backgroundColor = isDarkMode ? cardColor : "#f8fafc";
              toolbar.style.border = "none";
              toolbar.style.borderBottom = isDarkMode ? `1px solid ${cardBorderColor}` : "1px solid #f1f5f9";
              toolbar.style.padding = "8px 16px";
            }

            // Style the content area
            const content = editorElement.querySelector(".ck-content");
            if (content instanceof HTMLElement) {
              content.style.minHeight = minHeight;
              content.style.maxHeight = "400px";
              content.style.border = "none";
              content.style.padding = "16px";
              content.style.fontSize = "14px";
              content.style.lineHeight = "1.6";
              content.style.backgroundColor = isDarkMode ? cardColor : "#ffffff";
              content.style.color = isDarkMode ? "rgb(226 232 240)" : "#000000";
            }
          }
        }}
        onChange={(_event: any, editorInstance: any) => {
          const data = editorInstance.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default CKEditorComponent;
