import { z } from 'zod';
import { put } from '@vercel/blob';
import { randomUUID } from 'crypto';

const FileSchema = z.object({
  file: z
    .instanceof(File)
    .refine(file => file.size <= 5 * 1024 * 1024, {
      message: 'File size should be less than 5MB',
    })
    .refine(
      file =>
        [
          'text/x-csrc', // .c
          'text/x-csharp', // .cs
          'text/x-c++src', // .cpp
          'application/msword', // .doc
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
          'text/html', // .html
          'text/x-java-source', // .java
          'application/json', // .json
          'text/markdown', // .md
          'application/pdf', // .pdf
          'application/x-httpd-php', // .php
          'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
          'text/x-python', // .py
          'application/x-ruby', // .rb
          'application/x-tex', // .tex
          'text/plain', // .txt
          'text/css', // .css
          'application/javascript', // .js
          'application/x-sh', // .sh
          'application/typescript', // .ts
          'text/csv', // .csv
          'image/jpeg', // .jpeg, .jpg
          'image/png', // .png
          'image/gif', // .gif
          'application/x-tar', // .tar
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
          'application/xml', // .xml
          'application/zip', // .zip
        ].includes(file.type),
      {
        message:
          'Unsupported file type. Only C, CS, CPP, DOC, DOCX, HTML, JAVA, JSON, MD, PDF, PHP, PPTX, PY, RB, TEX, TXT, CSS, JS, SH, TS, CSV, JPEG, JPG, GIF, PNG, TAR, XLSX, XML, and ZIP are accepted.',
      },
    ),
});

export async function handleFileUpload(request: Request) {
  if (request.body === null) {
    return new Response('Request body is empty', { status: 400 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response('No file uploaded', { status: 400 });
    }

    const validatedFile = FileSchema.safeParse({ file });

    if (!validatedFile.success) {
      const errorMessage = validatedFile.error.errors
        .map(error => error.message)
        .join(', ');

      return new Response(errorMessage, { status: 400 });
    }

    const filename = file.name;
    const fileBuffer = await file.arrayBuffer();

    try {
      const data = await put(`${randomUUID()}-${filename}`, fileBuffer, {
        access: 'public',
      });

      return new Response(
        JSON.stringify({
          url: data.url,
          pathname: filename,
          contentType: file.type,
        }),
        { headers: { 'Content-Type': 'application/json' } },
      );
    } catch (error) {
      return new Response('Upload failed', { status: 500 });
    }
  } catch (error) {
    return new Response('Failed to process request', { status: 500 });
  }
}
