// Section Registry - Central registry of all available section types with their schemas
// This defines the structure, default props, editable fields, and allowed styles for each section type

export interface EditableField {
  name: string;
  type: 'text' | 'number' | 'color' | 'image' | 'select' | 'textarea' | 'boolean';
  label: string;
  required?: boolean;
  min?: number;
  max?: number;
  options?: string[];
  placeholder?: string;
}

export interface SectionDefinition {
  label: string;
  category: 'layout' | 'content' | 'marketing' | 'navigation';
  defaultProps: Record<string, any>;
  editableFields: EditableField[];
  allowedStyles: string[];
  apiBinding?: boolean;
  description?: string;
}

export const SectionRegistry: Record<string, SectionDefinition> = {
  hero: {
    label: "Hero Banner",
    category: "layout",
    description: "Large banner section with title, subtitle, and call-to-action",
    defaultProps: {
      title: "Welcome to Our Store",
      subtitle: "Discover amazing products",
      image: "",
      ctaText: "Shop Now",
      ctaLink: "/products",
      alignment: "center",
      height: "85vh"
    },
    editableFields: [
      { name: "title", type: "text", label: "Title", required: true, placeholder: "Enter hero title" },
      { name: "subtitle", type: "textarea", label: "Subtitle", required: false, placeholder: "Enter subtitle" },
      { name: "image", type: "image", label: "Background Image", required: false },
      { name: "ctaText", type: "text", label: "CTA Button Text", required: false, placeholder: "Shop Now" },
      { name: "ctaLink", type: "text", label: "CTA Link", required: false, placeholder: "/products" },
      { name: "alignment", type: "select", label: "Text Alignment", options: ["left", "center", "right"], required: false },
      { name: "height", type: "select", label: "Section Height", options: ["60vh", "70vh", "85vh", "100vh"], required: false }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign", "height", "backgroundImage"]
  },

  productGrid: {
    label: "Product Grid",
    category: "content",
    description: "Display products in a grid layout with API data binding",
    defaultProps: {
      title: "Featured Products",
      limit: 8,
      category: "",
      sortBy: "createdAt",
      sortOrder: "desc"
    },
    apiBinding: true,
    editableFields: [
      { name: "title", type: "text", label: "Section Title", required: true, placeholder: "Featured Products" },
      { name: "limit", type: "number", label: "Product Limit", required: true, min: 1, max: 50 },
      { name: "category", type: "select", label: "Filter by Category", options: [], required: false },
      { name: "sortBy", type: "select", label: "Sort By", options: ["createdAt", "price", "name", "rating"], required: false },
      { name: "sortOrder", type: "select", label: "Sort Order", options: ["asc", "desc"], required: false }
    ],
    allowedStyles: ["padding", "backgroundColor", "gridColumns", "gap"]
  },

  banner: {
    label: "Promotional Banner",
    category: "marketing",
    description: "Eye-catching banner for promotions and announcements",
    defaultProps: {
      headline: "Special Offer",
      subtext: "Get 50% off on selected items",
      backgroundColor: "#10b981",
      textColor: "#ffffff",
      ctaText: "Shop Now",
      ctaLink: "/products"
    },
    editableFields: [
      { name: "headline", type: "text", label: "Headline", required: true, placeholder: "Special Offer" },
      { name: "subtext", type: "text", label: "Subtext", required: false, placeholder: "Get 50% off" },
      { name: "backgroundColor", type: "color", label: "Background Color", required: false },
      { name: "textColor", type: "color", label: "Text Color", required: false },
      { name: "ctaText", type: "text", label: "CTA Text", required: false, placeholder: "Shop Now" },
      { name: "ctaLink", type: "text", label: "CTA Link", required: false, placeholder: "/products" }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign", "height"]
  },

  features: {
    label: "Features Section",
    category: "layout",
    description: "Highlight key features or benefits",
    defaultProps: {
      title: "Why Choose Us",
      features: [
        { title: "Free Shipping", description: "On orders over $50" },
        { title: "Secure Payments", description: "100% secure payment" },
        { title: "24/7 Support", description: "Dedicated support team" }
      ]
    },
    editableFields: [
      { name: "title", type: "text", label: "Section Title", required: true, placeholder: "Why Choose Us" }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign"]
  },

  testimonials: {
    label: "Testimonials",
    category: "marketing",
    description: "Customer reviews and testimonials",
    defaultProps: {
      title: "What Our Customers Say",
      limit: 3
    },
    apiBinding: true,
    editableFields: [
      { name: "title", type: "text", label: "Section Title", required: true, placeholder: "Customer Reviews" },
      { name: "limit", type: "number", label: "Number of Testimonials", required: true, min: 1, max: 10 }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign"]
  },

  newsletter: {
    label: "Newsletter Signup",
    category: "marketing",
    description: "Email subscription section",
    defaultProps: {
      heading: "Stay in the Loop",
      subtext: "Subscribe to our newsletter for updates",
      buttonText: "Subscribe"
    },
    editableFields: [
      { name: "heading", type: "text", label: "Heading", required: true, placeholder: "Stay in the Loop" },
      { name: "subtext", type: "text", label: "Subtext", required: false, placeholder: "Subscribe for updates" },
      { name: "buttonText", type: "text", label: "Button Text", required: false, placeholder: "Subscribe" }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign"]
  },

  footer: {
    label: "Footer",
    category: "navigation",
    description: "Site footer with links and information",
    defaultProps: {
      showNewsletter: true,
      showSocialLinks: true,
      copyrightText: "© 2024 Your Store. All rights reserved."
    },
    editableFields: [
      { name: "showNewsletter", type: "boolean", label: "Show Newsletter Signup", required: false },
      { name: "showSocialLinks", type: "boolean", label: "Show Social Links", required: false },
      { name: "copyrightText", type: "text", label: "Copyright Text", required: false }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign"]
  },

  navbar: {
    label: "Navigation Bar",
    category: "navigation",
    description: "Site navigation menu",
    defaultProps: {
      logo: "",
      showSearch: true,
      showCart: true,
      showUserAccount: true
    },
    editableFields: [
      { name: "logo", type: "image", label: "Logo Image", required: false },
      { name: "showSearch", type: "boolean", label: "Show Search", required: false },
      { name: "showCart", type: "boolean", label: "Show Cart", required: false },
      { name: "showUserAccount", type: "boolean", label: "Show User Account", required: false }
    ],
    allowedStyles: ["padding", "backgroundColor", "borderBottom"]
  },

  textBlock: {
    label: "Text Block",
    category: "content",
    description: "Rich text content block",
    defaultProps: {
      content: "Add your content here",
      alignment: "left"
    },
    editableFields: [
      { name: "content", type: "textarea", label: "Content", required: true, placeholder: "Enter your content" },
      { name: "alignment", type: "select", label: "Text Alignment", options: ["left", "center", "right"], required: false }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign", "fontSize"]
  },

  imageBlock: {
    label: "Image Block",
    category: "content",
    description: "Single image with optional caption",
    defaultProps: {
      image: "",
      caption: "",
      alignment: "center"
    },
    editableFields: [
      { name: "image", type: "image", label: "Image", required: true },
      { name: "caption", type: "text", label: "Caption", required: false, placeholder: "Image caption" },
      { name: "alignment", type: "select", label: "Alignment", options: ["left", "center", "right"], required: false }
    ],
    allowedStyles: ["padding", "backgroundColor", "textAlign", "maxWidth"]
  }
};

// Helper function to get section definition by type
export function getSectionDefinition(type: string): SectionDefinition | undefined {
  return SectionRegistry[type];
}

// Helper function to get all sections by category
export function getSectionsByCategory(category: SectionDefinition['category']): Record<string, SectionDefinition> {
  const result: Record<string, SectionDefinition> = {};
  for (const [key, value] of Object.entries(SectionRegistry)) {
    if (value.category === category) {
      result[key] = value;
    }
  }
  return result;
}

// Helper function to validate section data against its definition
export function validateSectionData(type: string, data: any): { valid: boolean; errors: string[] } {
  const definition = getSectionDefinition(type);
  if (!definition) {
    return { valid: false, errors: [`Unknown section type: ${type}`] };
  }

  const errors: string[] = [];

  for (const field of definition.editableFields) {
    if (field.required && !data[field.name]) {
      errors.push(`Required field '${field.label}' is missing`);
    }

    if (field.type === 'number' && data[field.name] !== undefined) {
      const value = Number(data[field.name]);
      if (field.min !== undefined && value < field.min) {
        errors.push(`Field '${field.label}' must be at least ${field.min}`);
      }
      if (field.max !== undefined && value > field.max) {
        errors.push(`Field '${field.label}' must be at most ${field.max}`);
      }
    }

    if (field.type === 'select' && data[field.name] && field.options) {
      if (!field.options.includes(data[field.name])) {
        errors.push(`Field '${field.label}' has an invalid option`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

// Helper function to get default props for a section type
export function getSectionDefaults(type: string): Record<string, any> {
  const definition = getSectionDefinition(type);
  return definition ? { ...definition.defaultProps } : {};
}
