let allGoods = [];

const mainScreen = document.querySelector(".content");
const logoLink = document.querySelector(".logo");
const navigationItems = document.querySelectorAll(".navigation-link");
const buttonCart = document.querySelector(".btn-cart");
const cartCount = document.querySelector(".cart-count");

function setData(key, arrOfItems) {
    localStorage.setItem(key, JSON.stringify(arrOfItems));
}

function getData(key) {
    return JSON.parse(localStorage.getItem(key));
}

const cart = {
    cartGoods: getData("cart") || [],
    addCartId(id) {
        const goodItem = this.cartGoods.find((good) => good.id === +id);
        if (goodItem) {
            this.plusGood(+id, false);
        } else {
            const {
                id: idx,
                title,
                composition,
                image,
                price,
            } = allGoods.find((good) => good.id === +id);
            this.cartGoods.push({
                id: idx,
                title,
                composition,
                image,
                price,
                count: 1,
            });
        }
        cartCount.textContent = +cartCount.textContent + 1;
        setData("cart", this.cartGoods);
    },
    cartRender() {
        mainScreen.innerHTML = "";
        const totalPrice = this.cartGoods.reduce(
            (sum, item) => sum + item.price * item.count,
            0
        );
        const containerCart = document.createElement("div");
        containerCart.className = "page";
        containerCart.innerHTML = `<div class="container">
        <h1>Моя корзина</h1>

        <div class="cart-block" id="cart" data-v-app="">
            <div class="" data-v-267773d7="">
                <div class="cart" data-v-267773d7="">
                    <div class="cart cart-list" id="cart-list" data-v-267773d7="">
                    </div>
                    <div class="cart-total" data-v-267773d7="">
                        <div
                            class="cart-total-price"
                            data-v-267773d7=""
                        >
                            Сумма заказа:
                            <span data-v-267773d7=""
                                ><i data-v-267773d7="">${totalPrice}</i> ₽</span
                            >
                        </div>
                        <!---->
                        <div
                            class="cart-total-buttons"
                            data-v-267773d7=""
                        >
                            <button
                                id="button-order"
                                class="button place_an_order"
                                data-popup="auth"
                                data-v-267773d7=""
                            >
                                Оформить заказ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
        const cartList = containerCart.querySelector(".cart-list");
        this.cartGoods.forEach((good) => cartList.append(renderCardCart(good)));
        const buttonOrder = containerCart.querySelector(".place_an_order");
        if (!this.cartGoods.length) buttonOrder.classList.add("disabled");
        else {
            buttonOrder.classList.remove("disabled");
            buttonOrder.addEventListener("click", () => renderFinalCart());
        }
        mainScreen.append(containerCart);
    },
    plusGood(id, update = true) {
        const goodItem = this.cartGoods.find((good) => good.id === +id);
        if (goodItem) {
            goodItem.count++;
            cartCount.textContent = +cartCount.textContent + 1;
            setData("cart", this.cartGoods);
        }
        if (update) this.cartRender();
    },
    minusGood(id) {
        const goodItem = this.cartGoods.find((good) => good.id === +id);
        if (goodItem.count === 1) {
            this.deleteGood(id);
        } else {
            goodItem.count--;
            cartCount.textContent = +cartCount.textContent - 1;
        }
        setData("cart", this.cartGoods);
        this.cartRender();
    },
    deleteGood(id) {
        this.cartGoods = this.cartGoods.filter((good) => good.id !== +id);
        cartCount.textContent = this.cartGoods.reduce(
            (sum, item) => sum + item.count,
            0
        );
        setData("cart", this.cartGoods);
        this.cartRender();
    },
};

function getGoods() {
    fetch("db/db.json")
        .then((res) => res.json())
        .then((result) => {
            allGoods = result;
        })
        .then((res) => renderMainScreen());
}

function renderMainScreen() {
    mainScreen.innerHTML = "";
    cartCount.textContent = cart.cartGoods.reduce(
        (sum, item) => sum + item.count,
        0
    );
    const birthdayBlock = document.createElement("div");
    birthdayBlock.className = "main-slider-block";
    birthdayBlock.innerHTML = `<div class="main-slider slick-initialized slick-slider" 
    style="width: 100%; display: inline-block; text-align: center">
    <div
        class="slick-slide slick-cloned slick-center"
        data-slick-index="-1"
        aria-hidden="true"
        tabindex="-1"
    >
        <div>
            <span>
                <img
                    border="0"
                    src="img/advertise.jpg"
                    width="750"
                    height="375"
                    alt="Большой микс"
                    title="Большой микс"
                    style="float: right"
                />
            </span>
        </div>
    </div></div>`;
    mainScreen.append(birthdayBlock);
    mainScreen.append(getDOMList("Популярное"));
}

function renderFilterList(value) {
    mainScreen.innerHTML = "";
    mainScreen.append(getDOMList(value));
}

function getDOMList(value) {
    const listBlock = document.createElement("div");
    listBlock.className = "container";
    listBlock.innerHTML = `<div class="page">
    <div class="catalog-main">
        <h1>${value}</h1>
        <div class="products-list loadmore_wrap"></div>
    </div>
    
    <div class="text-home">
        <h2>
            Удобная доставка и широкий выбор блюд японской кухни
            в Суши Пятница
        </h2>
        <p>
            Суши Пятница — лучшее место, где можно заказать еду и
            вкусно покушать! Мы рады предложить вам широкий
            выбор блюд японской кухни, приготовленных по
            традиционным и авторским рецептам, включая роллы и
            суши,&nbsp;которые вы найдете в нашем меню.
        </p>
        <p>
            Наше меню содержит более 100 наименований блюд,
            которые вы можете заказать прямо сейчас на нашем
            сайте и получить с удобной доставкой на дом.
        </p>
        <p>
            Заказать еду и вкусно поесть роллы или суши у нас
            очень просто — выберите нужное блюдо из нашего меню,
            оформите заказ на сайте и наша команда быстро
            привезет его прямо к вашей двери. Мы позаботимся о
            том, чтобы каждый заказ был выполнен максимально
            быстро и качественно, чтобы вы могли насладиться
            свежей и вкусной едой в любое время.
        </p>
    </div></div>`;
    const list = listBlock.querySelector(".products-list");
    list.append(...filterCards(value));
    return listBlock;
}

function filterCards(value) {
    const filter = allGoods.filter((good) =>
        good.category.split(" ").includes(value)
    );
    const cards = filter.map((good) => renderCardMS(good));
    return cards;
}

logoLink.addEventListener("click", (e) => {
    e.preventDefault();
    renderMainScreen();
});

buttonCart.addEventListener("click", () => {
    cart.cartRender();
});

document.querySelector(".content").addEventListener("click", (e) => {
    e.preventDefault();
    const target = e.target.closest(".js_to_cart");
    if (target) {
        cart.addCartId(target.dataset.id);
    }
});

document.querySelector(".content").addEventListener("click", (e) => {
    const cur = [e.target.closest(".cart-item-delete"), e.target.closest(".change-quantity-minus"), 
    e.target.closest(".change-quantity-plus")]
    cur[0] ? cart.deleteGood(cur[0].dataset.id) : 
    cur[1] ? cart.minusGood(cur[1].dataset.id) :
    cart.plusGood(cur[2].dataset.id); 
});

navigationItems.forEach((item) => {
    item.addEventListener("click", (e) => {
        const value = item.textContent;
        renderFilterList(value);
    });
});

function renderCardMS(objCard) {
    const card = document.createElement("div");
    const { id, title, composition, price, image } = objCard;
    card.classList.add("product-item", "loadmore_item", "productAllWrap");
    card.innerHTML = `<a class="product-item-pic" data-id="${id}">
    <img
        src="db/img/${image}"
        class="product-item-image"/>
</a>
<a class="product-item-name" data-id="${id}" title="${title}">
${title}
</a>
<div class="product-item-description">
${composition}
</div>
<div class="product-item-offer">
    <div class="product-item-price">${price} ₽</div>
    <a href="#" class="button js_to_cart" data-id="${id}">Хочу</a
    >
</div>`;
    return card;
}

function renderCardCart(objCard) {
    const card = document.createElement("div");
    const { id, title, composition, price, image, count } = objCard;
    card.innerHTML = `<div
    id="cart-item-295867"
    class="cart-item"
    data-basket-id="295867"
    data-v-267773d7=""
>
    <div
        class="cart-item-col"
        data-v-267773d7=""
    >
        <div
            class="cart-item-photo"
            data-v-267773d7=""
        >
            <!----><img
                src="db/img/${image}"
                alt=""
                data-v-267773d7=""
            />
        </div>
        <div
            class="cart-item-info"
            data-v-267773d7=""
        >
            <h2
                class="cart-item-title"
                data-v-267773d7=""
            >
                ${title}
            </h2>
            <div
                class="cart-item-params"
                data-v-267773d7=""
            >
                <div
                    class="cart-item-param"
                    data-v-267773d7=""
                >
                    <div
                        class="cart-item-param-name"
                        data-v-267773d7=""
                    >
                        <span data-v-267773d7=""
                            >Состав</span
                        >
                    </div>
                    <div
                        class="cart-item-param-value"
                        data-v-267773d7=""
                    >
                        ${composition}
                    </div>
                </div>
            </div>
            <!----><!----><!---->
        </div>
    </div>
    <div
        class="cart-item-col"
        data-v-267773d7=""
    >
        <div
            class="cart-item-quantity"
            data-v-267773d7=""
        >
            <div
                class="change-quantity"
                data-v-267773d7=""
            >
                <span
                    class="change-quantity-minus"
                    data-v-267773d7=""
                    data-id="${id}"
                    >–</span
                ><input
                    type="text"
                    value="${count}"
                    class="change-quantity-value"
                    maxlength="3"
                    size="1"
                    min="1"
                    data-v-267773d7=""
                /><span
                    class="change-quantity-plus"
                    data-v-267773d7=""
                    data-id="${id}"
                    >+</span
                >
            </div>
        </div>
        <div
            class="cart-item-price"
            data-v-267773d7=""
        >
            <!---->
            <div
                class="price"
                data-v-267773d7=""
            >
                <span data-v-267773d7=""
                    >${price}</span
                >
                ₽ за шт.
            </div>
            <div
                class="full-price"
                data-v-267773d7=""
            >
                =
                <span data-v-267773d7=""
                    >${count * price}</span
                >
                ₽
            </div>
        </div>
        <div
            class="cart-item-delete"
            data-v-267773d7=""
            data-id="${id}"
        >
            <a
                href="#"
                class="cart-item-delete"
                title="Удалить из Корзины"
                data-v-267773d7=""
                data-id="${id}"
                ><svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="#fff"
                    xmlns="http://www.w3.org/2000/svg"
                    data-v-267773d7=""
                >
                    <circle
                        cx="13.125"
                        cy="12.8159"
                        r="12.5"
                        data-v-267773d7=""
                    ></circle>
                    <path
                        d="M17.987 7.25941H15.4403V6.79636C15.4403 6.0304 14.8171 5.40723 14.0512 5.40723H12.199C11.433 5.40723 10.8098 6.0304 10.8098 6.79636V7.25941H8.26308C7.62477 7.25941 7.10547 7.77872 7.10547 8.41702V10.0377C7.10547 10.2934 7.3128 10.5007 7.56851 10.5007H7.82157L8.22161 18.9016C8.25695 19.6435 8.86643 20.2247 9.60916 20.2247H16.641C17.3837 20.2247 17.9932 19.6435 18.0285 18.9016L18.4286 10.5007H18.6816C18.9373 10.5007 19.1447 10.2934 19.1447 10.0377V8.41702C19.1447 7.77872 18.6254 7.25941 17.987 7.25941ZM11.7359 6.79636C11.7359 6.54105 11.9437 6.33332 12.199 6.33332H14.0512C14.3065 6.33332 14.5142 6.54105 14.5142 6.79636V7.25941H11.7359V6.79636ZM8.03156 8.41702C8.03156 8.28937 8.13543 8.1855 8.26308 8.1855H17.987C18.1147 8.1855 18.2186 8.28937 18.2186 8.41702V9.57464C18.0759 9.57464 8.6229 9.57464 8.03156 9.57464V8.41702ZM17.1035 18.8576C17.0917 19.1049 16.8885 19.2986 16.641 19.2986H9.60916C9.36157 19.2986 9.15841 19.1049 9.14666 18.8576L8.7487 10.5007H17.5014L17.1035 18.8576Z"
                        fill="#FFF"
                        data-v-267773d7=""
                    ></path>
                    <path
                        d="M13.1252 18.3724C13.3809 18.3724 13.5882 18.1651 13.5882 17.9094V11.8898C13.5882 11.6341 13.3809 11.4268 13.1252 11.4268C12.8694 11.4268 12.6621 11.6341 12.6621 11.8898V17.9094C12.6621 18.1651 12.8694 18.3724 13.1252 18.3724Z"
                        fill="#FFF"
                        data-v-267773d7=""
                    ></path>
                    <path
                        d="M15.4406 18.3724C15.6963 18.3724 15.9036 18.1651 15.9036 17.9094V11.8898C15.9036 11.6341 15.6963 11.4268 15.4406 11.4268C15.1849 11.4268 14.9775 11.6341 14.9775 11.8898V17.9094C14.9775 18.1651 15.1848 18.3724 15.4406 18.3724Z"
                        fill="#FFF"
                        data-v-267773d7=""
                    ></path>
                    <path
                        d="M10.8097 18.3724C11.0654 18.3724 11.2728 18.1651 11.2728 17.9094V11.8898C11.2728 11.6341 11.0654 11.4268 10.8097 11.4268C10.554 11.4268 10.3467 11.6341 10.3467 11.8898V17.9094C10.3467 18.1651 10.554 18.3724 10.8097 18.3724Z"
                        fill="#FFF"
                        data-v-267773d7=""
                    ></path></svg></a>
        </div>
    </div></div>`;
    return card;
}

function renderFinalCart() {
    mainScreen.innerHTML = "";
    const container = document.createElement("div");
    container.className = "page";
    container.innerHTML = `<div class="container">
    <div id="checkout" class="checkout">
        <div class="checkout-main">
            <form action="" id="soa-form">
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-row-name">
                            <span class="color-red">Телефон *</span>
                        </div>
                        <input
                            value=""
                            type="number"
                            name="ORDER_PROP_3"
                            id="soa-property-3"
                            class="masked"
                            size="30"
                        />
                    </div>
                </div>

                <div class="form-section">
                    <div class="form-row">
                        <div class="form-row-name">
                            <span class="color-red">Способ оплаты</span>
                        </div>
                        <div class="payment-list">
                            <div class="payment-item selected" data-id="1">
                                Наличные
                            </div>
                            <div class="payment-item" data-id="2">
                                Картой курьеру
                            </div>
                            <div class="payment-item" data-id="3">
                                Картой на сайте
                            </div>
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-row-name">
                            <span class="color-red">Улица *</span>
                        </div>
                        <input
                            value=""
                            type="text"
                            name="ORDER_PROP_3"
                            id="soa-property-3"
                            class="masked"
                            size="25"
                        />
                    </div>
                    <div class="form-cols">
                        <div class="form-row">
                            <div class="form-row-name">
                                <span class="color-red">Дом *</span>
                            </div>
                            <input
                                type="text"
                                required="required"
                                name="ORDER_PROP_13"
                                value=""
                                size="5"
                            />
                        </div>
                        <div class="form-row">
                            <div class="form-row-name">
                                <span class="color-red">Квартира *</span>
                            </div>
                            <input
                                type="number"
                                required="required"
                                name="ORDER_PROP_9"
                                value=""
                                size="5"
                            />
                        </div>
                        <div class="form-row">
                            <div class="form-row-name">
                                <span class="color-red">Подъезд</span>
                            </div>
                            <input
                                type="number"
                                name="ORDER_PROP_10"
                                value=""
                                size="5"
                            />
                        </div>
                        <div class="form-row">
                            <div class="form-row-name">
                                <span class="color-red">Этаж</span>
                            </div>
                            <input
                                type="number"
                                name="ORDER_PROP_11"
                                value=""
                                size="5"
                            />
                        </div>
                    </div>
                </div>
                <div class="form-section">
                    <div class="form-row">
                        <div class="form-row-name">
                            <span class="color-red"
                                >Количество приборов</span
                            >
                        </div>
                        <input
                            type="number"
                            name="ORDER_PROP_10"
                            value="1"
                            min="0"
                            max="10"
                            size="5"
                        />
                    </div>

                    <div class="form-row">
                        <div class="form-row-name">
                            <span class="color-red">Комментарий</span>
                        </div>
                        <textarea
                            id="orderDescription"
                            cols="4"
                            rows="30"
                            class=""
                            name="ORDER_DESCRIPTION"
                        ></textarea>
                    </div>
                </div>
                <div class="form-description">
                    <span class="color-red">*</span> — поля, обязательные
                    для заполнения
                </div>
                <button type="submit" class="button js_submit">
                    Оформить заказ
                </button>
            </form>
        </div>
        <div class="checkout-total">
            <div class="checkout-total-item-list">
            </div>
            <div class="checkout-total-values">
                <div class="checkout-total-value order-price">
                    Сумма заказа:
                    <span class="color-red"
                        ><span class="price-val order-summ"></span> ₽</span
                    >
                </div>
                <div class="checkout-total-value delivery-price">
                    Доставка:
                    <span class="color-red"
                        ><span class="price-val delivery-summ"></span> ₽</span
                    >
                </div>
                <div class="checkout-total-value total">
                    Итого:
                    <span class="color-red"
                        ><span class="price-val total-summ">300</span> ₽</span
                    >
                </div>
            </div>
        </div>
    </div></div>`;
    const paymentList = container.querySelectorAll(".payment-item");
    paymentList.forEach((item) => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const id = e.target.dataset.id;
            paymentList.forEach((item) => {
                if (item.dataset.id === id) {
                    item.classList.add("selected");
                } else {
                    item.classList.remove("selected");
                }
            });
        });
    });
    const orderList = container.querySelector(".checkout-total-item-list");
    const orderSumm = container.querySelector(".order-summ");
    const delivery = container.querySelector(".delivery-summ");
    const totalSumm = container.querySelector(".total-summ");
    cart.cartGoods.forEach((item) =>
        orderList.append(renderCardFinalCart(item))
    );
    const totalPrice = cart.cartGoods.reduce(
        (sum, item) => sum + item.price * item.count,
        0
    );
    orderSumm.textContent = totalPrice;
    delivery.textContent = totalPrice >= 800 ? 0 : 100;
    totalSumm.textContent = totalPrice + +delivery.textContent;
    mainScreen.append(container);

    const buttonOrder = container.querySelector(".js_submit");
    const form = container.querySelector("#soa-form");
    buttonOrder.addEventListener("click", () => {
        form.reset();
        alert("Ой, что-то пошло не так:(");
    });
}

function renderCardFinalCart(objCard) {
    const { title, price, image, count } = objCard;
    const card = document.createElement("div");
    card.className = "checkout-total-item";
    card.innerHTML = `<div class="checkout-total-item-pic">
    <img
        src="db/img/${image}"
        alt=""
    />
</div>

<div class="checkout-total-item-content">
    <div class="checkout-total-item-name">
        ${title}
    </div>
    <div class="checkout-total-item-measure">${count} шт</div>
    <div class="checkout-total-item-props"></div>
    <div class="checkout-total-item-price">${count * price} ₽</div>
</div>`;
    return card;
}

getGoods();
