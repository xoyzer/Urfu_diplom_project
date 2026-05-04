/*
  # Update Products and Add New Categories

  1. New Products in Смеси category
    - Цемент М500

  2. New Products in Бордюры category
    - Бордюр 400x200x50 "Туман"
    - Бордюр 400x200x50 "Вегас"
    - Бордюр 400x200x50 "Тирамису"

  3. Remove Плитка category products if needed
*/

DO $$
BEGIN
  -- Insert Cement product in Смеси category
  INSERT INTO products (name, category, price_per_sqm, stock_quantity, description)
  VALUES
    ('Цемент М500', 'Смеси', 350, 200, 'Портландцемент М500 высокого качества')
  ON CONFLICT DO NOTHING;

  -- Insert border products in Бордюры category
  INSERT INTO products (name, category, price_per_sqm, stock_quantity, description)
  VALUES
    ('Бордюр 400x200x50 "Туман"', 'Бордюры', 280, 150, 'Бетонный бордюр размером 400x200x50 мм'),
    ('Бордюр 400x200x50 "Вегас"', 'Бордюры', 290, 120, 'Декоративный бордюр размером 400x200x50 мм'),
    ('Бордюр 400x200x50 "Тирамису"', 'Бордюры', 300, 100, 'Премиум бордюр размером 400x200x50 мм')
  ON CONFLICT DO NOTHING;
END $$;