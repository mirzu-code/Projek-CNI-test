-- 003_seed_default_menus.sql
-- Run this in the Supabase SQL Editor to populate all default menu items.

-- First, empty the current menus table (optional, but prevents duplication)
-- TRUNCATE TABLE menus;

INSERT INTO menus (name, price, cuisine_id, description, image, is_active) VALUES
-- MALAY CUISINE (cuisine_id = 1)
('Daging Salai Masak Lemak Cili Api', 38.00, 1, 'Slow-smoked premium beef brisket simmered in a fiery, rich gravy of fresh coconut milk, turmeric, bird''s eye chilies (cili api), and sliced local starfruit.', 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=600&q=80', true),
('Ayam Rendang Lembayung', 26.00, 1, 'Tender chicken slow-braised in a luxurious spice paste with toasted coconut, lemongrass, and galangal.', 'https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=600&q=80', true),
('Ikan Bakar Petai', 30.00, 1, 'Fresh red snapper grilled with spicy sambal and petai in banana leaf.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', true),
('Nasi Lemak Pandan Heritage', 22.00, 1, 'Basmati rice steamed with fresh pandan juice and coconut milk. Served with aromatic sweet-spicy anchovy sambal, spiced fried chicken, boiled eggs, and roasted peanuts.', 'https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&w=600&q=80', true),
('Nasi Kerabu Kampung', 25.00, 1, 'Blue herb rice with tender grilled spiced chicken, crispy anchovies, salted egg, and aromatic sambal tempoyak.', 'https://images.unsplash.com/photo-1548943487-a2e4f43b4850?auto=format&fit=crop&w=600&q=80', true),
('Udang Masak Lemak Cili Api', 30.00, 1, 'Succulent prawns cooked in spicy coconut gravy with aromatic herbs and house chillies.', 'https://images.unsplash.com/photo-1559742811-822873691fc8?auto=format&fit=crop&w=600&q=80', true),
('Ayam Percik Panggang', 28.00, 1, 'Grilled chicken basted in a fragrant, spicy coconut sauce, finished with smoky char marks.', 'https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&w=600&q=80', true),

-- CHINESE CUISINE (cuisine_id = 2)
('Ginger Onion Steamed Sea Bass', 38.00, 2, 'Pristine fresh sea bass steamed to flaky perfection, topped with julienned young ginger, spring onions, fresh coriander, and drizzled with a premium seasoned hot soy sauce.', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', true),
('Szechuan Chili Maple Tofu', 28.00, 2, 'Silken tofu cubes sautéed with a fiery house-crafted Szechuan pepper oil, fermented broad beans paste (doubanjiang), garlic, and a hint of organic maple syrup for a sweet-spicy crunch.', 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?auto=format&fit=crop&w=600&q=80', true),
('Hainanese Chicken Rice Platter', 28.00, 2, 'Traditional poached corn-fed chicken, served with aromatic ginger rice, crushed ginger dip, dark soy paste, and red chili lime sambal.', 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?auto=format&fit=crop&w=600&q=80', true),
('Cantonese Egg Gravy Noodles (Wat Tan Hor)', 26.00, 2, 'Flat rice noodles wok-seared with silky egg gravy, wild mushrooms, pak choy, and premium shrimp.', 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80', true),
('Kung Pao Prawns', 32.00, 2, 'Juicy prawns wok-seared with dried chilli, peanuts, and house black bean soy glaze.', 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80', true),
('Char Siew Bao', 24.00, 2, 'Steamed fluffy bao buns filled with sweet sticky char siew pork and a drizzle of hoisin.', 'https://images.unsplash.com/photo-1582650859079-ee63913ecb84?auto=format&fit=crop&w=600&q=80', true),
('Lotus Leaf Chicken Rice Parcel', 28.00, 2, 'Marinated rice and chicken wrapped in lotus leaf, steamed until fragrant for a warming, easy-to-share meal.', 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80', true),
('Mala Beef Noodles', 32.00, 2, 'Tender slices of beef in a mala broth with noodles, bok choy, and pickled vegetables for a bold, satisfying bowl.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', true),
('Steamed Fish with Black Bean Sauce', 38.00, 2, 'Fresh white fish steamed with garlic, fermented black beans, ginger, and scallion oil.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', true),

-- JAPANESE CUISINE (cuisine_id = 3)
('Wagyu Beef Black Garlic Ramen', 38.00, 3, 'Creamy tonkotsu broth with black garlic aroma oil, house noodles, and premium melt-in-your-mouth wagyu beef slices.', 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?auto=format&fit=crop&w=600&q=80', true),
('Truffle Salmon Sashimi Don', 30.00, 3, 'Thick Norwegian salmon sashimi seasoned with truffle soy sauce, served over warm sushi rice with ikura.', 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', true),
('Chef''s Choice Premium Sushi Platter', 35.00, 3, 'A delicate curation of 8 hand-pressed nigiri and 6 signature maki rolls, featuring salmon belly, fatty tuna, sweet shrimp, and unagi.', 'https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80', true),
('Crispy Seafood & Veg Tempura', 35.00, 3, 'A classic crispy assortment of fresh tiger prawns, sweet potato, lotus root, and eggplant served with warm dashi broth.', 'https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=600&q=80', true),
('Sukiyaki Udon Hotpot', 39.00, 3, 'Comforting sukiyaki broth with udon noodles, thin beef slices, mushroom medley, and silky tofu.', 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80', true),
('Salmon Mentaiko Don', 32.00, 3, 'Grilled salmon with creamy mentaiko sauce on warm rice, sprinkled with nori and spring onion.', 'https://images.unsplash.com/photo-1633504581786-316c8002b1b9?auto=format&fit=crop&w=600&q=80', true),
('Chirashi Sushi Bowl', 34.00, 3, 'Assorted sashimi and marinated seafood over warm vinegared sushi rice, garnished with ikura and shiso leaf.', 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=600&q=80', true),
('Grilled Yaki Onigiri', 22.00, 3, 'Crispy grilled rice balls brushed with sweet soy glaze and toasted sesame.', 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', true),
('Matcha Anmitsu', 22.00, 3, 'A deconstructed traditional dessert bowl with matcha jelly, red bean, mochi, and black sugar syrup.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),

-- WESTERN CUISINE (cuisine_id = 4)
('Black Angus Ribeye Steak', 42.00, 4, '300g pasture-raised Angus ribeye, charcoal-broiled and served with roasted tomatoes, truffle butter, and peppercorn sauce.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', true),
('Pan-Seared Citrus Salmon', 32.00, 4, 'Crispy-skin salmon fillet with herb oil, served on buttery baby potatoes, asparagus, and citrus cream.', 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80', true),
('Truffle Wild Mushroom Fettuccine', 32.00, 4, 'Al dente house-crafted egg fettuccine tossed in a rich, velvety cream sauce loaded with sautéed wild porcini and chanterelle mushrooms, freshly grated Pecorino Romano, and organic white truffle oil.', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?auto=format&fit=crop&w=600&q=80', true),
('Signature Double Wagyu Burger', 42.00, 4, 'Two 120g premium custom-ground Wagyu beef patties, flame-grilled and layered with melted aged sharp Cheddar, smoked truffle mayo, crispy onion rings, and housed inside toasted sweet brioche buns. Served with hand-cut gold fries.', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80', true),
('Classic Beef Wellington', 38.00, 4, 'Tender beef fillet wrapped in mushroom duxelles and golden pastry, served with Madeira jus.', 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', true),
('Herb-Crusted Lamb Rack', 42.00, 4, 'Juicy lamb rack with rosemary-parsley crust, served with confit carrots and minted pea purée.', 'https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=600&q=80', true),
('Wild Mushroom Risotto', 28.00, 4, 'Creamy arborio risotto with sautéed wild mushrooms, Parmesan, and a splash of white wine.', 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=600&q=80', true),
('Lemon Chicken Piccata', 38.00, 4, 'Pan-fried chicken breast in a light lemon caper sauce, served with mashed potato and seasonal greens.', 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80', true),
('Steak & Ale Mini Pies', 28.00, 4, 'Individual golden pastry pies filled with slow-braised beef and rich ale gravy.', 'https://images.unsplash.com/photo-1621510456681-23a23cfb5f57?auto=format&fit=crop&w=600&q=80', true),

-- INDIAN CUISINE (cuisine_id = 5)
('Aromatic Lamb Shank Biryani', 36.00, 5, 'Ultra-tender lamb shank slow-cooked with basmati rice, saffron, rose water, and fragrant whole spices.', 'https://images.unsplash.com/photo-1585938338392-50a5d22b6073?auto=format&fit=crop&w=600&q=80', true),
('Tandoori Butter Chicken Masala', 32.00, 5, 'Boneless chicken thighs marinated in spiced yogurt, roasted in the tandoor, and simmered in a rich velvety cashew tomato sauce.', 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80', true),
('Paneer Tikka Butter Masala', 28.00, 5, 'Fresh paneer skewers with capsicum and onion, grilled in the tandoor and simmered in a silky tomato gravy.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', true),
('Garlic Cheese Naan Platter', 25.00, 5, 'A basket of three fluffy flatbreads stuffed with mozzarella, topped with garlic and ghee.', 'https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&w=600&q=80', true),
('Chicken Tikka Masala', 32.00, 5, 'Tandoori chicken pieces simmered in a creamy tomato-cashew gravy with warm spice notes.', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=600&q=80', true),
('Vegetable Biryani', 28.00, 5, 'Aromatic vegetable biryani cooked with saffron, mixed vegetables, and fragrant whole spices.', 'https://images.unsplash.com/photo-1585938338392-50a5d22b6073?auto=format&fit=crop&w=600&q=80', true),
('Lamb Rogan Josh', 38.00, 5, 'Melt-in-your-mouth lamb simmered in Kashmiri chilli, yogurt, and whole spices.', 'https://images.unsplash.com/photo-1545247181-516773cae76d?auto=format&fit=crop&w=600&q=80', true),
('Mutton Seekh Kebab', 36.00, 5, 'Spiced minced mutton skewers grilled over live charcoal and served with mint chutney.', 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80', true),
('Dal Makhani', 28.00, 5, 'Slow-cooked black lentils enriched with cream, butter, and a fragrant spice blend.', 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80', true),

-- DESSERTS (cuisine_id = 6)
('Kuih Bingka Ubi', 12.00, 6, 'Traditional baked cassava cake with a caramelized top, served warm and fragrant.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Ondeh-Ondeh', 14.00, 6, 'Glutinous rice balls filled with melted gula Melaka and rolled in freshly grated coconut.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Seri Muka', 13.00, 6, 'Layered pandan custard and glutinous rice with a creamy, fragrant finish.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Kuih Lapis', 15.00, 6, 'Multi-layered steamed cake featuring vibrant colours and silky pandan aroma.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Mango Sticky Rice', 18.00, 6, 'Sweet sticky rice topped with ripe mango slices and rich coconut cream.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Hong Kong Egg Tart', 14.00, 6, 'Flaky pastry tart with silky smooth egg custard, a beloved Hong Kong bakery favourite.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Mini Tiramisu Cup', 16.00, 6, 'Creamy coffee-soaked ladyfingers layered with mascarpone cream and dusted with cocoa.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Cendol Gelato', 16.00, 6, 'Frozen pandan cendol ice cream with gula Melaka swirls and shaved coconut.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Kuih Ketayap', 14.00, 6, 'Soft pandan pancake roll filled with sweet grated coconut and palm sugar.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true),
('Tapai Pulut', 13.00, 6, 'Fermented glutinous rice with sweet-sour depth, a nostalgic kuih finish.', 'https://images.unsplash.com/photo-1551024735-1f5f2d6c2d7d?auto=format&fit=crop&w=600&q=80', true);
