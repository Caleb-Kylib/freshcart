const Product = require("../models/Product");
const Order = require("../models/Order");

exports.handleUSSD = async (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";
  const parts = text.split("*").filter(p => p !== ""); // Clean up potential empty strings
  const level = parts.length;

  try {
    if (text === "") {
      // MAIN MENU
      response = `CON Welcome to FreshCart! 🧺
Choose an option:
1. Shop by Category
2. My Latest Order
3. Help & Support`;

    } else if (parts[0] === "1") {
      // SHOPPING FLOW
      if (level === 1) {
        // Fetch unique categories dynamically
        const categories = await Product.distinct("category");
        let menu = "CON Select Category:\n";
        categories.forEach((cat, i) => {
          menu += `${i + 1}. ${cat}\n`;
        });
        menu += "0. Back";
        response = menu;

      } else if (level === 2) {
        // SELECTING A CATEGORY
        if (parts[1] === "0") {
          // Go back to main menu by sending an empty response redirect logic equivalent 
          // (Actually in USSD you'd need the user to re-dial or we handle the text)
          // For now, let's just show main menu content but with 'CON'
          response = `CON Welcome to FreshCart! 🧺\n1. Shop by Category\n2. My Latest Order\n3. Help & Support`;
        } else {
          const categories = await Product.distinct("category");
          const selectedCat = categories[parseInt(parts[1]) - 1];

          if (selectedCat) {
            const products = await Product.find({ category: selectedCat }).limit(6);
            let menu = `CON ${selectedCat} for you:\n`;
            products.forEach((p, i) => {
              menu += `${i + 1}. ${p.name} (KES ${p.price})\n`;
            });
            menu += "0. Back";
            response = menu;
          } else {
            response = "END Invalid category selection.";
          }
        }

      } else if (level === 3) {
        // SELECTING A PRODUCT
        if (parts[2] === "0") {
            response = `CON Select Category:\n(Enter 1 to see categories again)`; // Simplified back
        } else {
          const categories = await Product.distinct("category");
          const selectedCat = categories[parseInt(parts[1]) - 1];
          const products = await Product.find({ category: selectedCat }).limit(6);
          const product = products[parseInt(parts[2]) - 1];

          if (product) {
            response = `CON ${product.name}\nPrice: KES ${product.price}/${product.unit || 'unit'}\nEnter Quantity:`;
          } else {
            response = "END Product not found.";
          }
        }

      } else if (level === 4) {
        // ENTERING QUANTITY
        const categories = await Product.distinct("category");
        const selectedCat = categories[parseInt(parts[1]) - 1];
        const products = await Product.find({ category: selectedCat }).limit(6);
        const product = products[parseInt(parts[2]) - 1];
        const qty = parseInt(parts[3]);

        if (product && !isNaN(qty)) {
          const total = product.price * qty;
          response = `CON Total: KES ${total}\nConfirm order for ${qty} ${product.unit || 'unit'}(s)?\n1. Confirm\n2. Cancel`;
        } else {
          response = "END Invalid quantity.";
        }

      } else if (level === 5) {
        // CONFIRMATION
        if (parts[4] === "1") {
          const categories = await Product.distinct("category");
          const selectedCat = categories[parseInt(parts[1]) - 1];
          const products = await Product.find({ category: selectedCat }).limit(6);
          const product = products[parseInt(parts[2]) - 1];
          const qty = parseInt(parts[3]);
          const total = product.price * qty;

          const newOrder = new Order({
            items: [{
              productId: product._id,
              name: product.name,
              price: product.price,
              quantity: qty
            }],
            totalAmount: total,
            customerPhone: phoneNumber,
            orderStatus: "Pending",
            paymentStatus: "Pending"
          });

          await newOrder.save();
          response = `END Order Placed! ✅\nOrder ID: #${newOrder._id.toString().slice(-6)}\nTotal: KES ${total}\nWe will call you shortly.`;
        } else {
          response = "END Order cancelled. Thank you for visiting FreshCart.";
        }
      }

    } else if (parts[0] === "2") {
      // ORDER TRACKING
      const lastOrder = await Order.findOne({ customerPhone: phoneNumber }).sort({ createdAt: -1 });
      if (lastOrder) {
        response = `END Status for #${lastOrder._id.toString().slice(-6)}:\n${lastOrder.orderStatus} 🚚\nTotal: KES ${lastOrder.totalAmount}`;
      } else {
        response = `END You haven't placed any orders yet. Dial *384*3133567# to start!`;
      }

    } else if (parts[0] === "3") {
      // SUPPORT
      response = `END FreshCart Support 📞\nPhone: 0700 123 456\nLocation: Nairobi, KE\nOpen 24/7.`;

    } else {
      response = "END Invalid option. Goodbye!";
    }

  } catch (error) {
    console.error("USSD Error:", error);
    response = "END Sorry, an error occurred. Please try again later.";
  }

  res.set("Content-Type", "text/plain");
  res.send(response);
};
