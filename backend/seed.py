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
            {"name": "Margherita Pizza", "price": 12.50, "category": "Mains"},
            {"name": "Pepperoni Pizza", "price": 14.00, "category": "Mains"},
            {"name": "BBQ Chicken Pizza", "price": 15.50, "category": "Mains"},
            {"name": "Classic Cheeseburger", "price": 10.99, "category": "Mains"},
            {"name": "Mushroom Swiss Burger", "price": 12.50, "category": "Mains"},
            {"name": "Spaghetti Carbonara", "price": 13.50, "category": "Mains"},
            {"name": "Penne Arrabbiata", "price": 11.50, "category": "Mains"},
            {"name": "Grilled Chicken Breast", "price": 15.75, "category": "Mains"},
            {"name": "Ribeye Steak", "price": 24.99, "category": "Mains"},
            {"name": "Grilled Salmon", "price": 19.50, "category": "Mains"},
            {"name": "Caesar Salad", "price": 8.99, "category": "Starters"},
            {"name": "Tomato Soup", "price": 6.50, "category": "Starters"},
            {"name": "Bruschetta", "price": 7.25, "category": "Starters"},
            {"name": "Mozzarella Sticks", "price": 7.50, "category": "Starters"},
            {"name": "Hummus Plate", "price": 8.00, "category": "Starters"},
            {"name": "French Fries", "price": 4.50, "category": "Sides"},
            {"name": "Onion Rings", "price": 5.50, "category": "Sides"},
            {"name": "Mashed Potatoes", "price": 5.00, "category": "Sides"},
            {"name": "Turkish Tea", "price": 2.00, "category": "Drinks"},
            {"name": "Peach Iced Tea", "price": 3.50, "category": "Drinks"},
            {"name": "Ayran", "price": 2.50, "category": "Drinks"},
            {"name": "Coca Cola", "price": 2.50, "category": "Drinks"},
            {"name": "Lemonade", "price": 3.00, "category": "Drinks"},
            {"name": "Iced Coffee", "price": 4.50, "category": "Drinks"},
            {"name": "Orange Juice", "price": 3.50, "category": "Drinks"},
            {"name": "Water", "price": 2.00, "category": "Drinks"},
            {"name": "Chocolate Brownie", "price": 6.50, "category": "Desserts"},
            {"name": "Tiramisu", "price": 7.50, "category": "Desserts"},
            {"name": "Cheesecake", "price": 7.00, "category": "Desserts"},
            {"name": "Apple Pie", "price": 6.00, "category": "Desserts"}
        ]

        for item_data in raw_items:
            cat_id = categories[item_data["category"]].id
            new_item = MenuItem(name=item_data["name"], price=item_data["price"], category_id=cat_id)
            session.add(new_item)

        session.commit()
        print("Database seeding completed.")

if __name__ == "__main__":
    print("Seeding database...")
    seed_database()
