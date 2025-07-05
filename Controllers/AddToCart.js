import CartItem from "../Model/AddToCart.js";

export const addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.user._id || req.user.id;

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    const unitPrice = menuItem.price;

    let cartItem = await CartItem.findOne({ menuItemId, userId });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      cartItem.price = unitPrice * cartItem.quantity; // ✅ Use DB price
      await cartItem.save();
    } else {
      cartItem = await CartItem.create({
        menuItemId,
        name: menuItem.name,
        price: unitPrice * (quantity || 1),
        quantity: quantity || 1,
        userId,
      });
    }

    res.status(201).json({ message: "Item Added To Cart", success: true, data: cartItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// Get cart items for a user
export const getCartItems = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
//  console.log("Fetching cart for userId:", userId);

    const cartItems = await CartItem.find({ userId });
    // console.log(cartItems);
    
    res.json({ success: true, data: cartItems });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// Remove Quantity 
export const decreaseCartItemQuantity = async (req, res) => {
  try {
    const { menuItemId } = req.body; 
    const userId = req.user._id || req.user.id;

    const cartItem = await CartItem.findOne({ menuItemId, userId });

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (cartItem.quantity > 1) {
      cartItem.quantity -= 1;
      await cartItem.save();
      res.json({message: 'Item Quantity Decrease from cart', success: true, data: cartItem });
    } else {
      await CartItem.findByIdAndDelete(cartItem._id);
      res.json({ success: true, message: 'Item removed from cart' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
