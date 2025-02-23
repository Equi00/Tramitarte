import axios from "axios";

class ProcessService {
  urlBackend = "http://localhost:8000/api";

  async saveProcess(user_id) {
    let process = await axios.post(`${this.urlBackend}/process/${user_id}`);
    return process;
  }

  async uploadAVO(avo, process_id) {
    console.log(avo)
    let persisted_avo = await axios.post(
      `${this.urlBackend}/process/upload-avo/${process_id}`,
      avo
    );
    return persisted_avo;
  }

  async uploadPersonalDocumentation(documentation, user_id) {
    let generated_documentation = await axios.post(
      `${this.urlBackend}/process/upload/documentation/user/${user_id}`,
      JSON.stringify(documentation),
      { headers: { "Content-Type": "application/json" } }
    );
    return generated_documentation;
  }

  async uploadAVODocumentation(documentation, process_id) {
    let generated_documentation = await axios.post(
      `${this.urlBackend}/process/upload/documentation/user/${process_id}`,
      documentation
    );
    return generated_documentation;
  }

  async uploadAncestorsDocumentation(documentation, process_id) {
    let generated_documentation = await axios.post(
      `${this.urlBackend}/process/upload/documentation/ancestors/${process_id}`,
      documentation
    );
    return generated_documentation;
  }

  async uploadTranslatedDocumentation(documentation, user_id) {
    let generated_documentation = await axios.post(
      `${this.urlBackend}/process/upload/documentation/translated/${user_id}`,
      documentation
    );
    return generated_documentation;
  }

  async searchProcessByUserId(user_id) {
    let persisted_process = await axios.get(
      `${this.urlBackend}/process/user/${user_id}`
    );
    return persisted_process;
  }

  async isDNIFront(imgFile) {
    const formData = new FormData();
    formData.append("img", imgFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/image/is_dni_front`, formData);
    return response.data;
  }

  async isDNIBack(imgFile) {
    const formData = new FormData();
    formData.append("img", imgFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/image/is_dni_back`, formData);
    return response.data;
  }

  async isCertificate(pdfFile) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_certificate`, formData);
    return response.data;
  }

  async isBirthCertificate(pdfFile) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_birth`, formData);
    return response.data;
  }

  async isMarriageCertificate(pdfFile) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_marriage`, formData);
    return response.data;
  }

  async isDeathCertificate(pdfFile) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_death`, formData);
    return response.data;
  }

  async isItalianBirthCertificate(pdfFile){
    const formData = new FormData();
    formData.append("pdf", pdfFile);

    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_birth_italy`, formData);
    return response.data;
  }

  async isItalianMarriageCertificate(pdfFile) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_marriage_italy`, formData);
    return response.data;
  }

  async isItalianDeathCertification(pdfFile) {
    const formData = new FormData();
    formData.append("pdf", pdfFile);
  
    const response = await axios.post(`${this.urlBackend}/ocr/pdf/is_death_italy`, formData);
    return response.data;
  }

  async delete(process_id) {
    await axios.delete(`${this.urlBackend}/process/${process_id}`);
  }

  async getAVOData(user_id){
    let avo= await axios?.get(`${this.urlBackend}/process/request/user/${user_id}`)
    return avo.data
  }

  async modifyFile(document_id,document){
    await axios.post(`${this.urlBackend}/process/modify/document/${document_id}`, document)
  }
}

const processService = new ProcessService();

export default processService;
