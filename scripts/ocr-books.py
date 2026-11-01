"""OCR the owner's scanned books through the local MinerU API (http://127.0.0.1:8005).

Resumable: writes one markdown file per chunk of pages to C:/Pharmacology Book/ocr/<book>/
and skips chunks that already exist. Page numbers in file names are 1-based PDF pages.
Usage: python -I scripts/ocr-books.py [book-filter]
"""
import json, os, sys, time, urllib.request, uuid

BOOKS = [  # (pdf, short name, pages)
    ("Pharma Rapid Revision 5e.pdf", "rapid-revision", 66),
    ("PG Pharma Sarkar.pdf", "sarkar", 632),
    ("Pharmacology Prep Xi A4.pdf", "prep", 681),
]
SRC = "C:/Pharmacology Book"
OUT = "C:/Pharmacology Book/ocr"
API = "http://127.0.0.1:8005/file_parse"
CHUNK = 5


def post(pdf_path, start, end):
    boundary = uuid.uuid4().hex
    fields = {"backend": "pipeline", "parse_method": "ocr", "lang_list": "en",
              "start_page_id": str(start), "end_page_id": str(end), "return_md": "true",
              "formula_enable": "false", "table_enable": "true"}
    body = b""
    for k, v in fields.items():
        body += f"--{boundary}\r\nContent-Disposition: form-data; name=\"{k}\"\r\n\r\n{v}\r\n".encode()
    with open(pdf_path, "rb") as f:
        data = f.read()
    body += (f"--{boundary}\r\nContent-Disposition: form-data; name=\"files\"; filename=\"book.pdf\"\r\n"
             "Content-Type: application/pdf\r\n\r\n").encode() + data + f"\r\n--{boundary}--\r\n".encode()
    req = urllib.request.Request(API, data=body, headers={"Content-Type": f"multipart/form-data; boundary={boundary}"})
    with urllib.request.urlopen(req, timeout=3600) as r:
        res = json.load(r)["results"]
    return next(iter(res.values()))["md_content"]


def main():
    flt = sys.argv[1] if len(sys.argv) > 1 else ""
    for pdf, name, pages in BOOKS:
        if flt and flt not in name:
            continue
        os.makedirs(f"{OUT}/{name}", exist_ok=True)
        for s in range(0, pages, CHUNK):
            e = min(s + CHUNK, pages) - 1
            path = f"{OUT}/{name}/p{s + 1:04d}-{e + 1:04d}.md"
            if os.path.exists(path):
                continue
            t = time.time()
            for attempt in range(3):
                try:
                    md = post(f"{SRC}/{pdf}", s, e)
                    break
                except Exception as ex:  # service hiccup: wait and retry
                    print(f"{name} {s + 1}-{e + 1} failed ({ex}); retry", flush=True)
                    time.sleep(30)
            else:
                continue
            with open(path, "w", encoding="utf-8") as f:
                f.write(f"<!-- {pdf} PDF pages {s + 1}-{e + 1} (MinerU OCR) -->\n\n{md}")
            print(f"{name} {s + 1}-{e + 1} done in {time.time() - t:.0f}s", flush=True)


if __name__ == "__main__":
    main()
