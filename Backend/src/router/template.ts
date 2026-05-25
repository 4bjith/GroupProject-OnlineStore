import express from 'express';
import { 
  getAllTemplates, 
  getTemplateBySlug, 
  deleteTemplateBySlug, 
  createTemplate, 
  updateTemplateBySlug,
  duplicateTemplate,
  generatePreview,
  getSectionTypes,
  publishTemplate,
  getTemplateByVersion,
  validateTemplate
} from '../controller/templateController.js';
import { upload } from '../multer.js';

const TemplateRouter = express.Router();

TemplateRouter.post('/templates', upload.single("previewImage"), createTemplate);
TemplateRouter.get('/templates', getAllTemplates);
TemplateRouter.get('/templates/:slug', getTemplateBySlug);
TemplateRouter.delete('/templates/:slug', deleteTemplateBySlug);
TemplateRouter.put('/templates/:slug', upload.single("previewImage"), updateTemplateBySlug);
TemplateRouter.post('/templates/:slug/duplicate', duplicateTemplate);
TemplateRouter.get('/templates/:slug/preview', generatePreview);
TemplateRouter.get('/templates/sections', getSectionTypes);
TemplateRouter.put('/templates/:slug/publish', publishTemplate);
TemplateRouter.get('/templates/:slug/version', getTemplateByVersion);
TemplateRouter.post('/templates/validate', validateTemplate);

export default TemplateRouter;