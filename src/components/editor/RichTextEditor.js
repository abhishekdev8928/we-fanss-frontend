import { useEffect, useRef } from "react";

const RichTextEditor = ({
  value = "",
  onChange,
  height = 600,
}) => {
  const editorRef = useRef(null);
  const instanceRef = useRef(null);
  const isInitializing = useRef(false);

  useEffect(() => {
    
    if (isInitializing.current) return;
    
    if (!window.CKEDITOR) {
      console.error("CKEditor not loaded");
      return;
    }

    // ✅ Check if element exists in DOM
    if (!editorRef.current) {
      console.error("Editor element not found");
      return;
    }

    // ✅ Destroy any existing instance on this element
    const existingInstance = window.CKEDITOR.instances[editorRef.current.name || editorRef.current.id];
    if (existingInstance) {
      try {
        existingInstance.destroy(true);
      } catch (e) {
        console.log("Error destroying existing instance:", e);
      }
    }

    isInitializing.current = true;

    const BASE_URL =
      process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

    // ✅ Add small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      try {
        const editor = window.CKEDITOR.replace(editorRef.current, {
          height,
          removePlugins: 'elementspath',
          resize_enabled: false,

          // ✅ UPLOAD CONFIG
          uploadUrl: `${BASE_URL}/api/ckeditor/upload`,
          filebrowserUploadUrl: `${BASE_URL}/api/ckeditor/upload?type=Files`,
          filebrowserImageUploadUrl: `${BASE_URL}/api/ckeditor/upload?type=Images`,
        });

        instanceRef.current = editor;

        editor.on("instanceReady", () => {
          editor.setData(value || "");
          isInitializing.current = false;
        });

        editor.on("change", () => {
          onChange?.(editor.getData());
        });

      } catch (error) {
        console.error("CKEditor initialization error:", error);
        isInitializing.current = false;
      }
    }, 100);

    return () => {
      clearTimeout(timer);
      if (instanceRef.current) {
        try {
          instanceRef.current.destroy(true);
          instanceRef.current = null;
        } catch (e) {
          console.log("Cleanup error:", e);
        }
      }
      isInitializing.current = false;
    };
  }, []); // ✅ Empty deps - only initialize once

  // ✅ Update content when value changes from parent
  useEffect(() => {
    if (instanceRef.current && instanceRef.current.status === 'ready') {
      const currentData = instanceRef.current.getData();
      if (currentData !== value && value !== undefined) {
        instanceRef.current.setData(value);
      }
    }
  }, [value]);

  // ✅ Dynamic height update
  useEffect(() => {
    const editor = instanceRef.current;
    if (!editor) return;

    if (editor.status === "ready") {
      editor.resize("100%", height);
    } else {
      editor.on("instanceReady", () => {
        editor.resize("100%", height);
      });
    }
  }, [height]);

  return (
    <div>
      <textarea 
        ref={editorRef}
        style={{ width: '100%', height: `${height}px` }}
        defaultValue={value}
      />
    </div>
  );
};

export default RichTextEditor;