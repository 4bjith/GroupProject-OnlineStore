import mongoose from "mongoose";

const StoreSchema = new mongoose.Schema({
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    domain: {
        type: String,
        unique: true,
        sparse: true,
    },
    logo: {
        type: String,
        default: null,
    },
    currency: {
        type: String,
        required: true,
    },
    templateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        required: false,
    },
    templateSlug: {
        type: String,
        default: 'template-001',
        enum: ['template-001', 'template-002', 'template-003', 'template-004', 'template-005', 'template-006'],
    },
    customTemplateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Template',
        default: null,
    },
    templateVersion: {
        type: Number,
        default: 1,
    },
    commissionRate: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: false,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    themeSettings: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

// Index for performance
StoreSchema.index({ customTemplateId: 1 });
StoreSchema.index({ templateId: 1 });

const Store = mongoose.model('Store', StoreSchema);

export default Store;