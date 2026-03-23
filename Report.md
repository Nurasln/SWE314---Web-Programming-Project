SWE314 - Web Programming Project Report

QuickPay: QR Menu & Split Bill System

**1)Project Overview**

This project focuses on building a web-based system for restaurants and cafes. The main idea is to allow customers to scan a QR code, view the menu on their phones, place orders, and split the bill without needing to interact with a waiter.

The motivation behind the project is to improve efficiency in restaurants and reduce waiting times. The system aims to make the ordering process faster, easier, and less error-prone for both customers and staff.

**2) Business Problem**

In many restaurants, the ordering process is still manual. Customers often wait for menus, waiters, and payment processing. This can lead to delays, especially during busy hours. In addition, orders can sometimes be taken incorrectly, and splitting the bill among multiple people can become complicated.

This project addresses these issues by introducing a digital solution. With QuickPay, customers can directly access the menu through a QR code, place their orders, and split the bill in a simple and organized way. This reduces dependency on staff and improves the overall customer experience.

**3) Technologies Used**

Frontend:

•React (with Vite)

•TailwindCSS

• JavaScript

Backend:

•FastAPI (Python)

•SQLModel

Database:

• SQLite

Other Tools:

•External API integration (for recommendation system)

•Git and GitHub for version control

**4) System Architecture**

The system is designed using a client-server architecture.

The frontend is responsible for displaying the menu, handling user interactions, and sending requests to the backend. It is built using React and styled with TailwindCSS to ensure a responsive design.

The backend is developed using FastAPI and handles all the business logic. It processes incoming requests, interacts with the database, and returns responses in JSON format.

The database stores information such as menu items and orders. SQLite is used for simplicity and ease of setup.

**5) Features Implemented**

•QR code-based menu access

•Dynamic menu display

•Order creation and management

•Bill splitting functionality

•Recommendation feature using an external API

•Mobile-friendly user interface

**6) Concepts Covered in the Course**

This project allowed us to apply several concepts covered in the course.

Frontend Development:

We used React to build a component-based interface. State management was handled using hooks such as useState. The interface updates dynamically based on user actions, and TailwindCSS was used for responsive design.

Backend Development:

We implemented RESTful APIs using FastAPI. Different endpoints were created to handle operations such as retrieving menu data and creating orders. Request handling and routing were managed on the server side.

Database Management:

We designed a relational database and performed CRUD operations. SQLModel was used as an ORM to simplify database interactions.

Full-Stack Integration:

The frontend communicates with the backend using HTTP requests. Data is exchanged in JSON format, and the system ensures that both sides stay synchronized.

Version Control:

We used Git and GitHub to manage the development process. Changes were tracked through commits, and the project was maintained in a structured repository.

**7) API Design**

The backend provides several endpoints for communication between the frontend and the server.

Examples include:

•GET /menu → returns all menu items

•POST /order → creates a new order

•GET /order/{id} → retrieves details of a specific order

The API follows REST principles and uses JSON for data exchange.

**8) Challenges Faced**

During development, we faced several challenges. One of the main difficulties was ensuring smooth communication between the frontend and backend. Handling asynchronous operations and managing state updates required careful attention.

Another challenge was designing a clean and user-friendly interface, especially for mobile devices. Implementing the bill splitting logic also required careful planning.

Additionally, integrating an external API and managing environment variables introduced some configuration challenges.

**9) Future Improvements**

There are several features that could be added in the future to improve the system.

•Online payment integration

•User authentication and login system

•Admin panel for restaurant management

•Real-time updates for orders

•Deployment to a cloud platform

**10) Conclusion**

This project demonstrates how modern web technologies can be combined to build a complete full-stack application. It includes frontend development, backend logic, database management, and API integration.

Overall, the system provides a practical solution to a real-world problem and helped us gain hands-on experience in web development.
