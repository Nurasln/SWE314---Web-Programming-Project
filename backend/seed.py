from sqlmodel import Session
from database import engine, create_db_and_tables
from models import Table, MenuItem, Category

def seed_database():
    # Ensure tables are created first
    create_db_and_tables()
    
    with Session(engine) as session:
        # Tables
        for number in range(1, 6):
            if not session.query(Table).filter_by(number=number).first():
                session.add(Table(number=number))
        session.commit()

        # Wipe old categories and menu items
        from sqlmodel import delete
        session.execute(delete(MenuItem))
        session.execute(delete(Category))
        session.commit()

        # Categories
        cat_data = {
            "Mains": "Main Courses",
            "Starters": "Appetizers and starters",
            "Sides": "Side dishes",
            "Drinks": "Beverages",
            "Desserts": "Sweet desserts"
        }
        
        categories = {}
        for name, desc in cat_data.items():
            cat = Category(name=name, description=desc)
            session.add(cat)
            session.commit()
            session.refresh(cat)
            categories[name] = cat

        # Menu Items
        raw_items = [
<<<<<<< Updated upstream
            {"name": "Margherita Pizza", "price": 12.50, "category": "Mains", "ingredients": "Tomato sauce, mozzarella cheese, fresh basil. (Vegetarian)"},
            {"name": "Pepperoni Pizza", "price": 14.00, "category": "Mains", "ingredients": "Tomato sauce, mozzarella cheese, pepperoni slices."},
=======
<<<<<<< HEAD
            {"name": "Pepperoni Pizza", "price": 14.00, "category": "Mains", "ingredients": "Tomato sauce, mozzarella cheese, pepperoni slices."},
            {"name": "Margherita Pizza", "price": 12.50, "category": "Mains", "ingredients": "Tomato sauce, mozzarella cheese, fresh basil. (Vegetarian)"},
=======
            {"name": "Margherita Pizza", "price": 12.50, "category": "Mains", "ingredients": "Tomato sauce, mozzarella cheese, fresh basil. (Vegetarian)"},
            {"name": "Pepperoni Pizza", "price": 14.00, "category": "Mains", "ingredients": "Tomato sauce, mozzarella cheese, pepperoni slices."},
>>>>>>> fc23f1b2b2de1913e8741bd8e5206652ecf1659b
>>>>>>> Stashed changes
            {"name": "BBQ Chicken Pizza", "price": 15.50, "category": "Mains", "ingredients": "BBQ sauce, mozzarella cheese, grilled chicken, red onions."},
            {"name": "Classic Cheeseburger", "price": 10.99, "category": "Mains", "ingredients": "Beef patty, cheddar cheese, lettuce, tomato, pickles, burger bun. (Contains Gluten, Dairy)"},
            {"name": "Mushroom Swiss Burger", "price": 12.50, "category": "Mains", "ingredients": "Beef patty, Swiss cheese, sautéed mushrooms, red onions, burger bun. (Contains Gluten, Dairy)"},
            {"name": "Spaghetti Carbonara", "price": 13.50, "category": "Mains", "ingredients": "Authentic Italian spaghetti in creamy egg yolk sauce, Pecorino Romano cheese, crispy pancetta, black pepper. (Contains Gluten, Dairy)"},
            {"name": "Penne Arrabbiata", "price": 11.50, "category": "Mains", "ingredients": "Penne pasta, spicy tomato sauce, garlic, red chili flakes. (Vegan, Contains Gluten)"},
            {"name": "Grilled Chicken Breast", "price": 15.75, "category": "Mains", "ingredients": "Olive oil & herb marinated grilled chicken breast, char-grilled zucchini, bell peppers, fresh lemon. (Gluten-Free)"},
            {"name": "Ribeye Steak", "price": 24.99, "category": "Mains", "ingredients": "Premium ribeye steak, garlic butter, rosemary, served with roasted potatoes. (Gluten-Free)"},
            {"name": "Grilled Salmon", "price": 19.50, "category": "Mains", "ingredients": "Fresh salmon fillet, lemon, dill. (Gluten-Free, Pescatarian)"},
            {"name": "Caesar Salad", "price": 8.99, "category": "Starters", "ingredients": "Romaine lettuce, croutons, parmesan cheese, Caesar dressing. (Contains Gluten, Dairy)"},
            {"name": "Tomato Soup", "price": 6.50, "category": "Starters", "ingredients": "Roasted tomatoes, garlic, vegetable broth, cream swirl. (Vegetarian, Gluten-Free)"},
            {"name": "Bruschetta", "price": 7.25, "category": "Starters", "ingredients": "Toasted baguette slices, cherry tomatoes, garlic, fresh basil, extra virgin olive oil, balsamic glaze. (Vegan, Contains Gluten)"},
            {"name": "Mozzarella Sticks", "price": 7.50, "category": "Starters", "ingredients": "Breaded and fried mozzarella cheese, marinara dipping sauce. (Vegetarian, Contains Gluten)"},
            {"name": "Hummus Plate", "price": 8.00, "category": "Starters", "ingredients": "Mashed chickpeas, tahini, olive oil, lemon juice, served with pita bread. (Vegan, Contains Gluten in pita)"},
            {"name": "French Fries", "price": 4.50, "category": "Sides", "ingredients": "Deep-fried potatoes, salt. (Vegan, Gluten-Free)"},
            {"name": "Onion Rings", "price": 5.50, "category": "Sides", "ingredients": "Battered and fried onion slices. (Vegetarian, Contains Gluten)"},
            {"name": "Mashed Potatoes", "price": 5.00, "category": "Sides", "ingredients": "Velvety mashed potatoes infused with roasted garlic, creamy butter, fresh thyme. (Vegetarian, Gluten-Free)"},
            {"name": "Turkish Tea", "price": 2.00, "category": "Drinks", "ingredients": "Traditional black tea. (Vegan, Gluten-Free)"},
            {"name": "Peach Iced Tea", "price": 3.50, "category": "Drinks", "ingredients": "Black tea, peach syrup, ice. (Vegan, Gluten-Free)"},
            {"name": "Ayran", "price": 2.50, "category": "Drinks", "ingredients": "Yogurt, water, salt. (Vegetarian, Gluten-Free)"},
            {"name": "Coca Cola", "price": 2.50, "category": "Drinks", "ingredients": "Carbonated water, high fructose corn syrup, caramel color. (Vegan, Gluten-Free)"},
            {"name": "Lemonade", "price": 3.00, "category": "Drinks", "ingredients": "Lemon juice, water, sugar. (Vegan, Gluten-Free)"},
            {"name": "Iced Coffee", "price": 4.50, "category": "Drinks", "ingredients": "Brewed coffee, milk, ice, sugar. (Vegetarian, Gluten-Free)"},
            {"name": "Orange Juice", "price": 3.50, "category": "Drinks", "ingredients": "Freshly squeezed orange juice. (Vegan, Gluten-Free)"},
            {"name": "Water", "price": 2.00, "category": "Drinks", "ingredients": "Bottled mineral water. (Vegan, Gluten-Free)"},
            {"name": "Chocolate Brownie", "price": 6.50, "category": "Desserts", "ingredients": "Chocolate, butter, sugar, eggs, flour. (Vegetarian, Contains Gluten)"},
            {"name": "Tiramisu", "price": 7.50, "category": "Desserts", "ingredients": "Ladyfingers, mascarpone cheese, espresso, cocoa powder. (Vegetarian, Contains Gluten, Dairy)"},
            {"name": "Blueberry Cheesecake", "price": 7.00, "category": "Desserts", "ingredients": "New York style creamy cheesecake, buttery graham cracker crust, rich blueberry compote. (Vegetarian, Contains Gluten)"},
            {"name": "Apple Pie", "price": 6.00, "category": "Desserts", "ingredients": "Apples, cinnamon, sugar, pie crust. (Vegetarian, Contains Gluten)"}
        ]

        for item_data in raw_items:
            cat_id = categories[item_data["category"]].id
            new_item = MenuItem(name=item_data["name"], price=item_data["price"], ingredients=item_data.get("ingredients", ""), category_id=cat_id)
            session.add(new_item)

        session.commit()
        print("Database seeding completed.")

if __name__ == "__main__":
    print("Seeding database...")
    seed_database()
