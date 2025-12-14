# 🛍️ Online Store Management - Frontend

Welcome to the frontend repository for the **Online Store Management System**. This modern, responsive dashboard allows administrators to efficiently manage products, inventory, and categories with a seamless user experience.

Built with performance and scalability in mind, this project leverages the latest web technologies to provide a robust solution for e-commerce store operations.

---

## 🚀 Key Features

- **Product Management**: Create, edit, delete, and view products with ease. Support for rich details including pricing, stock, specifications, and multiple images.
- **Inventory Control**: Real-time tracking of stock levels and SKU management.
- **Category Management**: Organize products into dynamic categories for better browsing.
- **Advanced Filtering**: Filter products by category and efficient pagination for large datasets.
- **Responsive Design**: Fully optimized interface for Desktop, Tablet, and Mobile devices.
- **Real-time Feedback**: Interactive UI with instant toast notifications for success and error states.

---

## 🛠️ Tech Stack

This project is built using a modern React ecosystem:

*   **Core**: [React 18+](https://react.dev/) with [Vite](https://vitejs.dev/) for lightning-fast development.
*   **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) for a utility-first, custom design system.
*   **State Management**: 
    *   [Zustand](https://zustand-demo.pmnd.rs/) for global client state.
    *   [TanStack Query (React Query)](https://tanstack.com/query/latest) for powerful asynchronous server state management.
*   **Routing**: [React Router 6](https://reactrouter.com/) for client-side navigation.
*   **Networking**: [Axios](https://axios-http.com/) for HTTP requests.
*   **UI Components**: [React Icons](https://react-icons.github.io/react-icons/) and custom components.
*   **Notifications**: [React Toastify](https://fkhadra.github.io/react-toastify/) & React Hot Toast.

---

## 📦 Getting Started

Follow these steps to get the project running on your local machine.

### Prerequisites

Ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (Version 16 or higher recommended)
*   npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/group-project-frontend.git
    cd Frontend-main
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env` file in the root directory if required (refer to `.env.example` if available) to configure your API base URL.
    ```env
    VITE_API_URL=http://localhost:3000/api
    ```

4.  **Run the Development Server**
    ```bash
    npm run dev
    ```
    The application will typically start at `http://localhost:5173`.

### Building for Production

To create an optimized build for deployment:

```bash
npm run build
```

---

## 📂 Project Structure

A quick look at the top-level directory structure:

```
Frontend-main/
├── src/
│   ├── api/           # Axios instance and API calls
│   ├── components/    # Reusable UI components (ProductList, Forms, etc.)
│   ├── pages/         # Page/Route components
│   ├── stores/        # Zustand state stores
│   ├── hooks/         # Custom React hooks
│   ├── assets/        # Static assets (images, fonts)
│   └── App.jsx        # Main application entry point
├── public/            # Public static files
└── package.json       # Project dependencies and scripts
```

---

## 🤝 Contributing

We welcome contributions! Please feel free to check the [issues page](issues) for bugs or feature requests.

1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

_Maintained by the Group Project Team._
