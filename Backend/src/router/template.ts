import express from 'express';
import { getAllTemplates, getTemplateBySlug, deleteTemplateBySlug, createTemplate, updateTemplateBySlug } from '../controller/templateController.js';
import { upload } from '../multer.js';

const TemplateRouter = express.Router();

TemplateRouter.post('/templates', upload.single("previewImage"), createTemplate);
TemplateRouter.get('/templates', getAllTemplates);
TemplateRouter.get('/templates/:slug', getTemplateBySlug);
TemplateRouter.delete('/templates/:slug', deleteTemplateBySlug);
TemplateRouter.put('/templates/:slug', upload.single("previewImage"), updateTemplateBySlug); // Reusing createTemplate for update as an example
export default TemplateRouter;