//  Если прогнать скрипт через index.js все ок,
// но при итоговой проверке выпадают ошибки на половине кейсов
// Понять в чем причина так и не смог.
// ------------------------------------------------
//Проверка работоспособности класса GoodsList › Проверить список товаров после установки фильтра
// 
// expect(received).toHaveProperty(path)
// 
// Expected path: "remove"
// Received path: []
// ------------------------------------------------
// Received value: {"filter": null, "sortDir": true, "sortPrice": false}

// Товар
class Good { 
 
    constructor(id,name,description,sizes,price,available) { 
        this.id = id,
        this.name = name,
        this.description = description,
        this.sizes = sizes,
        this.price = price,
        this.available = available
    }
    // метод, который позволяет установить доступность (наличие) товара.
    setAvailable(bool) { 
        this.available = bool;
    }
}
// Список товаров
class GoodsList {
    #goods = [];
    constructor() {
        this.sortPrice = false,
        this.sortDir = true,
        this.filter = null
    }
    // Геттер, обращается к приватному списку #goods и возвращет его после валидации и фильтрации
    get list() {
        
        let listOfGoods = [...this.#goods.filter((el) => el.available && el)];
        if (this.filter !== null) {
            listOfGoods = listOfGoods.filter((el) => {
                const found = el.name.match(this.filter);
                if (found !== null) {
                    return el;
                }
            })
        };
        if (this.sortDir && this.sortPrice) {
            listOfGoods.sort((a,b) => a.price - b.price)
        } else {listOfGoods.sort((a,b) => b.price - a.price)}
        
        return listOfGoods;
    }
    // Добавляет товар в список если он доступен
    add(el) {
        el.available && this.#goods.push(el)
    }
}
// Не совсем понял зачем этот класс т.к он по сути наследует Good,
// только что бы отслеживать количество в корзине?
   class BasketGood extends Good {
       constructor(id,name,description,sizes,price,available, amount) {
        super(id,name,description,sizes,price,available)
           this.amount = amount // Кол-во товара в корзине
        }
    }

 class Basket {
    constructor() {
        this.goods = [] // Список товаров в корзине
    }
    add(good,amount) {
        let flag = false;
        // Проверка есть ли товар в корзине, если да то меняем amount
        for (let i = 0; i < this.goods.length; ++i) {
            if (this.goods[i].id === good.id) {
                this.goods[i].amount += good.amount;
                flag = true;
            }
        }
        if (!flag) {
            good.amount = amount
            this.goods.push(good)
        }
    }
    // Тоже самое только удаляем
    remove(good,amount) {
        for (let i = 0; i < this.goods.length; ++i) {
            if (this.goods[i].id === good.id) {
                this.goods[i].amount -= amount;
                if (this.goods[i].amount <= 0) {
                    this.goods.splice([i],1)
                    }
                }
            }
    }
    // Геттер на получение кол-ва
    get totalAmount() {
        let counter = 0;
        for (let good of this.goods) {
            counter += good.amount;
        }
        return counter;
    }
    // Геттер на получение итоговой суммы корзины
    get totalSumm() {
        let counter = 0;
        for (let good of this.goods) {
            counter += good.price;
        }
        return counter;
    }
    // Очитска корзины
    clear () {
        this.goods = []
    }
    // Удаление недоступных товаров
    removeUnavailable() {
        this.goods = this.goods.filter((el) => el.available === true)
    }
 }

// export { Good, GoodsList, BasketGood, Basket };

const data = [
    [1, "Ботинки Саламандра", "Очень качественная обувь", [39, 40, 41, 43, 44, 45], 3490, true],
    [2, "Рубашка", "Удобная рубашка для костюма", ["S", "M", "L", "XXL", "XXXL"], 770, true],
    [3, "Брюки черные", "Элегантные брюки на лубой случай", ["S", "M", "L", "XXL", "XXXL"], 1090, true],
    [4, "Ботинки Ральф", "№1 для состоятельных граждан", [41, 42, 43, 44, 45, 46], 5990, true],
    [5, "Костюм спортивный синий", "Для походов в горы", ["M", "L", "XL", "XXL"], 2790, true],
    [6, "Костюм спортивный розовый", "Для стройных дам", ["XS", "S", "M", "L"], 2290, true],
    [7, "Костюм спортивный детский", "Для самых маленьких", [96, 104, 113, 127, 136], 1490, true],
    [8, "Кроссовки спортивные", "Для всей семьи", [27, 31, 33, 37, 39, 41, 42, 43, 45, 46, 47, 48], 3190, true],
];

// Список товаров

const goodsList = new GoodsList();
const goods = [];

data.forEach((params) => {
    const [id] = params;
    const good = new Good(...params);

    if (id > 1 && id <=5 && id % 2 > 0) {
        good.setAvailable(false);
    }

    goodsList.add(good);
    goods.push(good);
});

// ------------------------- indexe.js tests -------------------------

console.log("--------------------");
console.log("Посмотрим на весь список товаров что у нас есть:");
console.log(goodsList.list);
console.log("Видно что 3-й и 5-й товары не значятся в общем списке товаров, потому что у них свойство available = false");
console.log("--------------------");

goodsList.filter = /спорт/i;

console.log("--------------------");
console.log("Применим фильтр к нашему списку товаров");
console.log("Ожидаем что будет получен список товаров где в названии присутствует \"спорт\":");
console.log(goodsList.list);
console.log("--------------------");

const eight = goods.find((good) => good.id === 8);

eight.setAvailable(false);

console.log("--------------------");
console.log("А в данный момент 8-й товар не доступен для продажи в магазине");
console.log("И этот товар не попадает в отфильтрованный список с фильтром \"спорт\":");
console.log(goodsList.list);
console.log("--------------------");

goodsList.filter = null;
goodsList.sortPrice = true;
goodsList.sortDir = false;
console.log("--------------------");
console.log("Сбросим фильтр, и отсортируем список товаров по убыванию цены товара");
console.log(goodsList.list);
console.log("--------------------");

goodsList.sortDir = true;
console.log("--------------------");
console.log("А теперь отсортируем список товаров по возростанию цены товара");
console.log(goodsList.list);
console.log("--------------------");

// Корзина
console.log("====================");
console.log("Посмотрим - как у нас работает Корзина покупок?");

const basket = new Basket();
const boots = goods.find((good) => good.id === 4);
const shirt = goods.find((good) => good.id === 2);
const pant =  goods.find((good) => good.id === 3);

pant.setAvailable(true);

console.log("--------------------");
console.log("Добавим в корзину 5 пар ботинок, одну рубашку, и одни брюки");

basket.add(boots, 5);
basket.add(shirt, 1);
basket.add(pant, 1);

console.log("Общее количество:", basket.totalAmount);
console.log("--------------------");
console.log("Вообще и одной пары ботинок хватит");

basket.remove(boots, 4);

console.log("Общее количество:", basket.totalAmount);
console.log("Общая сумма:", basket.totalSumm);
console.log("--------------------");
console.log("Пока удаляли товары из корзины, рубашки все раскупили. Ничего не осталось");

const order = basket.goods.find((item) => item.id === shirt.id);

order.setAvailable(false);

basket.removeUnavailable();

console.log("Общее количество:", basket.totalAmount);

console.log("--------------------");
console.log("Тогда нет смысла покупать что либо. Удалить всё из корзины");

basket.clear();

console.log("Общее количество:", basket.totalAmount);
console.log("Общая сумма:", basket.totalSumm);
console.log("--------------------");