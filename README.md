FreshCart is designed to bridge the gap between traditional e-commerce and accessibility in regions with limited internet access. While users with smartphones enjoy a rich web experience, others can interact with the platform using USSD.

Additionally, administrators can monitor and control the entire system through a dedicated dashboard.

🚀 Features
🌐 User Features
🛍️ Product browsing and categorization
🔍 Search and filtering
🛒 Add to cart / remove from cart
📱 Fully responsive UI (mobile-first design)
⚡ Fast and modern interface
📞 USSD Integration
📲 Browse products via USSD
🛒 Add items to cart using feature phones
📦 Order placement via USSD
🔄 Real-time interaction with backend APIs
🛠️ Admin Dashboard
👥 Manage users (view, update, delete)
📦 Add, edit, and delete products
📊 View all sales and transaction history
📈 Generate reports and analytics
🧾 Monitor orders in real-time

🔐 Role-based access control (admin privileges)

🧰 Tech Stack
Frontend
⚛️ React
🎨 Tailwind CSS

Backend
🟢 Node.js
🚂 Express.js

Database
🍃 MongoDB

Integration
📞 Africa's Talking (USSD API)

🏗️ Architecture
Client (React + Tailwind)
        ↓
REST API (Node.js + Express)
        ↓
Database (MongoDB)
        ↓
USSD Service (Africa's Talking)
        ↓
Admin Dashboard (Web Interface)
📂 Project Structure
freshcart/
│── client/             # React frontend (User + Admin UI)
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── admin/         # Admin dashboard pages
│
│── server/             # Node.js backend
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── ussd/
│   ├── middleware/    # Auth & admin protection
│
│── .env
│── README.md

⚙️ Installation & Setup

1. Clone the Repository
git clone https://github.com/Caleb-Kylib/freshcart.git
cd freshcart

3. Setup Backend
cd server
npm install

Create a .env file:

PORT=5000
MONGO_URI=your_mongodb_connection_string
AT_API_KEY=your_africas_talking_api_key
AT_USERNAME=your_africas_talking_username
JWT_SECRET=your_secret_key

Run backend:

npm run dev
3. Setup Frontend
cd client
npm install
npm run dev


📡 USSD Setup

Create an account on Africa's Talking
Create a USSD service
Set callback URL:
https://your-domain.com/api/ussd
Test using sandbox or live shortcode
💡 Usage
👤 Users
Visit the web app
Browse products
Add/remove items from cart
Place orders
📞 USSD Users
Dial USSD code (e.g. *123#)
Navigate menu
Select products
Place orders


🛠️ Admins
Access admin dashboard
Manage products and users
Track orders and sales
View reports and analytics

🎯 Project Goals
Build a scalable full-stack application
Integrate telecom APIs (USSD)
Improve accessibility for low-bandwidth users
Implement admin-level system control
Demonstrate real-world e-commerce architecture
🔮 Future Improvements
💳 Payment integration (M-Pesa, card payments)
🔐 Advanced authentication & permissions
📦 Order tracking system
📊 Advanced analytics dashboard
🌍 Multi-language support
🤝 Contributing

Contributions are welcome!

Fork the repository
Create a feature branch
Commit your changes
Open a pull request
📄 License

MIT License

👤 Author

Caleb Murero

GitHub: https://github.com/Caleb-Kylib
⭐ Support

If you find this project useful, give it a ⭐ on GitHub!
