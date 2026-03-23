# **💳 QuickPay – AI-Powered Smart QR Menu**

QuickPay is a high-performance, full-stack web application designed to modernize the dining experience. It features autonomous QR-based table identification, a real-time digital menu, and an integrated **AI Waiter** for personalized recommendations and allergen checks.

## **📸 Screenshots**

Here are bkey views of the application in action:

| Digital Menu & QR Entry | AI Waiter Support |
| :---- | :---- |
|  |  |
| *Mobile-responsive menu access via table ID* | *Intelligent dish recommendations* |

| Split Bill & Checkout | Admin Table Management |
| :---- | :---- |
|  |  |
| *Dynamic cost calculation & splitting* | *Real-time table status tracking* |

## **🚀 Key Features**

* **📱 QR-Based Access:** Dynamic routing via /table/:id using React Router.  
* **🤖 AI-Powered Waiter:** Integrated **Groq (Llama-3)** service for dish suggestions and allergen filtering.  
* **🧾 Smart Billing:** Real-time balance tracking with "Split Bill" functionality for group dining.  
* **🛡️ Robust Backend:** Data integrity ensured by **SQLModel** and strict **Pydantic** validation.  
* **📱 Mobile-First UI:** Fully responsive design built with **Tailwind CSS**.

## **⚙️ Technical Stack**

### **Frontend**

* **React (Vite):** Modern component-based architecture.  
* **Tailwind CSS:** For fluid, responsive styling.  
* **Axios:** For asynchronous API communication.

### **Backend**

* **FastAPI:** High-concurrency Python framework.  
* **SQLModel:** Unified SQL management and Pydantic validation.  
* **SQLite:** Lightweight relational database.  
* **Groq Cloud API:** LLM integration for the AI service.

## **🏗️ Project Structure**

SWE314---Web-Programming-Project/  
│  
├── backend/            \# FastAPI backend  
│   ├── services/       \# AI & Business logic  
│   ├── main.py         \# API Endpoints  
│   ├── models.py       \# SQLModel Schemas  
│   └── requirements.txt  
│  
├── frontend/           \# React \+ Vite frontend  
│   ├── src/  
│   │   ├── components/ \# UI Components  
│   │   └── App.jsx     \# Main Routing  
│   └── package.json  
│  
├── screenshots/        \# Application images for documentation  
├── quickpay.db         \# SQLite database file  
└── README.md

## **🔧 Installation & Setup**

### **1\. Backend Setup**

cd backend  
python \-m venv venv  
\# Activate venv:  
\# Linux/Mac: source venv/bin/activate | Windows: venv\\Scripts\\activate

pip install \-r requirements.txt  
uvicorn main:app \--reload

*Backend runs on: http://127.0.0.1:8000*

### **2\. Frontend Setup**

cd frontend  
npm install  
npm run dev

*Frontend runs on: http://localhost:5173*

### **3\. Database Seeding**

To populate the menu and tables:

python seed.py

## **🛡️ Security & Environment Variables**

For security, API keys are managed via a .env file. Refer to .env.example to set up your credentials for the Groq AI service.

## **👥 Contributors**

* **Asiye Nur Aslan** \- Business Logic & DevOps Lead  
* \[Diğer Takım Arkadaşlarının İsimleri\]

*This project was developed for the **SWE314 \- Web Programming** course at \[University Name\].*