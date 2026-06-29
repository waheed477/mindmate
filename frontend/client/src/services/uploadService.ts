const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_API_KEY as string | undefined;
const MAX_SIZE_MB = 5;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function resizeImage(file: File, maxWidthPx = 800): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxWidthPx / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Canvas not supported"));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = reject;
    img.src = url;
  });
}

export async function uploadImage(file: File): Promise<string> {
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Image must be smaller than ${MAX_SIZE_MB}MB`);
  }

  if (IMGBB_API_KEY) {
    const base64 = await fileToBase64(file);
    const base64Data = base64.split(",")[1];

    const form = new FormData();
    form.append("key", IMGBB_API_KEY);
    form.append("image", base64Data);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: form,
    });

    if (!response.ok) {
      throw new Error("ImgBB upload failed");
    }

    const data = await response.json();
    if (!data.success) throw new Error(data.error?.message || "ImgBB upload failed");
    return data.data.url as string;
  }

  return resizeImage(file);
}
