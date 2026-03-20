import httpx

b_url = "http://127.0.0.1:8000"

def test():
    try:
        # 1. User A at Table 1 orders 2 Teas (id 19)
        o1 = httpx.post(f"{b_url}/orders?table_id=1").json()
        print("Created Order 1:", o1)
        httpx.post(f"{b_url}/orders/{o1['id']}/items?menu_item_id=19&quantity=2")
        print("User A ordered 2 Teas.")
        
        # 2. User B at Table 1 orders 1 Burger (id 4)
        o2 = httpx.post(f"{b_url}/orders?table_id=1").json()
        httpx.post(f"{b_url}/orders/{o2['id']}/items?menu_item_id=4&quantity=1")
        print("User B ordered 1 Burger.")
        
        # 3. Fetch bill for Table 1
        bill = httpx.get(f"{b_url}/tables/1/bill").json()
        print("\n--- Table 1 Bill ---")
        print("Total Unpaid:", bill.get('total_unpaid'))
        for item in bill.get('items', []):
            print(f"- {item['name']} (x{item['quantity']}) : ${item['price']} (ID: {item['order_item_id']})")
        
        # 4. Pay for the burger
        burger_item_id = [item['order_item_id'] for item in bill.get('items', []) if 'Burger' in item['name']][0]
        pay = httpx.post(f"{b_url}/tables/1/pay", json={"order_item_ids": [burger_item_id]}).json()
        print("\nPayment result:", pay)
        
        # 5. Fetch bill again, should only have teas
        bill2 = httpx.get(f"{b_url}/tables/1/bill").json()
        print("\n--- Table 1 Bill after partial payment ---")
        print("Total Unpaid:", bill2.get('total_unpaid'))
        for item in bill2.get('items', []):
            print(f"- {item['name']} (x{item['quantity']}) : ${item['price']} (ID: {item['order_item_id']})")
            
    except Exception as e:
        print("Error:", e)

if __name__ == '__main__':
    test()
