import express from 'express';
import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const app = express();
const port = 3000;

const { Pool } = pg;
const pool = new Pool({
    connectionString: `${process.env.DB_URL}`
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));


app.get('/', (req, res) => {
    res.send('Привіт! Це мій API для машин. Перейди на сторінку /table, щоб побачити список.');
});

app.get('/envfile', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menu</title> </head>
      <body style="margin:0; background:black; display:flex; align-items:center; justify-content:center; height:100vh; overflow:hidden;">
        
        <h1 style="color:white; font-family:sans-serif; cursor:pointer;" id="click-me">Inspect .env file</h1>
        
        <video id="envfile" style="display:none; width:100%; height:100%;" src="/envfile.mp4" loop></video>
        
        <script>
          // 3. Тепер JavaScript правильно шукає відео за ID "envfile"
          const v = document.getElementById('envfile');
          const h = document.getElementById('click-me');
          
          document.body.addEventListener('click', () => {
            h.style.display = 'none'; // Ховаємо текст
            v.style.display = 'block'; // Показуємо відео
            v.volume = 1.0; // Гучність на 100%
            v.play(); // Запускаємо
            
            // Відкриваємо на весь екран для максимального ефекту!
            if (v.requestFullscreen) {
                v.requestFullscreen();
            } else if (v.webkitRequestFullscreen) { /* Для Safari */
                v.webkitRequestFullscreen();
            } else if (v.msRequestFullscreen) { /* Для старих браузерів */
                v.msRequestFullscreen();
            }
          });
        </script>
      </body>
      </html>
    `);
});

app.get('/vibecoding', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Menu</title> </head>
      <body style="margin:0; background:black; display:flex; align-items:center; justify-content:center; height:100vh; overflow:hidden;">
        
        <h1 style="color:white; font-family:sans-serif; cursor:pointer;" id="click-me">🍷</h1>
        
        <video id="ronaldo" style="display:none; width:100%; height:100%;" src="/ronaldo.mp4" loop></video>
        
        <script>
          // 3. Тепер JavaScript правильно шукає відео за ID "envfile"
          const v = document.getElementById('ronaldo');
          const h = document.getElementById('click-me');
          
          document.body.addEventListener('click', () => {
            h.style.display = 'none'; // Ховаємо текст
            v.style.display = 'block'; // Показуємо відео
            v.volume = 1.0; // Гучність на 100%
            v.play(); // Запускаємо
            
            // Відкриваємо на весь екран для максимального ефекту!
            if (v.requestFullscreen) {
                v.requestFullscreen();
            } else if (v.webkitRequestFullscreen) { /* Для Safari */
                v.webkitRequestFullscreen();
            } else if (v.msRequestFullscreen) { /* Для старих браузерів */
                v.msRequestFullscreen();
            }
          });
        </script>
      </body>
      </html>
    `);
});
app.get('/table', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cars ORDER BY id ASC');

        let html = `
            <!DOCTYPE html>
            <html lang="uk">
            <head>
                <meta charset="UTF-8">
                <title>Мої Автомобілі</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 40px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                    th { background-color: #007bff; color: white; }
                    tr:nth-child(even) { background-color: #f2f2f2; }
                    tr:hover { background-color: #ddd; }
                </style>
            </head>
            <body>
                <h2>🛻🚗🚐 Каталог автомобілів🚗🛻🚐</h2>
                <form action="/add-car" method="POST" style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border: 1px solid #ccc;">
                    <h3>➕ Додати нове авто➕</h3>
                    <input type="text" name="car_brand" placeholder="Бренд" required>
                    <input type="text" name="car_model" placeholder="Модель" required>
                    <input type="text" name="engine_type" placeholder="Двигун (напр. 3.0L)" required>
                    <input type="text" name="horsepower" placeholder="Потужність" required>
                    <input type="text" name="weight" placeholder="Вага">
                    <input type="text" name="acceleration_0_to_100" placeholder="Розгін до 100">
                    <input type="text" name="price" placeholder="Ціна">
                    <button type="submit" style="background: #28a745; color: white; border: none; padding: 5px 10px; cursor: pointer;">Додати</button>
                </form>

                <table>
                    <tr>
                        <th>ID</th>
                        <th>Бренд</th>
                        <th>Модель</th>
                        <th>Двигун</th>
                        <th>Потужність</th>
                        <th>Вага</th>
                        <th>0-100 км/год</th>
                        <th>Ціна</th>
                        <th>Дії</th>
                    </tr>
        `;

        
        for (const car of rows) {
            html += `
                <tr>
                    <td>${car.id}</td>
                    <td><b>${car.car_brand}</b></td>
                    <td>${car.car_model}</td>
                    <td>${car.engine_type}</td>
                    <td>${car.horsepower}</td>
                    <td>${car.weight}</td>
                    <td>${car.acceleration_0_to_100}</td>
                    <td>${car.price}</td>
                    <td>
                        <form action="/delete-car/${car.id}" method="POST" style="margin: 0;">
                            <button type="submit" style="background: #dc3545; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 3px;">Видалити</button>
                        </form>
                    </td>
                </tr>
            `;
        }

        html += `
                </table>
            </body>
            </html>
        `;

        res.send(html);

    } catch (error) {
        console.error("Помилка бази даних:", error);
        res.status(500).send("<h1>Помилка сервера</h1>");
    }
});

app.get('/cars', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM cars ORDER BY id ASC');
        if (rows.length === 0) {
            res.json({ message: "База порожня." });
        } else {
            res.json(rows);
        }
    } catch (error) {
        console.error("Помилка бази даних:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});

app.post('/cars', async (req, res) => {
    const { car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price } = req.body;
    if (!car_brand || !car_model || !engine_type || !horsepower) {
        return res.status(400).json({ error: "Помилка: Недостатньо даних!" });
    }
    try {
        const insertQuery = `INSERT INTO cars (car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        await pool.query(insertQuery, [car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price]);
        res.status(201).json({ message: `Авто додано успішно!` });
    } catch (error) {
        console.error("Помилка при додаванні авто:", error);
        res.status(500).json({ error: "Помилка сервера" });
    }
});

app.post('/add-car', async (req, res) => {
    const { car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price } = req.body;
    try {
        const insertQuery = `INSERT INTO cars (car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price) VALUES ($1, $2, $3, $4, $5, $6, $7)`;
        await pool.query(insertQuery, [car_brand, car_model, engine_type, horsepower, weight, acceleration_0_to_100, price]); 
        res.redirect('/table');
    } catch (error) {
        console.error("Помилка при додаванні авто:", error);
        res.status(500).send("Виникла помилка при збереженні.");
    }
});

app.post('/delete-car/:id', async (req, res) => {
    const carId = req.params.id; 
    try {
        await pool.query('DELETE FROM cars WHERE id = $1', [carId]);
        res.redirect('/table'); 
    } catch (error) {
        console.error("Помилка при видаленні:", error);
        res.status(500).send("Не вдалося видалити авто.");
    }
});


app.listen(port, () => {
    console.log(`Сервер успішно запущено на http://localhost:${port}`);
});