from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from services.TesseractService import TesseractService

t_router = APIRouter(prefix="/api/ocr", tags=["OCR"])

def get_tesseract_service():
    return TesseractService()

@t_router.post("/image")
async def recognize_image(img: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.recognize_image(img.file)

@t_router.post("/pdf")
async def recognize_pdf(file: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.recognize_pdf(file.file)

@t_router.post("/image/is_dni_front")
async def is_dni_front(img: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_dni_front(img.file)

@t_router.post("/image/is_dni_back")
async def is_dni_back(img: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_dni_back(img.file)

@t_router.post("/pdf/is_certificate")
async def is_certificate(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_certificate(pdf.file, "ita")

@t_router.post("/pdf/text_from_img")
async def recognize_images_in_pdf(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.extract_images_from_pdf_with_ocr(pdf.file)

@t_router.post("/pdf/is_marriage")
async def is_marriage_certificate(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_marriage_certificate(pdf.file)

@t_router.post("/pdf/is_birth")
async def is_birth_certificate(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_birth_certificate(pdf.file)

@t_router.post("/pdf/is_death")
async def is_death_certificate(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_death_certificate(pdf.file)

@t_router.post("/pdf/is_birth_italy")
async def is_birth_certificate_italy(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_birth_certificate_italy(pdf.file, "ita")

@t_router.post("/pdf/is_marriage_italy")
async def is_marriage_certificate_italy(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_marriage_certificate_italy(pdf.file, "ita")

@t_router.post("/pdf/is_death_italy")
async def is_death_certificate_italy(pdf: UploadFile = File(...), service: TesseractService = Depends(get_tesseract_service)):
    return service.is_death_certificate_italy(pdf.file, "ita")
