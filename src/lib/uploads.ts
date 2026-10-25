import { mkdir, writeFile } from "fs/promises";
import path from "path";

const ALLOWED_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const ALLOWED_FOLDERS = new Set(["courses", "instructors"]);
const MAX_BYTES = 4 * 1024 * 1024;

function matchesMagic(bytes: Uint8Array, expected: number[]) {
  return expected.every((value, index) => bytes[index] === value);
}

function sniffExtension(bytes: Uint8Array) {
  if (matchesMagic(bytes, [0xff, 0xd8, 0xff])) return "jpg";
  if (matchesMagic(bytes, [0x89, 0x50, 0x4e, 0x47])) return "png";
  if (matchesMagic(bytes, [0x47, 0x49, 0x46, 0x38])) return "gif";
  if (
    matchesMagic(bytes, [0x52, 0x49, 0x46, 0x46]) &&
    bytes.length >= 12 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "webp";
  }
  return null;
}

export async function saveUploadedImage(file: File, folder: string) {
  if (!file.size) return null;
  if (!ALLOWED_FOLDERS.has(folder)) throw new Error("مجلد الرفع غير صالح");

  const declared = ALLOWED_TYPES[file.type];
  if (!declared) {
    throw new Error("صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP.");
  }
  if (file.size > MAX_BYTES) {
    throw new Error("حجم الصورة يجب ألا يتجاوز 4 ميغابايت.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffExtension(buffer);
  if (!sniffed) throw new Error("ملف الصورة تالف أو غير مدعوم.");
  if (sniffed !== declared && !(declared === "jpg" && sniffed === "jpg")) {
    throw new Error("نوع الملف لا يطابق امتداده.");
  }

  const root =
    process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? path.join("/tmp", "uploads")
      : path.join(process.cwd(), "public", "uploads");
  const dir = path.join(root, folder);
  await mkdir(dir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${sniffed}`;
  await writeFile(path.join(dir, filename), buffer);

  return `/uploads/${folder}/${filename}`;
}
