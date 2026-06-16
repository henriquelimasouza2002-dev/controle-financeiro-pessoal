from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SOURCE_DIR = ROOT / "outputs"
DEST_DIR = SOURCE_DIR / "fundamentos da eng de softwere"

ORDER = [
    "tela-login.png",
    "tela-dashboard.png",
    "tela-categorias.png",
    "tela-transacoes.png",
    "tela-usuario.png",
]

DEST_DIR.mkdir(parents=True, exist_ok=True)

pages = []
for filename in ORDER:
    image = Image.open(SOURCE_DIR / filename).convert("RGB")
    output_pdf = DEST_DIR / f"{Path(filename).stem}.pdf"
    image.save(output_pdf, "PDF", resolution=100.0)
    pages.append(image.copy())

pages[0].save(
    DEST_DIR / "pdf_das_imagens_telas.pdf",
    "PDF",
    save_all=True,
    append_images=pages[1:],
    resolution=100.0,
)

print("PDFs das imagens gerados.")
